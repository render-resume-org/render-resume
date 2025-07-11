import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const PAYMENT_API_BASE = process.env.PAYMENT_API_BASE;
const MERCHANT_ID = process.env.MERCHANT_ID;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 獲取當前用戶
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await request.json();

    if (!planId) {
      return NextResponse.json({ error: '缺少方案 ID' }, { status: 400 });
    }

    // 獲取方案資訊
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: '方案不存在' }, { status: 404 });
    }

    if (!plan.price) {
      return NextResponse.json({ error: '此方案不可購買' }, { status: 400 });
    }

    // 產生唯一訂單編號
    const orderId = `order_${Date.now()}_${user.id}`;

    // 準備支付參數（修正參數名稱）
    const paymentData = {
      merchantId: MERCHANT_ID,
      planId: plan.id,
      planName: plan.title,
      amount: plan.price,
      userId: user.id,
      userEmail: user.email,
      orderId,
      successUrl: `${request.nextUrl.origin}/payment/success?orderId=${orderId}&planName=${encodeURIComponent(plan.title)}`,
      failureUrl: `${request.nextUrl.origin}/payment/fail?orderId=${orderId}`,
      notifyUrl: `${request.nextUrl.origin}/api/payment/callback`,
    };

    // 取得 API Token
    const apiToken = process.env.PAYMENT_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: '缺少金流 API Token' }, { status: 500 });
    }

    // 發送請求到應援科技 API，帶上 Authorization header
    const response = await fetch(`${PAYMENT_API_BASE}/checkout-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Payment API error:', errorData);
      return NextResponse.json(
          { error: '建立支付頁面失敗' },
          { status: 500 }
        );
    }

      const paymentResult = await response.json();
      console.log('Payment API response:', paymentResult);

    return NextResponse.json({
      success: true,
      paymentUrl: `https://${MERCHANT_ID}.testing.oen.tw/checkout/subscription/${paymentResult.data.id}/`,
      orderId: paymentResult.orderId,
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: '伺服器錯誤' },
      { status: 500 }
    );
  }
} 