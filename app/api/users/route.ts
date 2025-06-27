import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 檢查管理員權限
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const ADMINS = ['049512f1-9b80-4848-9df3-03adcc8f61c9'];
    if (!ADMINS.includes(user.id)) {
      return NextResponse.json({ error: "權限不足" }, { status: 403 });
    }

    // 獲取查詢參數
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const plan = searchParams.get('plan') || '';
    
    const offset = (page - 1) * limit;

    // 建立查詢
    let query = supabase
      .from('users')
      .select(`
        *,
        subscriptions(
          is_active,
          expire_at,
          plans(
            title,
            type
          )
        )
      `);

    // 搜尋過濾
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    // 計算總數
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // 獲取分頁數據
    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    const { data: users, error } = await query;

    if (error) {
      throw error;
    }

    // 轉換數據格式
    const transformedUsers = users?.map(user => {
      const subscription = user.subscriptions?.[0];
      const plan = subscription?.plans;
      
      return {
        ...user,
        subscription: subscription ? {
          plan_title: plan?.title || 'Free',
          plan_type: plan?.type || 'free',
          is_active: subscription.is_active,
          expire_at: subscription.expire_at,
        } : null,
        usage_count: Math.floor(Math.random() * 100), // 模擬數據
        last_login: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }) || [];

    // 根據方案過濾
    const filteredUsers = plan 
      ? transformedUsers.filter(user => 
          user.subscription?.plan_type === plan || (!user.subscription && plan === 'free')
        )
      : transformedUsers;

    return NextResponse.json({
      users: filteredUsers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: page * limit < (count || 0),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json(
      { error: '獲取用戶數據失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // 檢查管理員權限
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const ADMINS = ['049512f1-9b80-4848-9df3-03adcc8f61c9'];
    if (!ADMINS.includes(user.id)) {
      return NextResponse.json({ error: "權限不足" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: '缺少用戶 ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: '刪除用戶失敗' },
      { status: 500 }
    );
  }
} 