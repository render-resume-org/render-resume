"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProBadge } from "@/components/ui/pro-badge";
import { UserProfile } from "@/types/user";
import { Calendar, Crown, Zap } from "lucide-react";

interface ProfilePlanCardProps {
  profileUser: UserProfile;
  isOwnProfile: boolean;
}

export function ProfilePlanCard({ profileUser, isOwnProfile }: ProfilePlanCardProps) {
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

  // Default free plan configuration
  const defaultFreePlan = {
    type: 'free' as const,
    title: '免費方案',
    daily_usage: 3,
    expire_at: null
  };

  // Use current plan or default to free plan
  const displayPlan = profileUser.currentPlan || defaultFreePlan;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2" />
          訂閱方案
        </CardTitle>
        <CardDescription>
          {isOwnProfile ? "您的當前訂閱狀態" : "用戶的訂閱狀態"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ProBadge 
                planType={displayPlan.type} 
                userPlan={profileUser.currentPlan?.type || 'free'} 
              />
              <p>  
                {displayPlan.title}   
              </p>
              {displayPlan.expire_at && isPlanExpired(displayPlan.expire_at) && (
                <Badge variant="destructive">已到期</Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4 mr-1" />
              每日 {displayPlan.daily_usage || 0} 次額度
            </div>
          </div>
          
          {displayPlan.expire_at && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              到期日：{formatDate(displayPlan.expire_at)}
            </div>
          )}

          {!profileUser.currentPlan && isOwnProfile && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                前往設定頁面兌換序號來升級您的方案
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 