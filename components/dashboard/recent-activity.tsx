'use client';

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityLog, getRecentActivityLogs } from "@/lib/actions/activity";
import { Activity, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActionDisplayInfo } from "../activity/config";

export function RecentActivity() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const result = await getRecentActivityLogs();
        if (!result.error) {
          setLogs(result.logs);
        }
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} 分鐘前`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} 小時前`;
    } else {
      return date.toLocaleDateString('zh-TW');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="h-4 w-4" />
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
      <div className="px-6 py-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-2 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">還沒有任何活動記錄</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.slice(0, 3).map((log) => {
              const { Icon, label } = getActionDisplayInfo(log.action);
              return (
                <div key={log.id} className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                          {label}
                        </p>
                        {log.link && log.action === 'view announcement' && (
                          <Link 
                            href={log.link}
                            className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {formatDate(log.created_at)}
                      </p>
                    </div>
                    {log.detail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {log.detail}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 