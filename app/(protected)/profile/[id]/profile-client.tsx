"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { AccountStatsCard } from "@/components/profile/account-stats-card";
import { ProfileAvatarCard } from "@/components/profile/profile-avatar-card";
import { ProfileErrorState } from "@/components/profile/profile-error-state";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { ProfilePlanCard } from "@/components/profile/profile-plan-card";
import { UserProfile } from "@/types/user";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileClientProps {
  profileUser: UserProfile | null;
  currentUser: User;
  userId: string;
  initialError: string | null;
}

export function ProfileClient({ 
  profileUser: initialProfileUser, 
  currentUser, 
  userId, 
  initialError 
}: ProfileClientProps) {
  const { updateProfile } = useAuth();
  
  // Local state
  const [profileUser, setProfileUser] = useState<UserProfile | null>(initialProfileUser);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (profileUser) {
      setDisplayName(profileUser.display_name || profileUser.email?.split('@')[0] || '');
    }
  }, [profileUser]);

  // Sync with auth state for own profile
  useEffect(() => {
    if (isOwnProfile && currentUser && profileUser) {
      const authDisplayName = currentUser.user_metadata?.display_name;
      const profileDisplayName = profileUser.display_name;
      
      if (authDisplayName !== profileDisplayName) {
        setProfileUser(prev => prev ? {
          ...prev,
          display_name: authDisplayName
        } : null);
      }
    }
  }, [currentUser?.user_metadata?.display_name, isOwnProfile, currentUser, profileUser]);

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

  if (initialError) {
    return <ProfileErrorState error={initialError} currentUserId={currentUser?.id} />;
  }

  if (!profileUser) {
    return <ProfileErrorState error="用戶不存在" currentUserId={currentUser?.id} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProfileHeader isOwnProfile={isOwnProfile} displayName={userDisplayName} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <ProfileAvatarCard 
            profileUser={profileUser}
            displayName={userDisplayName}
            initials={initials}
          />
        </div>

        {/* Profile Information */}
        <div className="md:col-span-2 space-y-6">
          <ProfileInfoCard
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

          <AccountStatsCard 
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
          />

          {/* 訂閱方案卡片 */}
          <ProfilePlanCard 
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
          />
        </div>
      </div>
    </div>
  );
} 