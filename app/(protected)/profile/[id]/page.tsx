export const runtime = 'edge';

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileClient } from "./profile-client";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id: userId } = await params;
  const supabase = await createClient();
  
  // Get current user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    redirect('/auth/login');
  }

  // Fetch the profile user data server-side
  let profileUser = null;
  let error = null;

  try {
    // If viewing own profile, get from current user
    if (currentUser.id === userId) {
      profileUser = {
        id: currentUser.id,
        email: currentUser.email,
        display_name: currentUser.user_metadata?.display_name || null,
        created_at: currentUser.created_at,
        subscription_status: 'free', // This would come from your subscription logic
        subscription_end_date: null,
        total_analyses: 0,
        // Add other fields as needed
      };
    } else {
      // For other users, you might want to fetch public profile data
      // This depends on your privacy requirements
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (response.ok) {
        profileUser = await response.json();
      } else if (response.status === 404) {
        error = "用戶不存在";
      } else if (response.status === 403) {
        error = "您沒有權限查看此用戶資料";
      } else {
        error = "載入用戶資料失敗";
      }
    }
  } catch (e) {
    console.error('Failed to fetch profile:', e);
    error = "載入用戶資料失敗";
  }

  return (
    <ProfileClient 
      profileUser={profileUser}
      currentUser={currentUser}
      userId={userId}
      initialError={error}
    />
  );
} 