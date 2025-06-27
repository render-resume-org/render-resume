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

// GET - 獲取所有公告
export async function GET() {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;

    const { data: announcements, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ announcements: announcements || [] });

  } catch (error) {
    console.error('Get announcements error:', error);
    return NextResponse.json(
      { error: '獲取公告失敗' },
      { status: 500 }
    );
  }
}

// POST - 創建新公告
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { user, supabase } = authResult;
    const body = await request.json();

    const { title, content, type, is_active } = body;

    if (!title || !content) {
      return NextResponse.json({ error: '標題和內容為必填項' }, { status: 400 });
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        title,
        content,
        type: type || 'info',
        is_active: is_active ?? true,
        author: user.user_metadata?.name || user.email
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ announcement });

  } catch (error) {
    console.error('Create announcement error:', error);
    return NextResponse.json(
      { error: '創建公告失敗' },
      { status: 500 }
    );
  }
}

// PUT - 更新公告
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const body = await request.json();

    const { id, title, content, type, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: '缺少公告 ID' }, { status: 400 });
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .update({
        title,
        content,
        type,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ announcement });

  } catch (error) {
    console.error('Update announcement error:', error);
    return NextResponse.json(
      { error: '更新公告失敗' },
      { status: 500 }
    );
  }
}

// DELETE - 刪除公告
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { supabase } = authResult;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少公告 ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { error: '刪除公告失敗' },
      { status: 500 }
    );
  }
} 