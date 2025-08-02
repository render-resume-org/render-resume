import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-cyan-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-lg font-bold">✨</span>
              </div>
              <span className="text-xl font-bold">RenderResume｜AI 履歷生成器</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              基於 Fortune 500 企業標準的專業履歷分析平台，採用六維度評估模型和 STAR 原則，
              幫助您打造完美履歷，在職涯競爭中脫穎而出。
            </p>
            <div className="flex space-x-4">
              <a href="mailto:info@render-resume.com" className="text-gray-400 hover:text-cyan-400 transition-colors flex gap-2 items-center justify-center">
                <Mail className="h-5 w-5" />
                info@render-resume.com              
              </a>
             
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">關於產品</h3>
            <ul className="space-y-2">
                <li>
                <Link href="/about#vision" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    產品願景
                </Link>
                </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">支援服務</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/announcements" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  系統公告
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  使用說明
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  常見問題
                </Link>
              </li>
              <li>
                <Link target="_blank" href="https://forms.gle/XdYUd8wRrqS5WJw59" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  意見回饋
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 RenderResume 版權所有
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">
              隱私政策
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">
              服務條款
            </Link>
            {/* <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Cookie 政策
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
} 