import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

export function ActivityHeader() {
  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          儀表板
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">活動紀錄</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          活動紀錄
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看您的履歷創建和管理活動歷史
        </p>
      </div>
    </>
  );
} 