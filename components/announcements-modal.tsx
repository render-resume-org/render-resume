"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAnnouncementsPaginated, PaginatedAnnouncements } from "@/lib/actions/announcements";
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Info, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface AnnouncementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function AnnouncementsModal({ open, onOpenChange }: AnnouncementsModalProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaginatedAnnouncements>({
    announcements: [],
    totalCount: 0,
    hasMore: false,
  });

  const loadAnnouncements = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAnnouncementsPaginated(page, 5);
      if (result) {
        setData(result);
      } else {
        // 如果result為null或undefined，設置默認值
        setData({
          announcements: [],
          totalCount: 0,
          hasMore: false,
        });
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setError('載入公告時發生錯誤');
      // 確保即使出錯也有默認數據結構
      setData({
        announcements: [],
        totalCount: 0,
        hasMore: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadAnnouncements(currentPage);
    }
  }, [open, currentPage]);

  // 安全的計算總頁數，確保data存在且totalCount是數字
  const totalPages = Math.ceil((data?.totalCount || 0) / 5);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="text-left px-4">
          <DialogTitle className="flex items-center gap-2 flex-wrap">
            📢 系統公告
            <span className="text-sm font-normal text-muted-foreground">
              (共 {data?.totalCount || 0} 則)
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-left py-8 text-red-500 dark:text-red-400">
              {error}
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadAnnouncements(currentPage)}
                >
                  重試
                </Button>
              </div>
            </div>
          ) : !data || data.announcements.length === 0 ? (
            <div className="text-left py-8 text-gray-500 dark:text-gray-400">
              目前沒有公告
            </div>
          ) : (
            <div className="space-y-4">
              {data.announcements.map((announcement) => {
                const Icon = typeIcons[announcement.type];
                const className = typeStyles[announcement.type];
                
                return (
                  <div key={announcement.id} className={`${className} relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3`} style={{ textAlign: 'left' }}>
                    <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="break-words word-wrap overflow-wrap-anywhere text-left font-medium tracking-tight mb-2">
                        {announcement.title}
                      </div>
                      <div className="text-muted-foreground text-left">
                        <div className="whitespace-pre-wrap break-words word-wrap overflow-wrap-anywhere leading-relaxed text-left" style={{ textAlign: 'left' }}>
                          {announcement.content}
                        </div>
                        <div className="w-full text-end text-xs text-muted-foreground mt-2">
                          {new Date(announcement.created_at).toLocaleString('zh-TW')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              上一頁
            </Button>
            
            <span className="text-sm text-muted-foreground">
              第 {currentPage} 頁，共 {totalPages} 頁
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || loading}
            >
              下一頁
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 