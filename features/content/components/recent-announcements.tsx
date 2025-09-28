"use client";

import { Button } from "@/components/ui/button";
import { AnnouncementTable } from "@/types/database";
import { formatSmartTime } from "@/utils/time";
import { ChevronRight, Megaphone } from "lucide-react";
import Link from "next/link";

interface RecentAnnouncementsProps {
  announcements: AnnouncementTable[];
}

// 自定義時間顯示：最近顯示相對時間，較舊顯示日期
function formatDashboardTime(date: Date | string): string {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

  // 小於 24 小時顯示相對時間
  if (diffInSeconds < 86400) {
    return formatSmartTime(targetDate);
  }

  // 超過 24 小時只顯示日期
  const isThisYear = targetDate.getFullYear() === now.getFullYear();
  
  if (isThisYear) {
    return targetDate.toLocaleDateString('zh-TW', {
      month: 'long',
      day: 'numeric'
    });
  }

  return targetDate.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function RecentAnnouncements({ announcements }: RecentAnnouncementsProps) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // 只显示最新的3个公告
  const latestAnnouncements = announcements.slice(0, 3);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            系統公告
          </h3>
          <Link href="/announcements">
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
      {latestAnnouncements.map((announcement, index) => (
        <Link 
          key={announcement.id} 
          href={`/announcements/${announcement.id}`}
          className="block"
        >
          <div className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
            index !== latestAnnouncements.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
          }`}>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-xs font-medium text-gray-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors line-clamp-1 flex-1">
                {announcement.title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {formatDashboardTime(announcement.created_at)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 