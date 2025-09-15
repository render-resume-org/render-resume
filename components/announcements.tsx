"use client";

import { typeIcons, typeStyles } from "@/components/announcements/config";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AnnouncementTable } from "@/lib/types";
import { parseContentWithLinks } from "@/lib/utils/parse-content-with-links";
import { ChevronRight, Megaphone } from "lucide-react";
import Link from "next/link";

interface AnnouncementsProps {
  announcements: AnnouncementTable[];
}

export function Announcements({ announcements }: AnnouncementsProps) {
  if (!announcements || announcements.length === 0) {
    return null;
  }

  // 只显示第一个公告
  const firstAnnouncement = announcements[0];

  const Icon = typeIcons[firstAnnouncement.type];
  const className = typeStyles[firstAnnouncement.type];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          系統公告
        </h3>
        <Link href="/announcements">
          <Button
            variant="ghost"
            size="sm"
            className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
          >
            顯示更多
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <Alert className={className}>
        <Icon className="h-4 w-4" />
        <AlertTitle className="line-clamp-1">{firstAnnouncement.title}</AlertTitle>
        <AlertDescription className="mt-2">
          <div>
            <div className="break-words word-wrap overflow-wrap-anywhere leading-relaxed">
              {parseContentWithLinks(firstAnnouncement.content || '')}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
} 