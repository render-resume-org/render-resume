"use client";

import { AnnouncementDetailCard } from "@/components/announcements/announcement-detail-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { logAnnouncementView } from "@/lib/actions/activity";
import { getAnnouncementById, incrementAnnouncementViews } from "@/lib/actions/announcements";
import { AnnouncementTable } from "@/lib/types";
import { ChevronLeft, ChevronRight, Home, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function AnnouncementSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb - Static Content */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
            <Home className="h-4 w-4 mr-1" />
            儀表板
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/announcements" className="hover:text-cyan-600 transition-colors">
            系統公告
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">公告詳情</span>
        </nav>

        {/* Back Button - Static Content */}
        <div className="mb-4">
          <Link href="/announcements">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <ChevronLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
        </div>

        {/* Main Content Skeleton */}
        <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header Skeleton */}
          <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Content Skeleton */}
          <div className="px-8 py-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center space-x-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<AnnouncementTable | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewsIncremented, setViewsIncremented] = useState(false);

  const announcementId = Number(params.id);

  useEffect(() => {
    const loadAnnouncement = async () => {
      if (!announcementId || isNaN(announcementId)) {
        setError('無效的公告ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const result = await getAnnouncementById(announcementId);
        if (result) {
          setAnnouncement(result);
          // Increment views only once per page load
          if (!viewsIncremented) {
            await incrementAnnouncementViews(announcementId);
            setViewsIncremented(true);
            logAnnouncementView(announcementId, result.title);
          }
        } else {
          setError('找不到該公告');
        }
      } catch (error) {
        console.error('Error loading announcement:', error);
        setError('載入公告時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncement();
  }, [announcementId, viewsIncremented]);

  if (loading) {
    return <AnnouncementSkeleton />;
  }

  if (error || !announcement) {
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
            <Link href="/announcements" className="hover:text-cyan-600 transition-colors">
              系統公告
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">公告詳情</span>
          </nav>

          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <XCircle className="w-16 h-16 mx-auto mb-6 text-red-500 dark:text-red-400" />
              <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {error || '找不到該公告'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                很抱歉，無法找到您要查看的公告內容
              </p>
              <div className="space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="border-gray-300 hover:border-gray-400"
                >
                  返回
                </Button>
                <Link href="/announcements">
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    查看所有公告
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <Link href="/announcements" className="hover:text-cyan-600 transition-colors">
            系統公告
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground line-clamp-1">{announcement.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-4">
          <Link href="/announcements">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              <ChevronLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <AnnouncementDetailCard announcement={announcement} />
      </div>
    </div>
  );
} 