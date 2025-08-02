import { ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

export function ActivityContent() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="h-5 w-5" />
          履歷活動
        </h2>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            還沒有任何活動記錄
          </h3>
          <p className="text-sm mb-6">
            當您開始創建和管理履歷時，相關活動將會顯示在這裡
          </p>
          <Link href="/dashboard">
            <button className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
              <ChevronLeft className="h-4 w-4 mr-2" />
              返回儀表板
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 