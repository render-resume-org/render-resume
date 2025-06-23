import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // 關鍵！禁用靜態生成
export const runtime = 'edge'; // 維持你的 Edge Runtime

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon/Number */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-6">
            <span className="text-6xl font-bold text-white">404</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          找不到頁面
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          抱歉，您要找的頁面不存在或已被移除。<br />
          讓我們幫您回到正確的地方。
        </p>

        {/* Error Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
            <Search className="h-5 w-5" />
            <span className="text-sm font-medium">可能的原因</span>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• 網址可能輸入錯誤</li>
            <li>• 頁面可能已被移動或刪除</li>
            <li>• 連結可能已過期</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>回到首頁</span>
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="javascript:history.back()" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5" />
              <span>返回上頁</span>
            </Link>
          </Button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            需要幫助？
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            <Link 
              href="/auth/login" 
              className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              登入帳戶
            </Link>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
            <Link 
              href="/auth/sign-up" 
              className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              建立新帳戶
            </Link>
            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
            <Link 
              href="/faq" 
              className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              常見問題
            </Link>
          </div>
        </div>

        {/* Brand Reference */}
        <div className="mt-8">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            RenderResume - AI 履歷生成器
          </p>
        </div>
      </div>
    </div>
  );
} 