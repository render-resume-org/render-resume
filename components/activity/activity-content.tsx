import { FileText } from "lucide-react";

export function ActivityContent() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

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
        </div>
      </div>
    </div>
  );
} 