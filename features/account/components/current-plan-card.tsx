"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProBadge } from "@/components/ui/pro-badge";
import { Subscription } from "@/features/account/types/user";
import { Crown, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";

interface CurrentPlanCardProps {
  currentPlan: Subscription | null;
}

export function CurrentPlanCard({ currentPlan }: CurrentPlanCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPlanExpired = (expireAt: string | null) => {
    if (!expireAt) return false;
    return new Date(expireAt) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-5 w-5 mr-2" />
            <div>
              <CardTitle>當前訂閱</CardTitle>
              <CardDescription>
                您目前的方案資訊和使用限制
              </CardDescription>
            </div>
          </div>
          <Link href="/pricing" target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="sm"
              className="text-cyan-600 hover:text-cyan-700 flex-shrink-0"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              查看方案
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {currentPlan ? (
          <div className="space-y-4">
            {/* 方案基本資訊 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ProBadge 
                  planType={currentPlan.plans?.type} 
                  userPlan={currentPlan?.plans?.type || 'FREE'} 
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentPlan.plans?.title || '未知方案'}
                </span>
                {currentPlan.id && isPlanExpired(currentPlan.expire_at) && (
                  <Badge variant="destructive">已到期</Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4 mr-1" />
                每日 {currentPlan.plans?.daily_usage || 0} 次額度
              </div>
            </div>
            
            {/* 詳細屬性資訊 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {/* 方案類型 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  方案類型
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {currentPlan.plans?.type || 'FREE'}
                </span>
              </div>

              {/* 每日使用額度 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  每日額度
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {currentPlan.plans?.daily_usage || 0} 次
                </span>
              </div>

              {/* 方案價格 */}
              {currentPlan.plans?.price && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    方案價格
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    ${currentPlan.plans.price}
                  </span>
                </div>
              )}

              {/* 方案時長 */}
              {currentPlan.plans?.duration_days && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    方案時長
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {currentPlan.plans.duration_days} 天
                  </span>
                </div>
              )}

              {/* 方案效期 */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  方案效期
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {currentPlan.created_at ? formatDate(currentPlan.created_at) : 'N/A'} - {currentPlan.expire_at ? formatDate(currentPlan.expire_at) : '永久有效'}
                </span>
              </div>
            </div>
            
            {/* 免費方案提示 */}
            {currentPlan.plans?.type && currentPlan.plans.type === 'FREE' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 您目前使用的是免費方案。使用序號兌換或購買付費方案來升級，享受更多功能和額度！
                </p>
              </div>
            )}
          </div>
        ) : (
          // Fallback for edge case where no plan is available
          <div className="text-sm text-gray-500 dark:text-gray-400">
            無法載入方案資訊
          </div>
        )}
      </CardContent>
    </Card>
  );
} 