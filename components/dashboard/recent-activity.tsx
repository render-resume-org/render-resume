import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

export function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="h-4 w-4" />
            最近活動
          </h3>
          <Link href="/activity">
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
            >
              更多
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm font-medium mb-1">還沒有任何履歷記錄</p>
          <p className="text-xs">開始創建您的第一份履歷吧！</p>
        </div>
      </div>
    </div>
  );
} 