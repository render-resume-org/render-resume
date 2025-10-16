"use client";

import {
  AccountSettingsAvatarCard,
  AccountSettingsErrorState,
  AccountSettingsHeader,
  AccountSettingsInfoCard,
  AccountSettingsSkeleton,
  CurrentPlanCard,
  RedeemCodeCard,
  SubscriptionHistoryCard
} from "@/features/account/components";
import { Subscription, UserProfile } from "@/features/account/types/user";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const params = useParams();
  const { user: currentUser, loading: authLoading, updateProfile, refreshUserPlan } = useAuth();
  const userId = params.id as string;
  console.log('userId', userId)
  console.log('currentUser', currentUser)
  
  // Local state
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // 訂閱相關狀態
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null);

  const isOwnProfile = currentUser?.id === userId;

  // 獲取 user data
  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("請先登入");
        } else if (response.status === 403) {
          setError("您沒有權限查看此用戶資料");
        } else if (response.status === 404) {
          setError("用戶不存在");
        } else {
          setError("載入用戶資料失敗");
        }
        return;
      }

      const userData = await response.json();
      setProfileUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setError("載入用戶資料失敗");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 獲取訂閱信息
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      
      if (!response.ok) {
        throw new Error('獲取訂閱信息失敗');
      }
      
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setCurrentPlan(data.currentPlan || null);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('獲取訂閱信息失敗');
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!currentUser) {
      setError("請先登入");
      setLoading(false);
      return;
    }

    fetchUserProfile();
    if (isOwnProfile) {
      fetchSubscriptions();
    }
  }, [currentUser, authLoading, fetchUserProfile, isOwnProfile]);

  useEffect(() => {
    if (profileUser) {
      setDisplayName(profileUser.display_name || profileUser.email?.split('@')[0] || '');
    }
  }, [profileUser]);

  // Sync with auth state for own profile
  useEffect(() => {
    if (isOwnProfile && currentUser && profileUser) {
      const authDisplayName = currentUser.display_name;
      const profileDisplayName = profileUser.display_name;
      
      if (authDisplayName !== profileDisplayName) {
        setProfileUser(prev => prev ? {
          ...prev,
          display_name: authDisplayName
        } : null);
      }
    }
  }, [currentUser?.display_name, isOwnProfile, currentUser, profileUser]);

  const handleSave = async () => {
    if (!isOwnProfile) {
      toast.error("無法修改其他用戶的資料");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedUser = await updateProfile({ 
        display_name: displayName.trim() || profileUser?.email?.split('@')[0] || '' 
      });
      
      // Update local profile state
      setProfileUser(updatedUser);
      setIsEditing(false);
      
      // Show success toast
      toast.success("個人資料更新成功！", {
        description: "您的顯示名稱已成功更新",
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // Show error toast
      const errorMessage = error instanceof Error 
        ? error.message 
        : "更新個人資料失敗，請稍後再試";
      
      toast.error("更新失敗", {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profileUser?.display_name || profileUser?.email?.split('@')[0] || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userDisplayName = profileUser?.display_name || profileUser?.email?.split('@')[0] || 'User';
  const initials = getInitials(userDisplayName);

  if (error) {
    return <AccountSettingsErrorState error={error} currentUserId={currentUser?.id} />;
  }

  if (!profileUser) {
    // Show skeleton during loading
    if (authLoading || loading) {
      return <AccountSettingsSkeleton />;
    }
    return <AccountSettingsErrorState error="用戶不存在" currentUserId={currentUser?.id} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <AccountSettingsHeader isOwnProfile={isOwnProfile} displayName={userDisplayName} />

      {/* 帳戶設定區域 */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Account Settings Card */}
        <div className="md:col-span-1">
          <AccountSettingsAvatarCard 
            profileUser={profileUser}
            displayName={userDisplayName}
            initials={initials}
            isOwnProfile={isOwnProfile}
          />
        </div>

        {/* Account Settings Information */}
        <div className="md:col-span-2">
          <AccountSettingsInfoCard
            profileUser={profileUser}
            displayName={displayName}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
            isSaving={isUpdating}
            onEditToggle={() => setIsEditing(true)}
            onSave={handleSave}
            onCancel={handleCancel}
            onDisplayNameChange={setDisplayName}
          />
        </div>
      </div>

      {/* 其他功能區域 - 僅在查看自己的個人資料時顯示 */}
      {isOwnProfile && (
        <div className="mt-8 space-y-8">
          {/* 序號兌換 - 現在佔據全寬度 */}
          <div className="w-full">
            <RedeemCodeCard 
              onRedeemSuccess={async () => {
                await fetchSubscriptions();
                await refreshUserPlan();
              }}
            />
          </div>

          {/* 訂閱相關卡片 */}
          <div className="space-y-8">
            {/* 當前訂閱 */}
            <CurrentPlanCard currentPlan={currentPlan} />

            {/* 訂閱歷史 */}
            <SubscriptionHistoryCard 
              subscriptions={subscriptions}
              currentPlan={currentPlan}
            />
          </div>
        </div>
      )}
    </div>
  );
} 