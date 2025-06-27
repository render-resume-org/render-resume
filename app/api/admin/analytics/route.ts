import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 管理員 ID 列表
const ADMINS = ['049512f1-9b80-4848-9df3-03adcc8f61c9'];

// 檢查管理員權限的輔助函數
async function checkAdminAuth() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: "未授權", status: 401 };
  }

  if (!ADMINS.includes(user.id)) {
    return { error: "權限不足", status: 403 };
  }

  return { user, supabase };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 天數

    const daysAgo = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // 獲取用戶註冊趨勢
    const { data: userSignups } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString());

    // 獲取訂閱數據
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select(`
        created_at,
        is_active,
        expire_at,
        plans(price, type)
      `)
      .gte('created_at', startDate.toISOString());

    // 計算用戶留存率（模擬數據）
    const retentionData = [
      { day: 1, rate: 85 },
      { day: 7, rate: 72 },
      { day: 14, rate: 65 },
      { day: 30, rate: 58 }
    ];

    // 計算收益數據
    const revenueData = (subscriptions || [])
      .filter(sub => sub.is_active && sub.plans?.type !== 'free')
      .reduce((total, sub) => total + (sub.plans?.price || 0), 0);

    // 功能使用統計（模擬數據）
    const featureUsage = [
      { feature: '模板下載', usage: 8520, growth: 12.5 },
      { feature: 'PDF 導出', usage: 6430, growth: 8.2 },
      { feature: '自定義編輯', usage: 4320, growth: 15.8 },
      { feature: '分享功能', usage: 2100, growth: 22.3 }
    ];

    // 流量來源分析（模擬數據）
    const trafficSources = [
      { source: 'Google 搜尋', visitors: 3420, percentage: 45.2 },
      { source: '直接訪問', visitors: 2100, percentage: 27.8 },
      { source: '社群媒體', visitors: 1230, percentage: 16.3 },
      { source: '推薦連結', visitors: 810, percentage: 10.7 }
    ];

    // 轉換漏斗分析
    const conversionFunnel = [
      { stage: '訪問首頁', count: 10000, rate: 100 },
      { stage: '註冊帳戶', count: 2500, rate: 25 },
      { stage: '使用模板', count: 1800, rate: 18 },
      { stage: '付費訂閱', count: 320, rate: 3.2 }
    ];

    return NextResponse.json({
      overview: {
        totalSignups: userSignups?.length || 0,
        totalRevenue: revenueData,
        activeSubscriptions: (subscriptions || []).filter(s => s.is_active).length,
        churnRate: 4.2 // 模擬流失率
      },
      userSignups: userSignups || [],
      retentionData,
      featureUsage,
      trafficSources,
      conversionFunnel,
      period: daysAgo
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: '獲取分析數據失敗' },
      { status: 500 }
    );
  }
} 