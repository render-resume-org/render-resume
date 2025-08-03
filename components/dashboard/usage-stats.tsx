'use client';

import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTodayActivityStats } from "@/lib/actions/activity";
import { BarChart3, Calendar, Crown, FileText, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UsageStats {
  todayResumeBuilds: number;
  todayOptimizations: number;
  totalActions: number;
}

export function UsageStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getTodayActivityStats();
        if (!result.error) {
          setStats({
            todayResumeBuilds: result.todayResumeBuilds,
            todayOptimizations: result.todayOptimizations,
            totalActions: result.todayResumeBuilds + result.todayOptimizations
          });
        }
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatExpireDate = (dateString: string | null): string => {
    if (!dateString) return '無限制';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 0) {
      return '已過期';
    } else if (diffInDays === 0) {
      return '今天到期';
    } else if (diffInDays === 1) {
      return '明天到期';
    } else {
      return `${diffInDays} 天後到期`;
    }
  };

  const getPlanInfo = () => {
    if (!user?.currentPlan) {
      return {
        name: '免費版',
        dailyLimit: 3,
        used: stats?.todayResumeBuilds || 0,
        expireDate: null
      };
    }

    // Check if this is a free plan (no subscription ID means it's the mock free plan)
    const isFreePlan = user.currentPlan.type === 'FREE' || user.currentPlan.type === 'free';
    
    return {
      name: user.currentPlan.title || (isFreePlan ? '免費版' : 'Pro 版'),
      dailyLimit: user.currentPlan.daily_usage || 2,
      used: (stats?.todayResumeBuilds || 0) + (stats?.todayOptimizations || 0),
      expireDate: isFreePlan ? null : user.currentPlan.expire_at
    };
  };

  const planInfo = getPlanInfo();
  const usagePercentage = (planInfo.used / planInfo.dailyLimit) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 mb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            使用統計
          </h3>
          <Link href="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 py-4 flex-1 flex flex-col">
        {loading ? (
          <div className="space-y-4 flex-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        ) : (
          <div className="space-y-6 flex-1">
            {/* Plan Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-cyan-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {planInfo.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{formatExpireDate(planInfo.expireDate)}</span>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-3 flex-1">
              <div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>今日履歷建立</span>
                  <span>{planInfo.used} / {planInfo.dailyLimit}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-cyan-600" />
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {stats?.todayResumeBuilds || 0}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      建立履歷
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3 w-3 text-cyan-600" />
                  <div>
                    <div className="text-gray-900 dark:text-white font-medium">
                      {stats?.todayOptimizations || 0}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      優化履歷
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 