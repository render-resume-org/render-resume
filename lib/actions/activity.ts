'use server';

import { getAuthenticatedUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

type ActionType = Database['public']['Enums']['action-type'];

export interface ActivityLog {
  id: number;
  user_id: string;
  action: ActionType;
  detail: string | null;
  link: string | null;
  created_at: string;
}

export interface CreateActivityLogParams {
  action: ActionType;
  detail?: string | null;
  link?: string | null;
}

/**
 * Create a new activity log entry for the current user
 */
export async function createActivityLog(params: CreateActivityLogParams): Promise<{ success: boolean; error?: string }> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { success: false, error: 'User not authenticated' };
    }

    const supabase = await createClient();
    
    const { error } = await supabase
      .from('action_logs')
      .insert({
        user_id: authResult.user.id,
        action: params.action,
        detail: params.detail || null,
        link: params.link || null,
      });

    if (error) {
      console.error('Error creating activity log:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in createActivityLog:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create activity log' 
    };
  }
}

/**
 * Get activity logs for the current user with pagination
 */
export async function getUserActivityLogs(
  page: number = 1,
  limit: number = 20
): Promise<{ logs: ActivityLog[]; totalCount: number; hasMore: boolean; error?: string }> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { logs: [], totalCount: 0, hasMore: false, error: 'User not authenticated' };
    }

    const supabase = await createClient();
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count } = await supabase
      .from('action_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', authResult.user.id);

    // Get paginated data
    const { data: logs, error } = await supabase
      .from('action_logs')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching activity logs:', error);
      return { logs: [], totalCount: 0, hasMore: false, error: error.message };
    }

    const totalCount = count || 0;
    const hasMore = totalCount > page * limit;

    return {
      logs: logs || [],
      totalCount,
      hasMore,
    };
  } catch (error) {
    console.error('Error in getUserActivityLogs:', error);
    return { 
      logs: [], 
      totalCount: 0, 
      hasMore: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch activity logs' 
    };
  }
}

/**
 * Get recent activity logs for the current user (last 10 entries)
 */
export async function getRecentActivityLogs(): Promise<{ logs: ActivityLog[]; error?: string }> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { logs: [], error: 'User not authenticated' };
    }

    const supabase = await createClient();
    
    const { data: logs, error } = await supabase
      .from('action_logs')
      .select('*')
      .eq('user_id', authResult.user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent activity logs:', error);
      return { logs: [], error: error.message };
    }

    return { logs: logs || [] };
  } catch (error) {
    console.error('Error in getRecentActivityLogs:', error);
    return { 
      logs: [], 
      error: error instanceof Error ? error.message : 'Failed to fetch recent activity logs' 
    };
  }
}

/**
 * Get activity statistics for the current user
 */
export async function getActivityStats(): Promise<{ 
  totalActions: number; 
  actionsByType: Record<ActionType, number>;
  error?: string;
}> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { 
        totalActions: 0, 
        actionsByType: {} as Record<ActionType, number>, 
        error: 'User not authenticated' 
      };
    }

    const supabase = await createClient();
    
    // Get all logs for the user
    const { data: logs, error } = await supabase
      .from('action_logs')
      .select('action')
      .eq('user_id', authResult.user.id);

    if (error) {
      console.error('Error fetching activity stats:', error);
      return { 
        totalActions: 0, 
        actionsByType: {} as Record<ActionType, number>, 
        error: error.message 
      };
    }

    const totalActions = logs?.length || 0;
    const actionsByType = (logs || []).reduce((acc, log) => {
      if (log.action) {
        acc[log.action as ActionType] = (acc[log.action as ActionType] || 0) + 1;
      }
      return acc;
    }, {} as Record<ActionType, number>);

    return { totalActions, actionsByType };
  } catch (error) {
    console.error('Error in getActivityStats:', error);
    return { 
      totalActions: 0, 
      actionsByType: {} as Record<ActionType, number>, 
      error: error instanceof Error ? error.message : 'Failed to fetch activity stats' 
    };
  }
}

/**
 * Get today's activity statistics for the current user
 */
export async function getTodayActivityStats(): Promise<{ 
  todayResumeBuilds: number; 
  todayOptimizations: number;
  error?: string;
}> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { 
        todayResumeBuilds: 0, 
        todayOptimizations: 0,
        error: 'User not authenticated' 
      };
    }

    const supabase = await createClient();
    
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's logs for the user
    const { data: logs, error } = await supabase
      .from('action_logs')
      .select('action')
      .eq('user_id', authResult.user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (error) {
      console.error('Error fetching today\'s activity stats:', error);
      return { 
        todayResumeBuilds: 0, 
        todayOptimizations: 0,
        error: error.message 
      };
    }

    const todayResumeBuilds = (logs || []).filter(log => log.action === 'build resume').length;
    const todayOptimizations = (logs || []).filter(log => log.action === 'optimize resume').length;

    return { todayResumeBuilds, todayOptimizations };
  } catch (error) {
    console.error('Error in getTodayActivityStats:', error);
    return { 
      todayResumeBuilds: 0, 
      todayOptimizations: 0,
      error: error instanceof Error ? error.message : 'Failed to fetch today\'s activity stats' 
    };
  }
}

