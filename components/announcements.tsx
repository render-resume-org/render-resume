"use client";

import { AnnouncementsModal } from "@/components/announcements-modal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AnnouncementTable } from "@/lib/types";
import { AlertCircle, CheckCircle, ChevronRight, Info, XCircle } from "lucide-react";
import { useState } from "react";

interface AnnouncementsProps {
  announcements: AnnouncementTable[];
}

const typeIcons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle,
  error: XCircle,
};

const typeStyles = {
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
  success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
};

export function Announcements({ announcements }: AnnouncementsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!announcements || announcements.length === 0) {
    return null;
  }

  // 只显示第一个公告
  const firstAnnouncement = announcements[0];

  const Icon = typeIcons[firstAnnouncement.type];
  const className = typeStyles[firstAnnouncement.type];

  return (
    <>
      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            📢 系統公告！
          </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(true)}
              className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
            >
              顯示更多
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
        
        <Alert className={className}>
          <Icon className="h-4 w-4" />
          <AlertTitle className="line-clamp-1">{firstAnnouncement.title}</AlertTitle>
        <AlertDescription className="mt-2">
                <div>
                    <div className="break-words word-wrap overflow-wrap-anywhere leading-relaxed">
                        {firstAnnouncement.content}
                    </div>
                </div>
            </AlertDescription>
        </Alert>
      </div>

      <AnnouncementsModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </>
  );
} 