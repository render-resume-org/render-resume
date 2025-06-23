import { createClient } from "@/lib/supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  currentPlan?: {
    id: number;
    title: string;
    type: string;
    daily_usage: number;
    expire_at: string | null;
  } | null;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
  isAuthenticated: boolean;
  isProUser: boolean;
}

/**
 * Get the authenticated user and their plan information
 */
export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    
    // Get the authenticated user
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return {
        user: null,
        error: authError?.message || "未登入",
        isAuthenticated: false,
        isProUser: false
      };
    }

    // Get user's current plan from subscriptions
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', authUser.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching user subscriptions:', subscriptionsError);
      return {
        user: {
          id: authUser.id,
          email: authUser.email || '',
          currentPlan: null
        },
        error: null,
        isAuthenticated: true,
        isProUser: false
      };
    }

    // Find the current active plan with highest daily usage
    const now = new Date().toISOString();
    const activeSubscriptions = subscriptions.filter(sub => 
      !sub.expire_at || sub.expire_at > now
    );

    const currentPlan = activeSubscriptions.length > 0 
      ? activeSubscriptions.reduce((best, current) => {
          const currentDailyUsage = current.plans?.daily_usage || 0;
          const bestDailyUsage = best.plans?.daily_usage || 0;
          return currentDailyUsage > bestDailyUsage ? current : best;
        })
      : null;

    const user: AuthUser = {
      id: authUser.id,
      email: authUser.email || '',
      currentPlan: currentPlan ? {
        id: currentPlan.plans?.id || 0,
        title: currentPlan.plans?.title || '',
        type: currentPlan.plans?.type || 'free',
        daily_usage: currentPlan.plans?.daily_usage || 0,
        expire_at: currentPlan.expire_at
      } : null
    };

    const isProUser = currentPlan?.plans?.type.toLowerCase() === 'pro';

    return {
      user,
      error: null,
      isAuthenticated: true,
      isProUser
    };

  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return {
      user: null,
      error: error instanceof Error ? error.message : '驗證失敗',
      isAuthenticated: false,
      isProUser: false
    };
  }
}

/**
 * Middleware function to check if user is authenticated and is a pro user
 */
export async function requireProUser(): Promise<AuthResult> {
  const authResult = await getAuthenticatedUser();
  
  if (!authResult.isAuthenticated) {
    return {
      ...authResult,
      error: '需要登入才能使用此功能'
    };
  }
  
  if (!authResult.isProUser) {
    return {
      ...authResult,
      error: '此功能僅限 Pro 用戶使用'
    };
  }
  
  return authResult;
}

/**
 * Check if user is authenticated (used for general protected routes)
 */
export async function requireAuthentication(): Promise<AuthResult> {
  const authResult = await getAuthenticatedUser();
  
  if (!authResult.isAuthenticated) {
    return {
      ...authResult,
      error: '需要登入才能使用此功能'
    };
  }
  
  return authResult;
} 