import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    console.log('Payment callback received:', body);

    // 根據應援科技的 API 文檔，這裡需要驗證回調參數
    const { 
      orderId, 
      merchantId, 
      planId, 
      userId, 
      status, 
      amount,
      // 其他可能的參數
    } = body;

    // 驗證商戶 ID
    if (merchantId !== process.env.MERCHANT_ID) {
      console.error('Invalid merchant ID:', merchantId);
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // 如果支付成功，創建訂閱
    if (status === 'charged') {
      console.log('Processing successful payment for user:', userId, 'plan:', planId);

      // 獲取方案資訊
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (planError || !plan) {
        console.error('Plan not found:', planId, planError);
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }

      // 計算到期日期
      const expireDate = plan.duration_days 
        ? new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000)
        : null;

      // 創建訂閱記錄
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          is_active: true,
          expire_at: expireDate ? expireDate.toISOString() : null,
          order_id: orderId,
          amount: amount,
        })
        .select()
        .single();

      if (subscriptionError) {
        console.error('Failed to create subscription:', subscriptionError);
        return NextResponse.json(
          { error: 'Failed to create subscription' },
          { status: 500 }
        );
      }

      console.log('Subscription created successfully:', subscription);

      return NextResponse.json({
        success: true,
        message: 'Subscription created successfully',
        subscriptionId: subscription.id,
      });
    }

    // 支付失敗的處理
    console.log('Payment failed or cancelled:', status);
    return NextResponse.json({
      success: false,
      message: 'Payment failed or cancelled',
      status: status,
    });

  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 處理 GET 請求，用於測試
export async function GET() {
  return NextResponse.json({
    message: 'Payment callback endpoint is active',
    timestamp: new Date().toISOString(),
  });
} 