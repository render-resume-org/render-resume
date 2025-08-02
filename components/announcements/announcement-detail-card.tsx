import { AnnouncementTable } from "@/lib/types";
import { formatSmartTime } from "@/lib/utils/time";
import { Eye } from "lucide-react";

interface AnnouncementDetailCardProps {
  announcement: AnnouncementTable;
}

export function AnnouncementDetailCard({ announcement }: AnnouncementDetailCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl text-gray-900 dark:text-white leading-tight">
          {announcement.title}
        </h1>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap break-words leading-relaxed text-gray-700 dark:text-gray-300 text-base">
            {announcement.content}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span>發布於 {formatSmartTime(announcement.created_at)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{announcement.views || 0} 次瀏覽</span>
          </div>
        </div>
      </div>
    </article>
  );
} 