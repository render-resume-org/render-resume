// 關鍵！禁用靜態生成，因為包含 Supabase 相關組件
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AuthRedirectHandler } from "@/components/auth-redirect-handler";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AuthRedirectHandler />
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              糟糕，密碼是什麼來著？
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              忘記密碼了嗎？別擔心，我們可以幫您重設。
            </p>
          </div>
          
          <ForgotPasswordForm />
          
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
