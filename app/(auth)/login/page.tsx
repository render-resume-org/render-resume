"use client";

import { LoginForm } from "@/features/auth/components";
import { useAuthRedirect } from "@/features/auth/hooks/use-auth-redirect";
import Link from "next/link";

export default function LoginPage() {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              歡迎回來
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              登入您的帳戶繼續使用 AI 履歷編輯器
            </p>
          </div>
          
          <LoginForm />
          
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
