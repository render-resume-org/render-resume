"use client";

import { createClient } from "@/lib/supabase/client";
import { clearSessionData } from "@/utils";
import { AuthError, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Extended User type to include database user data
interface ExtendedUser extends User {
  display_name?: string;
  avatar_url?: string;
  email?: string;
  welcome_email_sent?: boolean;
  currentPlan?: {
    id: number;
    title: string;
    type: string;
    daily_usage: number;
    expire_at: string | null;
  } | null;
}

interface AuthState {
  user: ExtendedUser | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });
  const router = useRouter();
  const supabase = createClient();

  // Function to sync user data with database
  const syncUserData = useCallback(async (authUser: User): Promise<ExtendedUser> => {
    try {
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const { user: dbUser } = await response.json();
        return { 
          ...authUser, 
          display_name: dbUser.display_name,
          avatar_url: dbUser.avatar_url,
          email: dbUser.email,
          welcome_email_sent: dbUser.welcome_email_sent,
          currentPlan: dbUser.currentPlan
        };
      } else {
        console.error('Failed to sync user data:', await response.text());
        return authUser as ExtendedUser;
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
      return authUser as ExtendedUser;
    }
  }, []);

  // Function to refresh user plan data
  const refreshUserPlan = useCallback(async () => {
    if (!authState.user) return;

    try {
      const response = await fetch(`/api/users/${authState.user.id}`);
      if (response.ok) {
        const userData = await response.json();
        setAuthState(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            welcome_email_sent: userData.welcome_email_sent,
            currentPlan: userData.currentPlan
          } : null,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user plan:', error);
    }
  }, [authState.user]);

  useEffect(() => {
    // 獲取初始認證狀態
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          // Sync user data with database
          const syncedUser = await syncUserData(session.user);
          setAuthState({
            user: syncedUser,
            loading: false,
            error: null,
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        setAuthState({
          user: null,
          loading: false,
          error: error instanceof Error ? error.message : '獲取認證狀態失敗',
        });
      }
    };

    getInitialSession();

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 [Auth] State changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          // 登出時完全清理狀態
          console.log('👋 [Auth] User signed out, clearing state');
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
          return;
        }
        
        if (session?.user) {
          // Sync user data with database for sign in events
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            console.log('✅ [Auth] Syncing user data for event:', event);
            const syncedUser = await syncUserData(session.user);
            setAuthState({
              user: syncedUser,
              loading: false,
              error: null,
            });
          } else {
            setAuthState({
              user: session.user as ExtendedUser,
              loading: false,
              error: null,
            });
          }
        } else if (event !== 'INITIAL_SESSION') {
          // 只有在非初始 session 檢查時才清理狀態
          setAuthState({
            user: null,
            loading: false,
            error: null,
          });
        }
        
        // 如果是新用戶註冊（包括 Google OAuth），發送歡迎郵件
        if (event === 'SIGNED_IN' && session?.user?.email) {
          // 同步用戶資料以獲取最新的 welcome_email_sent 狀態
          const syncedUser = await syncUserData(session.user);
          
          // 更精確的新用戶檢測邏輯
          const userCreatedAt = new Date(session.user.created_at);
          const now = new Date();
          const timeDifference = now.getTime() - userCreatedAt.getTime();
          
          // 判斷是否為新用戶：
          // 1. 創建時間在 2 分鐘內
          // 2. 且尚未發送歡迎郵件
          const isRecentlyCreated = timeDifference < 120000; // 2 分鐘內
          const hasNotSentWelcomeEmail = !syncedUser.welcome_email_sent;
          const isNewUser = isRecentlyCreated && hasNotSentWelcomeEmail;
          
          console.log('🔍 [Auth] New user check:', {
            userCreatedAt: userCreatedAt.toISOString(),
            timeDifference: `${Math.round(timeDifference / 1000)}s`,
            isRecentlyCreated,
            hasNotSentWelcomeEmail,
            isNewUser,
            email: session.user.email
          });
          
          // 只有在確定是新用戶且尚未發送歡迎郵件時才發送
          if (isNewUser) {
            try {
              const userName = session.user.user_metadata?.full_name || 
                             session.user.user_metadata?.name || 
                             session.user.email.split('@')[0];
              
              console.log('📧 [Auth] Sending welcome email for new user:', session.user.email);
              
              const response = await fetch('/api/send-waitlist-welcome', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: session.user.email,
                  userName,
                }),
              });
              
              const responseData = await response.json();
              
              if (response.ok) {
                if (responseData.alreadySent) {
                  console.log('ℹ️ [Auth] Welcome email already sent for user');
                } else {
                  console.log('✅ [Auth] Waitlist welcome email sent for new user');
                  // 更新本地狀態以反映歡迎郵件已發送
                  setAuthState(prev => ({
                    ...prev,
                    user: prev.user ? {
                      ...prev.user,
                      welcome_email_sent: true
                    } : null,
                  }));
                }
              } else {
                console.warn('⚠️ [Auth] Failed to send waitlist welcome email for new user:', responseData.error);
              }
            } catch (emailError) {
              console.error('❌ [Auth] Error sending waitlist welcome email for new user:', emailError);
            }
          } else {
            console.log('ℹ️ [Auth] Skipping welcome email - not a new user or already sent');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, syncUserData]);

  // 電子郵件密碼登入
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log('✅ [Auth] Email sign in successful');
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : '登入失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // Google OAuth 登入
  const signInWithGoogle = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      console.log('🚀 [Auth] Google OAuth initiated');
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : 'Google 登入失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // 電子郵件註冊
  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/sign-up`,
        },
      });
      
      if (error) throw error;
      
      console.log('✅ [Auth] Email sign up successful');
      
      // 歡迎郵件將由 onAuthStateChange 統一處理，確保只發送一次
      
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : '註冊失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // 更新用戶資料
  const updateProfile = async (data: { display_name: string }) => {
    try {
      if (!authState.user) {
        throw new Error('用戶未登入');
      }

      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/users/${authState.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新個人資料失敗');
      }
      
      const updatedUser = await response.json();
      
      // 更新本地認證狀態
      setAuthState(prev => ({
        ...prev,
        user: prev.user ? {
          ...prev.user,
          display_name: updatedUser.display_name,
          welcome_email_sent: updatedUser.welcome_email_sent,
          currentPlan: updatedUser.currentPlan
        } : null,
        loading: false,
      }));
      
      console.log('✅ [Auth] Profile updated successfully');
      return updatedUser;
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : '更新個人資料失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // 登出
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      // 清除所有本地狀態
      setAuthState({
        user: null,
        loading: true,
        error: null,
      });
      
      // 清除本地 session 存储
      try {
        // 清除 localStorage 中的認證相關數據
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('supabase.') || 
            key.startsWith('sb-') || 
            key.includes('auth') ||
            key.includes('session') ||
            key.includes('token')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // 清除 sessionStorage 中的認證相關數據
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.startsWith('supabase.') || 
            key.startsWith('sb-') || 
            key.includes('auth') ||
            key.includes('session') ||
            key.includes('token')
          )) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        // 清除智慧問答會話數據
        clearSessionData();
        
        console.log('🧹 [Auth] Local storage cleared');
      } catch (storageError) {
        console.warn('⚠️ [Auth] Error clearing local storage:', storageError);
      }
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // 確保完全清理認證狀態
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
      
      console.log('👋 [Auth] Sign out successful');
      
      // 立即重定向到登入頁面
      router.push('/auth/login');
      
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : '登出失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // 重置密碼
  const resetPassword = async (email: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      console.log('📧 [Auth] Password reset email sent');
      setAuthState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof AuthError 
        ? error.message 
        : '重置密碼失敗，請重試';
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  };

  // 清除錯誤
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // 手動重定向方法
  const redirectToDashboard = () => {
    // 使用 replace 而不是 push，避免在歷史記錄中留下重定向頁面
    router.replace('/dashboard');
  };

  const redirectToHome = () => {
    router.replace('/');
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAuthenticated: !!authState.user,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
    updateProfile,
    signOut,
    resetPassword,
    clearError,
    redirectToDashboard,
    redirectToHome,
    refreshUserPlan,
  };
} 