import { checkAdminAuth } from "@/lib/utils/admin-auth";
import { NextRequest, NextResponse } from "next/server";

// 用戶類型定義
interface UserWithSubscription {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  subscription?: {
    plan_title: string;
    plan_type: string;
    is_active: boolean;
    expire_at: string | null;
  } | null;
  usage_count?: number;
  last_login?: string;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  freeUsers: number;
}

interface UserWithSubscriptionData {
  id: string;
  subscriptions?: Array<{
    is_active: boolean;
    plans?: Array<{
      type: string;
    }> | null;
  }> | null;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';

    const offset = (page - 1) * limit;

    // 基本查詢
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
      `, { count: 'exact' });

    // 搜索過濾
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // 分頁
    query = query.range(offset, offset + limit - 1);
    query = query.order('created_at', { ascending: false });

    const { data: usersData, error: usersError, count } = await query;

    if (usersError) {
      throw new Error('獲取用戶數據失敗: ' + usersError.message);
    }

    // 轉換數據格式
    const transformedUsers: UserWithSubscription[] = (usersData || []).map((user) => {
      const subscription = user.subscriptions?.[0];
      const plan = subscription?.plans?.[0];

      return {
        ...user,
        subscription: subscription
          ? {
              plan_title: plan?.title || "免費方案",
              plan_type: plan?.type || "free",
              is_active: subscription.is_active,
              expire_at: subscription.expire_at,
            }
          : {
              plan_title: "免費方案",
              plan_type: "free",
              is_active: true,
              expire_at: null,
            },
      };
    });

    // 計算統計數據
    const { data: allUsers } = await supabase
      .from('users')
      .select(`
        id,
        subscriptions(
          is_active,
          plans(type)
        )
      `);

    const totalUsers = allUsers?.length || 0;
    const activeUsers = allUsers?.filter(
      (user) => user.subscriptions?.[0]?.is_active
    ).length || 0;
    const paidUsers = allUsers?.filter(
      (user: UserWithSubscriptionData) => {
        const subscription = user.subscriptions?.[0];
        const plan = subscription?.plans?.[0];
        return subscription?.is_active && plan?.type !== "free";
      }
    ).length || 0;
    const freeUsers = totalUsers - paidUsers;

    const stats: AdminStats = {
      totalUsers,
      activeUsers,
      paidUsers,
      freeUsers,
    };

    // 根據篩選條件過濾用戶
    let filteredUsers = transformedUsers;
    if (filter === 'active') {
      filteredUsers = transformedUsers.filter(user => user.subscription?.is_active);
    } else if (filter === 'paid') {
      filteredUsers = transformedUsers.filter(user => 
        user.subscription?.is_active && user.subscription?.plan_type !== 'free'
      );
    } else if (filter === 'free') {
      filteredUsers = transformedUsers.filter(user => 
        user.subscription?.plan_type === 'free'
      );
    }

    return NextResponse.json({
      users: filteredUsers,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
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
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: '用戶 ID 為必填' }, { status: 400 });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error('刪除用戶失敗: ' + error.message);
    }

    return NextResponse.json({ message: '用戶已成功刪除' });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: '刪除用戶失敗' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: '用戶 ID 為必填' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error('更新用戶失敗: ' + error.message);
    }

    return NextResponse.json({ 
      message: '用戶已成功更新',
      user: data
    });

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: '更新用戶失敗' },
      { status: 500 }
    );
  }
} 