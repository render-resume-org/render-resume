"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success'>('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // 從 URL 中獲取認證代碼
        const code = searchParams.get('code');
        
        if (code) {
          // 使用代碼交換 session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error('❌ [Auth Callback] Exchange error:', error);
            router.push('/auth/login');
            return;
          }

          if (data.session) {
            console.log('✅ [Auth Callback] Session established:', data.session.user.email);
            setStatus('success');
            
            // 多種跳轉方式
            // 方法1: 立即使用 router
            router.push('/dashboard');
            
            // 方法2: 延遲使用 window.location (backup)
            setTimeout(() => {
              console.log('🔄 [Auth Callback] Fallback redirect using window.location');
              window.location.href = '/dashboard';
            }, 2000);
            
            // 方法3: 更長的 fallback
            setTimeout(() => {
              console.log('🔄 [Auth Callback] Ultimate fallback redirect');
              window.location.replace('/dashboard');
            }, 5000);
          } else {
            console.log('⚠️ [Auth Callback] No session in exchange response');
            router.push('/auth/login');
          }
        } else {
          // 如果沒有代碼，檢查現有 session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('❌ [Auth Callback] Session error:', error);
            router.push('/auth/login');
            return;
          }

          if (data.session) {
            console.log('✅ [Auth Callback] Existing session found:', data.session.user.email);
            setStatus('success');
            
            // 多種跳轉方式
            // 方法1: 立即使用 router
            router.push('/dashboard');
            
            // 方法2: 延遲使用 window.location (backup)
            setTimeout(() => {
              console.log('🔄 [Auth Callback] Fallback redirect using window.location');
              window.location.href = '/dashboard';
            }, 2000);
            
            // 方法3: 更長的 fallback
            setTimeout(() => {
              console.log('🔄 [Auth Callback] Ultimate fallback redirect');
              window.location.replace('/dashboard');
            }, 5000);
          } else {
            console.log('⚠️ [Auth Callback] No code and no session');
            router.push('/auth/login');
          }
        }
      } catch (err) {
        console.error('❌ [Auth Callback] Unexpected error:', err);
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              正在驗證...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              請稍候，我們正在處理您的登入請求
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              登入成功！
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              正在重定向到您的儀表板...
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  console.log('🔄 [Auth Callback] Manual redirect button clicked');
                  // 嘗試多種跳轉方式
                  try {
                    window.location.href = '/dashboard';
                  } catch (error) {
                    console.error('跳轉失敗:', error);
                    window.location.replace('/dashboard');
                  }
                }}
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer"
              >
                手動前往儀表板
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              如果頁面沒有自動跳轉，請點擊上方按鈕
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 flex items-center justify-center px-4 overflow-hidden">
      <div className="max-w-md w-full text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto"></div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            載入中...
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            正在初始化認證系統
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
} 