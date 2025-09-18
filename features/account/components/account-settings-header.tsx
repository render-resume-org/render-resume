"use client";

interface AccountSettingsHeaderProps {
  isOwnProfile: boolean;
  displayName: string;
}

export function AccountSettingsHeader({ isOwnProfile, displayName }: AccountSettingsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {isOwnProfile ? '帳戶設定' : `${displayName} 的個人資訊`}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        {isOwnProfile ? '管理您的個人資訊和帳戶設定' : '查看用戶的個人資訊'}
      </p>
    </div>
  );
} 