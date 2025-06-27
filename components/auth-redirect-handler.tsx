"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { useEffect, useRef } from "react";

export function AuthRedirectHandler() {
  const { isAuthenticated, loading, redirectToDashboard } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // 如果用戶已經登入且不在載入狀態，重定向到儀表板
    if (!loading && isAuthenticated && !hasRedirected.current) {
      hasRedirected.current = true;
      
      // 延遲重定向，確保認證狀態完全穩定
      const timer = setTimeout(() => {
        console.log('🔄 [AuthRedirectHandler] Redirecting authenticated user to dashboard');
        redirectToDashboard();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading, redirectToDashboard]);

  return null; // 這個組件不渲染任何UI
} 