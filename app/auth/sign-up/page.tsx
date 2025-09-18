"use client";

import { SignUpForm } from "@/features/auth/components/sign-up-form";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import Link from "next/link";

export default function SignUpPage() {
  useAuthRedirect();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              開始您的履歷之旅
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              註冊帳戶，讓 AI 為您打造專業履歷
            </p>
          </div>
          
          <SignUpForm />
          
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
