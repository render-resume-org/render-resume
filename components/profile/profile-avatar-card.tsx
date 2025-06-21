"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { Calendar, Mail } from "lucide-react";

interface ProfileAvatarCardProps {
  profileUser: UserProfile;
  displayName: string;
  initials: string;
}

export function ProfileAvatarCard({ profileUser, displayName, initials }: ProfileAvatarCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profileUser.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="bg-cyan-600 text-white text-xl font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{displayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{profileUser.email}</span>
          </div>
          {profileUser.created_at && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>加入於 {formatDate(profileUser.created_at)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 