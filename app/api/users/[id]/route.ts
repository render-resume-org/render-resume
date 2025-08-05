import { logUserAction } from "@/lib/actions/activity";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    
    // 獲取當前用戶
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const targetUserId = params.id;
    
    // 如果查看自己的資料，直接返回當前用戶資料
    if (targetUserId === currentUser.id) {
      // 記錄用戶查看帳戶設定的活動
      await logUserAction('view profile', '查看自己的帳戶設定', `/account-settings/${targetUserId}`);

      // 從 users 表獲取用戶資料
      const { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      // 獲取用戶的當前方案
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plans:plan_id (*)
        `)
        .eq('user_id', currentUser.id)
        .eq('is_active', true);

      // 獲取所有可用方案
      const { data: allPlans } = await supabase
        .from('plans')
        .select('*')
        .order('daily_usage', { ascending: false });

      // 找到當前有效的最高級方案
      const now = new Date().toISOString();
      const activeSubscriptions = subscriptions?.filter(sub => 
        !sub.expire_at || sub.expire_at > now
      ) || [];

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
        const freePlan = allPlans?.find(plan => plan.type === 'FREE');
        if (freePlan) {
          currentPlan = {
            id: null,
            user_id: currentUser.id,
            plan_id: freePlan.id,
            is_active: false,
            expire_at: null,
            created_at: null,
            order_id: null,
            plans: freePlan
          };
        }
      }

      return NextResponse.json({
        id: currentUser.id,
        email: dbUser?.email || currentUser.email,
        display_name: dbUser?.display_name || currentUser.user_metadata?.display_name,
        avatar_url: dbUser?.avatar_url || currentUser.user_metadata?.avatar_url,
        created_at: dbUser?.created_at || currentUser.created_at,
        welcome_email_sent: dbUser?.welcome_email_sent || false,
        currentPlan: currentPlan ? {
          id: currentPlan.plans?.id,
          title: currentPlan.plans?.title,
          type: currentPlan.plans?.type,
          daily_usage: currentPlan.plans?.daily_usage,
          expire_at: currentPlan.expire_at,
        } : null,
      });
    }

    // 檢查權限：只允許特定用戶查看其他人的資料
    const ADMIN_USER_ID = '049512f1-9b80-4848-9df3-03adcc8f61c9';
    if (currentUser.id !== ADMIN_USER_ID) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 從 users 表獲取目標用戶資料
    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', targetUserId)
      .single();
    
    if (userError || !targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 記錄管理員查看其他用戶資料的活動
    await logUserAction('view profile', `查看 ${targetUser.display_name || targetUser.email} 的帳戶設定`, `/account-settings/${targetUserId}`);

    // 獲取目標用戶的當前方案（管理員查看）
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', targetUserId)
      .eq('is_active', true);

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

    // 返回目標用戶的公開資料
    return NextResponse.json({
      id: targetUser.id,
      email: targetUser.email,
      display_name: targetUser.display_name,
      avatar_url: targetUser.avatar_url,
      created_at: targetUser.created_at,
      welcome_email_sent: targetUser.welcome_email_sent,
      currentPlan: currentPlan ? {
        id: currentPlan.plans?.id,
        title: currentPlan.plans?.title,
        type: currentPlan.plans?.type,
        daily_usage: currentPlan.plans?.daily_usage,
        expire_at: currentPlan.expire_at,
      } : null,
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    
    // 獲取當前用戶
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const targetUserId = params.id;
    
    // 只允許用戶更新自己的資料
    if (targetUserId !== currentUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 解析請求體
    const body = await request.json();
    const { display_name } = body;

    // 驗證輸入
    if (typeof display_name !== 'string') {
      return NextResponse.json({ error: 'Invalid display_name' }, { status: 400 });
    }

    // 更新用戶資料到 users 表
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        display_name: display_name.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentUser.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // 獲取更新後的用戶方案信息
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', currentUser.id)
      .eq('is_active', true);

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

    // 返回更新後的用戶資料
    return NextResponse.json({
      id: updatedUser.id,
      email: updatedUser.email,
      display_name: updatedUser.display_name,
      avatar_url: updatedUser.avatar_url,
      created_at: updatedUser.created_at,
      welcome_email_sent: updatedUser.welcome_email_sent,
      currentPlan: currentPlan ? {
        id: currentPlan.plans?.id,
        title: currentPlan.plans?.title,
        type: currentPlan.plans?.type,
        daily_usage: currentPlan.plans?.daily_usage,
        expire_at: currentPlan.expire_at,
      } : null,
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 