"use client";

import { AnnouncementPreviewCard } from "@/components/announcements/announcement-preview-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnnouncementsPaginated, PaginatedAnnouncements } from "@/lib/actions/announcements";
import { ChevronLeft, ChevronRight, Home, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function AnnouncementListSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb - Static Content */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            儀表板
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">系統公告</span>
        </nav>

        {/* Header - Static Content */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            系統公告
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看最新的功能更新和系統維護等重要通知
          </p>
        </div>

        {/* Announcement Cards Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="mb-4">
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex items-center space-x-1">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AnnouncementsPage() {
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
      const result = await getAnnouncementsPaginated(page, 10);
      if (result) {
        setData(result);
      } else {
        setData({
          announcements: [],
          totalCount: 0,
          hasMore: false,
        });
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      setError('載入公告時發生錯誤');
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
    loadAnnouncements(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil((data?.totalCount || 0) / 10);

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

  if (loading) {
    return <AnnouncementListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            儀表板
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">系統公告</span>
        </nav>

        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              系統公告
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看最新的功能更新和系統維護等重要通知
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500 dark:text-red-400" />
              <p className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{error}</p>
              <Button 
                variant="outline" 
                onClick={() => loadAnnouncements(currentPage)}
                className="border-gray-300 hover:border-gray-400"
              >
                重試
              </Button>
            </div>
          ) : !data || data.announcements.length === 0 ? (
            <div className="text-center py-12">
              <Info className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">目前沒有公告</p>
              <p className="text-gray-600 dark:text-gray-400">當有新的系統公告時，將會顯示在這裡</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.announcements.map((announcement) => (
                <AnnouncementPreviewCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="border-gray-300 hover:border-gray-400"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                上一頁
              </Button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400">
                第 {currentPage} 頁，共 {totalPages} 頁
              </span>
              
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="border-gray-300 hover:border-gray-400"
              >
                下一頁
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 