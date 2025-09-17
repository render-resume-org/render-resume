"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { 
    signInWithEmail, 
    signInWithGoogle, 
    loading, 
    error, 
    clearError,
    isAuthenticated,
    redirectToDashboard
  } = useAuth();

  // 清除錯誤當輸入改變時
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, clearError, error]);

  // 當用戶登入成功時顯示成功畫面並嘗試多種重定向方式
  useEffect(() => {
    if (isAuthenticated) {
      console.log('🔄 [LoginForm] User authenticated, attempting redirect');
      
      // 方法1: 立即使用 router
      redirectToDashboard();
      
      // 方法2: 延遲使用 window.location (backup)
      const fallbackRedirect = setTimeout(() => {
        console.log('🔄 [LoginForm] Fallback redirect using window.location');
        window.location.href = '/dashboard';
      }, 1000);
      
      // 方法3: 更長的 fallback
      const ultimateFallback = setTimeout(() => {
        console.log('🔄 [LoginForm] Ultimate fallback redirect');
        window.location.replace('/dashboard');
      }, 2000);
      
      // 清理定時器
      return () => {
        clearTimeout(fallbackRedirect);
        clearTimeout(ultimateFallback);
      };
    }
  }, [isAuthenticated, redirectToDashboard]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      await signInWithEmail(email, password);
    } catch (error) {
      // 錯誤已在 hook 中處理
      console.error('登入失敗:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // 錯誤已在 hook 中處理
      console.error('Google 登入失敗:', error);
    }
  };

  // 如果已經認證，顯示成功狀態
  if (isAuthenticated) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                登入成功！
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                正在重定向到您的儀表板...
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  如果系統沒有自動導向，請點擊下方按鈕：
                </p>
                <button
                  onClick={() => {
                    console.log('🔄 [LoginForm] Manual redirect button clicked');
                    // 嘗試多種跳轉方式
                    try {
                      window.location.href = '/dashboard';
                    } catch (error) {
                      console.error('跳轉失敗:', error);
                      window.location.replace('/dashboard');
                    }
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  前往儀表板
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">登入</CardTitle>
          <CardDescription>
            輸入您的電子郵件地址以登入您的帳戶
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <div className="flex flex-col gap-6">
              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                使用 Google 登入
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                    或
                  </span>
                </div>
              </div>

              {/* Email Input */}
              <div className="grid gap-2">
                <Label htmlFor="email">電子郵件</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">密碼</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm text-cyan-600 hover:text-cyan-700 underline-offset-4 hover:underline"
                  >
                    忘記密碼？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-700" 
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    登入中...
                  </>
                ) : (
                  "登入"
                )}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            還沒有帳戶？{" "}
            <Link href="/auth/sign-up" className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4">
              註冊
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
