import { createClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 獲取當前用戶
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 獲取用戶的所有訂閱
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('user_id', currentUser.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError);
      return NextResponse.json(
        { error: '獲取訂閱信息失敗' },
        { status: 500 }
      );
    }

    // 獲取所有可用方案
    const { data: allPlans, error: plansError } = await supabase
      .from('plans')
      .select('*')
      .order('daily_usage', { ascending: false });

    if (plansError) {
      console.error('Error fetching plans:', plansError);
      return NextResponse.json(
        { error: '獲取方案信息失敗' },
        { status: 500 }
      );
    }

    // 找到當前有效的最高級方案
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

    return NextResponse.json({
      subscriptions: activeSubscriptions,
      currentPlan,
      allPlans,
    });

  } catch (error) {
    console.error('Error in subscriptions API:', error);
    return NextResponse.json(
      { error: '內部伺服器錯誤' },
      { status: 500 }
    );
  }
} 