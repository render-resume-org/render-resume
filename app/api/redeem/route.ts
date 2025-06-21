import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 獲取當前用戶
    const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 解析請求體
    const body = await request.json();
    const { code } = body;

    // 驗證輸入
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '請輸入有效的序號' }, { status: 400 });
    }

    // 查找方案
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('code', code.trim())
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: '序號無效或不存在' }, { status: 404 });
    }

    // 檢查用戶是否已有該方案的有效訂閱
    const { data: existingSubscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('plan_id', plan.id)
      .eq('is_active', true)
      .gte('expire_at', new Date().toISOString())
      .single();

    if (existingSubscription) {
      return NextResponse.json({ 
        error: '您已擁有此方案的有效訂閱' 
      }, { status: 409 });
    }

    // 計算到期日期
    const expireDate = plan.duration_days 
      ? new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000)
      : null;

    // 創建新訂閱
    const { data: subscription, error: createError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: currentUser.id,
        plan_id: plan.id,
        is_active: true,
        expire_at: expireDate?.toISOString() || null,
      })
      .select(`
        *,
        plans:plan_id (*)
      `)
      .single();

    if (createError) {
      console.error('Error creating subscription:', createError);
      return NextResponse.json(
        { error: '序號兌換失敗，請稍後再試' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '序號兌換成功！',
      subscription,
    });

  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json(
      { error: '內部伺服器錯誤' },
      { status: 500 }
    );
  }
} 