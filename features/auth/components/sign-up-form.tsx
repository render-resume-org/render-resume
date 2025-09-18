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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { 
    signUpWithEmail, 
    signInWithGoogle, 
    loading, 
    error, 
    clearError,
    isAuthenticated,
    redirectToDashboard
  } = useAuth();

  // 清除錯誤當輸入改變時
  useEffect(() => {
    if (error || localError) {
      clearError();
      setLocalError(null);
    }
  }, [email, password, repeatPassword, clearError, error, localError]);

  // 當用戶註冊成功時自動重定向
  useEffect(() => {
    if (isAuthenticated) {
      // 減少延遲時間，更快速的重定向
      const timer = setTimeout(() => {
        console.log('🔄 [SignUpForm] Redirecting to dashboard');
        redirectToDashboard();
      }, 800); // 從 1500ms 減少到 800ms
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, redirectToDashboard]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !repeatPassword) {
      return;
    }

    if (password !== repeatPassword) {
      setLocalError("密碼不一致");
      return;
    }

    if (password.length < 6) {
      setLocalError("密碼必須至少 6 個字元");
      return;
    }

    try {
      await signUpWithEmail(email, password);
      setIsSuccess(true);
    } catch (error) {
      // 錯誤已在 hook 中處理
      console.error('註冊失敗:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // 錯誤已在 hook 中處理
      console.error('Google 註冊失敗:', error);
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
                註冊成功！
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                正在重定向到您的儀表板...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                如果系統沒有自動導向，請
                <Link 
                  href="/dashboard" 
                  className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline ml-1"
                >
                  點擊連結跳轉
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 如果註冊成功（但可能需要驗證郵件）
  if (isSuccess) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                註冊成功！
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                我們已發送驗證郵件到您的信箱 <strong>{email}</strong>，請點擊郵件中的連結完成驗證。
              </p>
              <div className="pt-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    返回登入頁面
                  </Button>
                </Link>
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
          <CardTitle className="text-2xl">註冊</CardTitle>
          <CardDescription>創建新帳戶開始使用服務</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp}>
            <div className="flex flex-col gap-6">
              {/* Google OAuth Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
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
                使用 Google 註冊
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
                <Label htmlFor="password">密碼</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="至少 6 個字元"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Repeat Password Input */}
              <div className="grid gap-2">
                <Label htmlFor="repeat-password">確認密碼</Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="再次輸入密碼"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Error Display */}
              {(error || localError) && (
                <div className="p-3 text-sm text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950 rounded-lg">
                  {localError || error}
                </div>
              )}

              {/* Terms and Privacy Agreement */}
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                點擊「註冊」即表示您同意我們的{" "}
                <Link
                  href="/terms"
                  className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  服務條款
                </Link>
                {" "}和{" "}
                <Link
                  href="/privacy"
                  className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  隱私權政策
                </Link>
                。
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-cyan-600 hover:bg-cyan-700" 
                disabled={loading || !email || !password || !repeatPassword}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    註冊中...
                  </>
                ) : (
                  "註冊"
                )}
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm">
              已有帳戶？{" "}
              <Link
                href="/auth/login"
                className="text-cyan-600 hover:text-cyan-700 underline underline-offset-4"
              >
                立即登入
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
