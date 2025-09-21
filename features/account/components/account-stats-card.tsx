"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/features/account/types/user";
import { ChartColumn } from 'lucide-react';

interface AccountStatsCardProps {
  profileUser: UserProfile;
  isOwnProfile: boolean;
}

export function AccountStatsCard({ profileUser, isOwnProfile }: AccountStatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ChartColumn className="h-5 w-5 mr-2" />
          帳戶統計
        </CardTitle>
        <CardDescription>
          {isOwnProfile ? '您的帳戶使用情況' : '用戶的帳戶使用情況'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg">
            <div className="text-2xl font-bold ">
              0
            </div>
            <div className="text-sm ">
              生成履歷
            </div>
          </div>
          <div className="p-4 rounded-lg">
            <div className="text-2xl font-bold ">
              {profileUser.created_at 
                ? Math.floor((Date.now() - new Date(profileUser.created_at).getTime()) / (1000 * 60 * 60 * 24)) 
                : 0
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              使用天數
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 