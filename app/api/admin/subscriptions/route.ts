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

// 獲取所有可用的訂閱方案
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;

    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('獲取方案列表失敗: ' + error.message);
    }

    return NextResponse.json({ plans });

  } catch (error) {
    console.error('Plans API error:', error);
    return NextResponse.json(
      { error: '獲取方案列表失敗' },
      { status: 500 }
    );
  }
}

// 為用戶創建或更新訂閱
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const body = await request.json();
    const { userId, planId, duration = 30 } = body;

    if (!userId || !planId) {
      return NextResponse.json({ error: '用戶 ID 和方案 ID 為必填' }, { status: 400 });
    }

    // 檢查用戶是否存在
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: '用戶不存在' }, { status: 404 });
    }

    // 檢查方案是否存在
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: '方案不存在' }, { status: 404 });
    }

    // 計算到期時間
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + duration);

    // 檢查是否已有有效訂閱
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (existingSubscription) {
      // 更新現有訂閱
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          plan_id: planId,
          expire_at: expireAt.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id);

      if (updateError) {
        throw new Error('更新訂閱失敗: ' + updateError.message);
      }
    } else {
      // 創建新訂閱
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          is_active: true,
          expire_at: expireAt.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('創建訂閱失敗: ' + insertError.message);
      }
    }

    return NextResponse.json({ 
      message: '訂閱已成功設定',
      subscription: {
        userId,
        planId,
        planTitle: plan.title,
        expireAt: expireAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: '設定訂閱失敗' },
      { status: 500 }
    );
  }
}

// 取消用戶訂閱
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: '用戶 ID 為必填' }, { status: 400 });
    }

    const { error } = await supabase
      .from('subscriptions')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      throw new Error('取消訂閱失敗: ' + error.message);
    }

    return NextResponse.json({ message: '訂閱已成功取消' });

  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: '取消訂閱失敗' },
      { status: 500 }
    );
  }
} 