import { createClient } from "@/lib/supabase/server";
import { UserInsert, UserTable } from "@/lib/types";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already exists in the database
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', fetchError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    let userData: UserTable;

    if (!existingUser) {
      // Create new user
      const displayName = authUser.user_metadata?.full_name || 
                         authUser.user_metadata?.name || 
                         authUser.email?.split('@')[0] || 
                         'User';
      
      const avatarUrl = authUser.user_metadata?.avatar_url || 
                       authUser.user_metadata?.picture || 
                       null;

      const newUserData: UserInsert = {
        id: authUser.id, // Use the same UUID from auth
        display_name: displayName,
        avatar_url: avatarUrl,
        email: authUser.email,
        welcome_email_sent: false, // Default to false for new users
      };

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert(newUserData)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
      }

      userData = newUser;
    } else {
      // Update existing user with latest data from auth
      const displayName = existingUser.display_name ||
                         authUser.user_metadata?.full_name || 
                         authUser.user_metadata?.name || 
                         authUser.email?.split('@')[0] || 
                         '未命名的用戶';
      
      const avatarUrl = authUser.user_metadata?.avatar_url || 
                       authUser.user_metadata?.picture || 
                       existingUser.avatar_url;

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          avatar_url: avatarUrl,
          email: authUser.email,
        })
        .eq('id', authUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }

      userData = updatedUser;
    }

    // Get user's current plan
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', authUser.id)
      .eq('is_active', true);

    // Find the current valid highest tier plan
    const now = new Date().toISOString();
    const activeSubscriptions = subscriptions?.filter(sub => 
      !sub.expire_at || sub.expire_at > now
    ) || [];

    const currentPlan = activeSubscriptions.length > 0 
      ? activeSubscriptions.reduce((best, current) => {
          const currentDailyUsage = current.plans?.daily_usage || 0;
          const bestDailyUsage = best.plans?.daily_usage || 0;
          return currentDailyUsage > bestDailyUsage ? current : best;
        })
      : null;

    // Return user data with current plan
    const userWithPlan = {
      ...userData,
      currentPlan: currentPlan ? {
        id: currentPlan.plans?.id,
        title: currentPlan.plans?.title,
        type: currentPlan.plans?.type,
        daily_usage: currentPlan.plans?.daily_usage,
        expire_at: currentPlan.expire_at,
      } : null,
    };

    return NextResponse.json({ user: userWithPlan });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 