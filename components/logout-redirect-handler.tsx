"use client";

import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export function LogoutRedirectHandler() {
  const { isAuthenticated, loading, redirectToHome } = useAuth();

  useEffect(() => {
    // 如果用戶未登入且不在載入狀態，重定向到首頁
    if (!loading && !isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, loading, redirectToHome]);

  return null; // 這個組件不渲染任何UI
} 