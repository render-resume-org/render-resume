"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { ChartColumn } from "lucide-react";

interface AccountSettingsAvatarCardProps {
  profileUser: UserProfile;
  displayName: string;
  initials: string;
  isOwnProfile: boolean;
}

export function AccountSettingsAvatarCard({ profileUser, displayName, initials, isOwnProfile }: AccountSettingsAvatarCardProps) {
  const getDaysUsed = () => {
    if (!profileUser.created_at) return 0;
    return Math.floor((Date.now() - new Date(profileUser.created_at).getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="h-full">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileUser.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="bg-cyan-600 text-white text-xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{displayName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Profile Information */}
        <div className="space-y-3">
          {/* Join date moved to basic information card */}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        {/* Account Statistics */}
        <div>
          <div className="flex items-center mb-3">
            <ChartColumn className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              帳戶統計
            </span>
          </div>
          <CardDescription className="mb-4">
            {isOwnProfile ? '您的帳戶使用情況' : '用戶的帳戶使用情況'}
          </CardDescription>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                生成履歷
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {getDaysUsed()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                使用天數
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 