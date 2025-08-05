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
              <span className="text-xl font-bold">RenderResume</span>
            </div>
            <div className="flex space-x-4">
              <a href="mailto:info@render-resume.com" className="text-gray-400 hover:text-cyan-400 transition-colors flex gap-2 items-center justify-center">
                <Mail className="h-5 w-5" />
                info@render-resume.com              
              </a>
             
            </div>
          </div>

          {/* Features Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">產品</h3>
            <ul className="space-y-2">
                <li>
                <Link href="/resume-builder" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    AI 履歷編輯器
                </Link>
                </li>
                <li>
                <Link href="/pricing" className="text-gray-400 hover:text-cyan-400 transition-colors">
                    價格方案
                </Link>
                </li>
            </ul>
          </div>

          {/* Team Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">團隊</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  常見問題
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  服務條款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  隱私政策
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
        </div>
      </div>
    </footer>
  );
} 