import { Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-12 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-gray-900 dark:text-white">RenderResume</span>
              </div>
              <div className="flex space-x-4">
                <a href="mailto:info@render-resume.com" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors flex gap-2 items-center justify-center">
                  <Mail className="h-5 w-5" />
                  info@render-resume.com              
                </a>
               
              </div>
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-8">
              © 2025 RenderResume 版權所有
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">產品</h3>
            <ul className="space-y-2">
                <li>
                <Link href="/pricing" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors">
                    價格方案
                </Link>
                </li>
            </ul>
          </div>

          {/* Team Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">團隊</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors">
                  常見問題
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors">
                  服務條款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors">
                  隱私政策
                </Link>
              </li>
              <li>
                <Link target="_blank" href="https://forms.gle/XdYUd8wRrqS5WJw59" className="text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors">
                  意見回饋
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
} 