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
      status,
      // 其他可能的參數
    } = body;

    console.log('Payment callback received:', body);

    // 驗證商戶 ID
    if (merchantId !== process.env.MERCHANT_ID) {
      console.error('Invalid merchant ID:', merchantId);
      return NextResponse.json({ error: 'Invalid merchant' }, { status: 400 });
    }

    // 如果支付成功，創建訂閱
    if (status === 'charged') {
      console.log('Processing successful payment for orderId:', orderId);

      // 根據 order_id 查找訂單信息
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          plans (*)
        `)
        .eq('order_id', orderId)
        .single();

      if (orderError || !order) {
        console.error('Order not found:', orderId, orderError);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (!order.plans) {
        console.error('Plan not found for order:', orderId);
        return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
      }

      // 更新訂單狀態為已支付
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({
          status: 'paid',
          transaction_id: body.transactionId || body.transaction_id
        })
        .eq('order_id', orderId);

      if (updateOrderError) {
        console.error('Failed to update order status:', updateOrderError);
        return NextResponse.json(
          { error: 'Failed to update order status' },
          { status: 500 }
        );
      }

      // 計算到期日期
      const expireDate = order.plans.duration_days 
        ? new Date(Date.now() + order.plans.duration_days * 24 * 60 * 60 * 1000)
        : null;

      // 創建訂閱記錄
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: order.user_id,
          plan_id: order.plan_id,
          is_active: true,
          expire_at: expireDate ? expireDate.toISOString() : null,
          transaction_id: body.transactionId || body.transaction_id,
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
    
    // 更新訂單狀態為失敗
    if (orderId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'failed',
          transaction_id: body.transactionId || body.transaction_id
        })
        .eq('order_id', orderId);
      
      if (updateError) {
        console.error('Failed to update order status:', updateError);
      }
    }
    
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