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

    // 查找 promo code
    const { data: promoCode, error: promoError } = await supabase
      .from('promo_codes')
      .select(`
        *,
        plans:plan_id (*)
      `)
      .eq('code', code.trim())
      .single();

    if (promoError || !promoCode) {
      return NextResponse.json({ error: '序號無效或不存在' }, { status: 404 });
    }

    // 檢查 promo code 是否過期
    if (promoCode.expire_date && new Date(promoCode.expire_date) < new Date()) {
      return NextResponse.json({ error: '序號已過期' }, { status: 410 });
    }

    // 檢查是否為一次性代碼且已被兌換
    if (promoCode.single_use && promoCode.redeemed_by) {
      return NextResponse.json({ error: '此序號已被使用' }, { status: 409 });
    }

    // 檢查用戶是否已有該方案的有效訂閱
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('plan_id', promoCode.plan_id)
      .eq('is_active', true)
      .gte('expire_at', new Date().toISOString())
      .single();

    if (existingSubscription) {
      return NextResponse.json({ 
        error: '您已擁有此方案的有效訂閱' 
      }, { status: 409 });
    }

    // 計算到期日期
    const plan = promoCode.plans;
    const expireDate = plan.duration_days 
      ? new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000)
      : null;

    // 開始事務：創建訂閱並更新 promo code（如果是一次性代碼）
    const { data: subscription, error: createError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: currentUser.id,
        plan_id: promoCode.plan_id,
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

    // 如果是一次性代碼，更新 redeemed_by
    if (promoCode.single_use) {
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({ redeemed_by: currentUser.id })
        .eq('id', promoCode.id);

      if (updateError) {
        console.error('Error updating promo code:', updateError);
        // 注意：這裡不返回錯誤，因為訂閱已經創建成功
        // 但應該記錄這個問題以便後續處理
      }
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