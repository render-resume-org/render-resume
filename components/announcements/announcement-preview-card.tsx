import { AnnouncementTable } from "@/types";
import { parseContentWithLinks } from "@/lib/utils/parse-content-with-links";
import { formatSmartTime } from "@/lib/utils/time";
import { Eye } from "lucide-react";
import Link from "next/link";

interface AnnouncementPreviewCardProps {
  announcement: AnnouncementTable;
}

export function AnnouncementPreviewCard({ announcement }: AnnouncementPreviewCardProps) {
  return (
    <Link href={`/announcements/${announcement.id}`} className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl text-gray-900 dark:text-white mb-3 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            {announcement.title}
          </h3>
          <div className="text-gray-600 dark:text-gray-300">
            <div className="whitespace-pre-wrap break-words leading-relaxed mb-4 line-clamp-3">
              {parseContentWithLinks(announcement.content || '')}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4">
          <span>{formatSmartTime(announcement.created_at)}</span>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{announcement.views || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
} 