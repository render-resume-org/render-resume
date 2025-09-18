"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProBadge } from "@/components/ui/pro-badge";
import { Subscription } from "@/types/user";
import { ScrollText } from "lucide-react";

interface SubscriptionHistoryCardProps {
  subscriptions: Subscription[];
  currentPlan: Subscription | null;
}

export function SubscriptionHistoryCard({ subscriptions, currentPlan }: SubscriptionHistoryCardProps) {
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

  if (subscriptions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ScrollText className="h-5 w-5 mr-2" />
          訂閱歷史
        </CardTitle>
        <CardDescription>
          您的所有訂閱記錄
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <ProBadge 
                  planType={subscription.plans?.type} 
                  userPlan={currentPlan?.plans?.type || 'free'} 
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {subscription.plans?.title || '未知方案'}
                </span>
                {isPlanExpired(subscription.expire_at) && (
                  <Badge variant="outline" className="text-gray-500">
                    已到期
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {subscription.expire_at 
                  ? `到期：${formatDate(subscription.expire_at)}`
                  : '永久有效'
                }
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 