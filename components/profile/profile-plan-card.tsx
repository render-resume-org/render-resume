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
        {profileUser.currentPlan ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ProBadge planType={profileUser.currentPlan.type} />
                <p>  
                {profileUser.currentPlan.title}   
                </p>
                {isPlanExpired(profileUser.currentPlan.expire_at) && (
                  <Badge variant="destructive">已到期</Badge>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4 mr-1" />
                每日 {profileUser.currentPlan.daily_usage || 0} 次額度
              </div>
            </div>
            
            {profileUser.currentPlan.expire_at && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                到期日：{formatDate(profileUser.currentPlan.expire_at)}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{isOwnProfile ? "您目前沒有任何訂閱方案" : "該用戶沒有訂閱方案"}</p>
            {isOwnProfile && (
              <p className="text-sm">前往設定頁面兌換序號來獲取方案</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 