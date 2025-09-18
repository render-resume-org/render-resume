"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/types/user";
import { Edit3, Save, User, X } from "lucide-react";

interface AccountSettingsInfoCardProps {
  profileUser: UserProfile;
  displayName: string;
  isOwnProfile: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDisplayNameChange: (value: string) => void;
}

export function AccountSettingsInfoCard({
  profileUser,
  displayName,
  isOwnProfile,
  isEditing,
  isSaving,
  onEditToggle,
  onSave,
  onCancel,
  onDisplayNameChange,
}: AccountSettingsInfoCardProps) {
  const userDisplayName = profileUser.display_name || profileUser.email?.split('@')[0] || 'User';

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              基本資訊
            </CardTitle>
            <CardDescription className="mt-1">
              {isOwnProfile ? '編輯您的個人基本資訊' : '用戶的基本資訊'}
            </CardDescription>
          </div>
          {isOwnProfile && !isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onEditToggle}
              className="flex items-center flex-shrink-0 ml-4"
            >
              <Edit3 className="h-4 w-4 mr-1" />
              編輯
            </Button>
          ) : isOwnProfile && isEditing ? (
            <div className="flex space-x-2 flex-shrink-0 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" />
                取消
              </Button>
              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center bg-cyan-600 hover:bg-cyan-700"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                ) : (
                  <Save className="h-4 w-4 mr-1" />
                )}
                儲存
              </Button>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="display-name">顯示名稱</Label>
            {isOwnProfile && isEditing ? (
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => onDisplayNameChange(e.target.value)}
                placeholder="輸入您的顯示名稱"
                disabled={isSaving}
              />
            ) : (
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm">
                {userDisplayName}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">電子郵件</Label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400">
              {profileUser.email}
              {isOwnProfile && <span className="ml-2 text-xs text-gray-500">（無法修改）</span>}
            </div>
          </div>

          {profileUser.created_at && (
            <div className="grid gap-2">
              <Label htmlFor="join-date">加入時間</Label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400">
                {new Date(profileUser.created_at).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="user-id">用戶 ID</Label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md text-sm text-gray-600 dark:text-gray-400 font-mono">
              {profileUser.id}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 