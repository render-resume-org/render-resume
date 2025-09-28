import { TablesInsert, TablesUpdate } from "@/types/database";
import { checkAdminAuth } from "@/features/admin/services/admin-auth";
import { NextRequest, NextResponse } from "next/server";

// 獲取所有方案
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;

    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error('獲取方案列表失敗: ' + error.message);
    }

    return NextResponse.json({ 
      success: true, 
      plans: plans || [] 
    });

  } catch (error) {
    console.error('Get plans error:', error);
    return NextResponse.json(
      { error: '獲取方案列表失敗' },
      { status: 500 }
    );
  }
}

// 創建新方案
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const body = await request.json();
    
    const { title, type, price, daily_usage, duration_days, default: isDefault } = body;

    // 驗證必填欄位
    if (!title?.trim()) {
      return NextResponse.json({ error: '方案標題為必填' }, { status: 400 });
    }

    if (!type?.trim()) {
      return NextResponse.json({ error: '方案類型為必填' }, { status: 400 });
    }

    if (typeof daily_usage !== 'number' || daily_usage < 0) {
      return NextResponse.json({ error: '每日使用次數必須為非負數' }, { status: 400 });
    }

    // 如果設為預設方案，先清除其他預設方案
    if (isDefault) {
      await supabase
        .from('plans')
        .update({ default: false })
        .eq('default', true);
    }

    const planData: TablesInsert<'plans'> = {
      title: title.trim(),
      type: type.trim(),
      price: price || null,
      daily_usage,
      duration_days: duration_days || null,
      default: isDefault || false,
    };

    const { data: newPlan, error } = await supabase
      .from('plans')
      .insert(planData)
      .select()
      .single();

    if (error) {
      throw new Error('創建方案失敗: ' + error.message);
    }

    return NextResponse.json({
      success: true,
      message: '方案創建成功',
      plan: newPlan
    });

  } catch (error) {
    console.error('Create plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '創建方案失敗' },
      { status: 500 }
    );
  }
}

// 更新方案
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const body = await request.json();
    
    const { id, title, type, price, daily_usage, duration_days, default: isDefault } = body;

    if (!id) {
      return NextResponse.json({ error: '方案 ID 為必填' }, { status: 400 });
    }

    // 驗證必填欄位
    if (!title?.trim()) {
      return NextResponse.json({ error: '方案標題為必填' }, { status: 400 });
    }

    if (!type?.trim()) {
      return NextResponse.json({ error: '方案類型為必填' }, { status: 400 });
    }

    if (typeof daily_usage !== 'number' || daily_usage < 0) {
      return NextResponse.json({ error: '每日使用次數必須為非負數' }, { status: 400 });
    }

    // 檢查方案是否存在
    const { data: existingPlan, error: checkError } = await supabase
      .from('plans')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingPlan) {
      return NextResponse.json({ error: '方案不存在' }, { status: 404 });
    }

    // 如果設為預設方案，先清除其他預設方案
    if (isDefault) {
      await supabase
        .from('plans')
        .update({ default: false })
        .eq('default', true)
        .neq('id', id);
    }

    const updateData: TablesUpdate<'plans'> = {
      title: title.trim(),
      type: type.trim(),
      price: price || null,
      daily_usage,
      duration_days: duration_days || null,
      default: isDefault || false,
    };

    const { data: updatedPlan, error } = await supabase
      .from('plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('更新方案失敗: ' + error.message);
    }

    return NextResponse.json({
      success: true,
      message: '方案更新成功',
      plan: updatedPlan
    });

  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新方案失敗' },
      { status: 500 }
    );
  }
}

// 刪除方案
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('id');

    if (!planId) {
      return NextResponse.json({ error: '方案 ID 為必填' }, { status: 400 });
    }

    // 檢查是否有使用者正在使用此方案
    const { data: activeSubscriptions, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('plan_id', planId)
      .eq('is_active', true)
      .limit(1);

    if (checkError) {
      throw new Error('檢查方案使用狀態失敗: ' + checkError.message);
    }

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      return NextResponse.json(
        { error: '此方案仍有使用者訂閱，無法刪除' },
        { status: 400 }
      );
    }

    // 檢查是否有促銷代碼使用此方案
    const { data: promoCodes, error: promoError } = await supabase
      .from('promo_codes')
      .select('id')
      .eq('plan_id', planId)
      .limit(1);

    if (promoError) {
      throw new Error('檢查促銷代碼使用狀態失敗: ' + promoError.message);
    }

    if (promoCodes && promoCodes.length > 0) {
      return NextResponse.json(
        { error: '此方案仍有促銷代碼使用，無法刪除' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', planId);

    if (error) {
      throw new Error('刪除方案失敗: ' + error.message);
    }

    return NextResponse.json({
      success: true,
      message: '方案刪除成功'
    });

  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '刪除方案失敗' },
      { status: 500 }
    );
  }
}