/**
 * Check if user has exceeded daily usage limit for resume analysis
 */
export async function checkDailyUsageLimit(): Promise<{ 
  canProceed: boolean; 
  currentUsage: number; 
  dailyLimit: number; 
  error?: string;
}> {
  try {
    const authResult = await getAuthenticatedUser();
    
    if (!authResult.isAuthenticated || !authResult.user) {
      return { 
        canProceed: false, 
        currentUsage: 0, 
        dailyLimit: 0,
        error: 'User not authenticated' 
      };
    }

    const supabase = await createClient();
    
    // Get user's current plan
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', authResult.user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching user subscriptions:', subscriptionsError);
      return { 
        canProceed: false, 
        currentUsage: 0, 
        dailyLimit: 0,
        error: 'Failed to fetch subscription information' 
      };
    }

    // Find the current active plan with highest daily usage
    const now = new Date().toISOString();
    const activeSubscriptions = subscriptions.filter(sub => 
      !sub.expire_at || sub.expire_at > now
    );

    let currentPlan = null;
    
    if (activeSubscriptions.length > 0) {
      // 有有效訂閱，選擇最高級方案
      currentPlan = activeSubscriptions.reduce((best, current) => {
        const currentDailyUsage = current.plans?.daily_usage || 0;
        const bestDailyUsage = best.plans?.daily_usage || 0;
        return currentDailyUsage > bestDailyUsage ? current : best;
      });
    } else {
      // 沒有有效訂閱，返回免費方案
      const { data: allPlans } = await supabase
        .from('plans')
        .select('*')
        .order('daily_usage', { ascending: false });
      
      const freePlan = allPlans?.find(plan => plan.type === 'FREE');
      if (freePlan) {
        currentPlan = {
          id: null,
          user_id: authResult.user.id,
          plan_id: freePlan.id,
          is_active: false,
          expire_at: null,
          created_at: null,
          order_id: null,
          plans: freePlan
        };
      }
    }

    // Default to free plan limits if no active subscription
    const dailyLimit = currentPlan?.plans?.daily_usage || 3;
    
    // Get today's activity count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const { data: todayLogs, error: logsError } = await supabase
      .from('action_logs')
      .select('action')
      .eq('user_id', authResult.user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (logsError) {
      console.error('Error fetching today\'s activity logs:', logsError);
      return { 
        canProceed: false, 
        currentUsage: 0, 
        dailyLimit,
        error: 'Failed to fetch usage statistics' 
      };
    }

    // Count today's resume analysis actions (both build and optimize)
    const todayResumeBuilds = (todayLogs || []).filter(log => log.action === 'build resume').length;
    const todayOptimizations = (todayLogs || []).filter(log => log.action === 'optimize resume').length;
    const currentUsage = todayResumeBuilds + todayOptimizations;

    const canProceed = currentUsage < dailyLimit;

    return { 
      canProceed, 
      currentUsage, 
      dailyLimit 
    };
  } catch (error) {
    console.error('Error in checkDailyUsageLimit:', error);
    return { 
      canProceed: false, 
      currentUsage: 0, 
      dailyLimit: 0,
      error: error instanceof Error ? error.message : 'Failed to check usage limit' 
    };
  }
}

/**
 * Utility function to log common user actions
 */
export async function logUserAction(action: ActionType, detail?: string, link?: string): Promise<void> {
  await createActivityLog({ action, detail, link });
}

/**
 * Log when user views an announcement
 */
export async function logAnnouncementView(announcementId: number, announcementTitle: string): Promise<void> {
  await logUserAction('view announcement', `查看公告：${announcementTitle}`, `/announcements/${announcementId}`);
}

/**
 * Log when user builds a resume
 */
export async function logResumeBuild(detail?: string): Promise<void> {
  await logUserAction('build resume', detail);
}

/**
 * Log when user optimizes a resume
 */
export async function logResumeOptimize(detail?: string): Promise<void> {
  await logUserAction('optimize resume', detail);
}

/**
 * Log when user views their profile
 */
export async function logProfileView(): Promise<void> {
  await logUserAction('view account settings');
}

/**
 * Log when user downloads a resume
 */
export async function logResumeDownload(detail?: string): Promise<void> {
  await logUserAction('download resume', detail);
}

/**
 * Log when user sends a smart chat message
 */
export async function logSmartChatMessage(messageLength: number, messageContent?: string): Promise<void> {
  const detail = messageContent 
    ? `訊息內容：「${messageContent}」(${messageLength} 字元)`
    : `訊息長度：${messageLength} 字元`;
  await logUserAction('send smart chat message', detail);
}

/**
 * Log when user uploads a smart chat attachment
 */
export async function logSmartChatAttachment(fileName: string, fileSize: number): Promise<void> {
  await logUserAction('upload smart chat attachment', `檔案：${fileName}，大小：${fileSize} bytes`);
} 