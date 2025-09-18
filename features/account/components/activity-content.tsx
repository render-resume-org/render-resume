'use client';

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityLog, getUserActivityLogs } from "@/services/actions/activity";
import { getTimeRangeDates } from "@/utils/time-filters";
import { Activity, ChevronRight, ExternalLink, Home } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ActivityFilters as ActivityFiltersType } from "./activity-filters";
import { ActivityFilters } from "./activity-filters";
import { getActionDisplayInfo } from "../lib/activity-config";

// Types
interface ActivityContentState {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  totalCount: number;
}

// Utility functions
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInHours * 60);
    return `${diffInMinutes} 分鐘前`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} 小時前`;
  } else if (diffInHours < 24 * 7) {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} 天前`;
  } else {
    return date.toLocaleDateString('zh-TW');
  }
}

// Components
function ActivityItem({ log }: { log: ActivityLog }) {
  const { Icon, label } = getActionDisplayInfo(log.action);

  return (
    <div className="flex items-center space-x-3 p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
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
}

function ActivitySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start space-x-3 p-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}



function EmptyStateWithFilters({ 
  icon: Icon, 
  title, 
  description, 
  filters, 
  onFiltersChange 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  title: string; 
  description: string; 
  filters: ActivityFiltersType;
  onFiltersChange: (filters: ActivityFiltersType) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              儀表板
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">活動紀錄</span>
          </nav>

          {/* Title and Subtitle */}
          <div>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <Activity className="w-5 h-5" />
              <span>活動紀錄</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              查看您的履歷創建和管理活動歷史
            </p>
          </div>

          {/* Filters */}
          <ActivityFilters 
            filters={filters} 
            onFiltersChange={onFiltersChange}
            className="!mb-0 !mt-6"
          />
        </div>
      </CardHeader>
      <CardContent className="px-8 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Icon className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-sm mb-6">{description}</p>
        </div>
      </CardContent>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              儀表板
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">活動紀錄</span>
          </nav>

          {/* Title and Subtitle */}
          <div>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <Activity className="w-5 h-5" />
              <span>活動紀錄</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              查看您的履歷創建和管理活動歷史
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-8 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Activity className="h-16 w-16 mx-auto mb-6 opacity-50" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            載入失敗
          </h3>
          <p className="text-sm mb-6">{error}</p>
          <Button onClick={onRetry} variant="outline">
            重試
          </Button>
        </div>
      </CardContent>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              儀表板
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">活動紀錄</span>
          </nav>

          {/* Title and Subtitle */}
          <div>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <Activity className="w-5 h-5" />
              <span>活動紀錄</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              查看您的履歷創建和管理活動歷史
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ActivitySkeleton />
      </CardContent>
    </div>
  );
}

function ActivityList({ logs, hasMore, loading, onLoadMore, filters, onFiltersChange }: {
  logs: ActivityLog[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  filters: ActivityFiltersType;
  onFiltersChange: (filters: ActivityFiltersType) => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      <CardHeader className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard" className="flex items-center font-medium hover:text-cyan-600 transition-colors">
              <Home className="h-4 w-4 mr-1" />
              儀表板
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">活動紀錄</span>
          </nav>

          {/* Title and Subtitle */}
          <div>
            <CardTitle className="flex items-center space-x-3 text-xl font-semibold text-gray-900 dark:text-white mb-2">
              <Activity className="w-5 h-5" />
              <span>活動紀錄</span>
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              查看您的履歷創建和管理活動歷史
            </p>
          </div>

          {/* Filters */}
          <ActivityFilters 
            filters={filters} 
            onFiltersChange={onFiltersChange}
            className="!mb-0 !mt-6"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {logs.map((log) => (
            <ActivityItem key={log.id} log={log} />
          ))}
        </div>
        
        {hasMore && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <Button 
              onClick={onLoadMore} 
              variant="outline" 
              className="w-full"
              disabled={loading}
            >
              {loading ? '載入中...' : '載入更多'}
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
}

// Main component
export function ActivityContent() {
  const [state, setState] = useState<ActivityContentState>({
    logs: [],
    loading: true,
    error: null,
    page: 1,
    hasMore: false,
    totalCount: 0,
  });

  const [filters, setFilters] = useState<ActivityFiltersType>({
    actionTypes: [
      'build resume',
      'optimize resume', 
      'download resume',
      'send smart chat message',
      'upload smart chat attachment'
    ],
    timeRange: '7days',
  });

  const fetchLogs = useCallback(async (pageNum: number = 1, currentFilters?: ActivityFiltersType) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const filtersToUse = currentFilters || filters;
      const timeRange = getTimeRangeDates(filtersToUse.timeRange);
      
      const result = await getUserActivityLogs(pageNum, 10, {
        actionTypes: filtersToUse.actionTypes.length > 0 ? filtersToUse.actionTypes : undefined,
        timeRange,
      });
      
      if (result.error) {
        setState(prev => ({ ...prev, error: result.error || null, loading: false }));
        return;
      }

      setState(prev => ({
        ...prev,
        logs: pageNum === 1 ? result.logs : [...prev.logs, ...result.logs],
        hasMore: result.hasMore,
        totalCount: result.totalCount,
        page: pageNum,
        loading: false,
      }));
    } catch {
      setState(prev => ({ 
        ...prev, 
        error: '載入活動記錄時發生錯誤', 
        loading: false 
      }));
    }
  }, [filters]);

  const loadMore = () => {
    if (!state.loading && state.hasMore) {
      fetchLogs(state.page + 1);
    }
  };

  const handleFiltersChange = (newFilters: ActivityFiltersType) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setState(prev => ({ ...prev, page: 1 }));
    fetchLogs(1, newFilters);
  };

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Loading state
  if (state.loading && state.logs.length === 0) {
    return <LoadingState />;
  }

  // Error state
  if (state.error) {
    return <ErrorState error={state.error} onRetry={() => fetchLogs()} />;
  }

  // Empty state with filters (when filtered results are empty)
  if (state.logs.length === 0 && !state.loading) {
    return (
      <EmptyStateWithFilters
        icon={Activity}
        title="沒有找到符合條件的活動記錄"
        description="請嘗試調整篩選條件或選擇不同的時間範圍"
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    );
  }

  // Activity list with filters
  return (
    <ActivityList
      logs={state.logs}
      hasMore={state.hasMore}
      loading={state.loading}
      onLoadMore={loadMore}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );
} 