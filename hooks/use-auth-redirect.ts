"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";

/**
 * 自定義 Hook：處理已認證用戶的自動重定向邏輯
 * 當用戶在認證頁面（登入、註冊、忘記密碼）時，如果已經登入，會自動重定向到儀表板
 */
export function useAuthRedirect() {
  const { isAuthenticated, loading, redirectToDashboard } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // 如果用戶已經登入且不在載入狀態，立即重定向到儀表板
    if (!loading && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('🔄 [useAuthRedirect] Redirecting authenticated user to dashboard');
      redirectToDashboard();
    }
  }, [isAuthenticated, loading, redirectToDashboard]);

  // 重置重定向狀態（當認證狀態改變時）
  useEffect(() => {
    if (!isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);
}
