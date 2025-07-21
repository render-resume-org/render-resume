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

    // 使用資料庫事務來確保原子性操作
    const { data: result, error: transactionError } = await supabase.rpc('redeem_promo_code', {
      p_code: code.trim(),
      p_user_id: currentUser.id
    });

    if (transactionError) {
      console.error('Transaction error:', transactionError);
      
      // 根據錯誤類型返回適當的錯誤訊息
      if (transactionError.message.includes('CODE_NOT_FOUND')) {
        return NextResponse.json({ error: '序號無效或不存在' }, { status: 404 });
      } else if (transactionError.message.includes('CODE_EXPIRED')) {
        return NextResponse.json({ error: '序號已過期' }, { status: 410 });
      } else if (transactionError.message.includes('CODE_ALREADY_REDEEMED')) {
        return NextResponse.json({ error: '此序號已被使用' }, { status: 409 });
      } else if (transactionError.message.includes('USER_ALREADY_SUBSCRIBED')) {
        return NextResponse.json({ 
          error: '您已擁有此方案的有效訂閱' 
        }, { status: 409 });
      } else {
        return NextResponse.json(
          { error: '序號兌換失敗，請稍後再試' },
          { status: 500 }
        );
      }
    }

    if (!result) {
      return NextResponse.json(
        { error: '序號兌換失敗，請稍後再試' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '序號兌換成功！',
      subscription: result,
    });

  } catch (error) {
    console.error('Error redeeming code:', error);
    return NextResponse.json(
      { error: '內部伺服器錯誤' },
      { status: 500 }
    );
  }
} 