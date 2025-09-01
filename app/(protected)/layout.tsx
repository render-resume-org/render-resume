"use client";

import { ProUserGuard } from "@/components/auth/pro-user-guard";
import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

// Define routes that require pro user access
const PRO_ROUTES = [
  '/upload',
  '/analyze',
  '/smart-chat',
  '/download',
  // Add more pro routes here as needed
];

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(3);
  const [showUnauthenticated, setShowUnauthenticated] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current route requires pro access
  const isProRoute = PRO_ROUTES.some(route => pathname.startsWith(route));

  // 處理導航的 useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.push('/auth/login');
    }
  }, [shouldRedirect, router]);

  useEffect(() => {
    // 清理之前的 timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // 重置導航狀態
    setShouldRedirect(false);

    // 如果還在加載中，不做任何處理
    if (loading) {
      setShowUnauthenticated(false);
      return;
    }

    // 如果用戶已登入，確保顯示認證內容
    if (isAuthenticated) {
      setShowUnauthenticated(false);
      setCountdown(3); // 重置倒數計時
      return;
    }

    // 如果用戶未登入，顯示未認證畫面並開始倒數計時
    if (!isAuthenticated) {
      setShowUnauthenticated(true);
      setCountdown(3); // 重置倒數計時
      
      // 使用 setTimeout 來延遲開始倒數計時，避免在渲染過程中更新狀態
      const startTimer = setTimeout(() => {
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              // 設置導航標記而不是直接導航
              setShouldRedirect(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, 100); // 延遲 100ms 開始倒數計時

      return () => {
        clearTimeout(startTimer);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [loading, isAuthenticated]);

  // 組件卸載時清理 timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 手動導航處理函數
  const handleRedirectToLogin = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    router.push('/auth/login');
  };

  // 如果還在加載中，顯示加載畫面
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">正在驗證身份...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 如果用戶未登入且應該顯示未認證畫面，顯示需要登入的訊息
  if (!isAuthenticated && showUnauthenticated) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                哎呀，這樣也被你發現，厲害！
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                但 RenderResume 還在 Waitlist 階段，功能將在測試階段開放
              </p>
            </div>
            
            <Card>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <ShieldAlert className="h-6 w-6 text-destructive" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">需要登入才能繼續探索</CardTitle>
                  <CardDescription>
                    想搶先體驗嗎？先登入加入我們的 Waitlist 吧！
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950">
                  <p className="text-sm text-cyan-800 dark:text-cyan-200">
                    {countdown} 秒後將自動導向登入頁面...
                  </p>
                </div>
                <Button
                  onClick={handleRedirectToLogin}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  立即登入加入 Waitlist
                </Button>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                ← 返回首頁
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 如果用戶已登入，檢查是否需要 Pro 權限
  if (isAuthenticated) {
    // 如果是 Pro 路由，使用 Pro 用戶保護
    if (isProRoute) {
      return (
        <ProUserGuard fallbackPath="/dashboard">
          {children}
        </ProUserGuard>
      );
    }
    
    // 一般保護路由，直接顯示內容
    return <>{children}</>;
  }

  // Fallback - 這裡不應該到達
  return null;
}
