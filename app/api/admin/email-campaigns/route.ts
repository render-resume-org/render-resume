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

// 獲取所有郵件活動
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // 模擬郵件活動數據（實際應該有專門的表）
    const campaigns = [
      {
        id: '1',
        title: '歡迎新用戶',
        subject: '歡迎加入 Render Resume！',
        type: 'welcome',
        status: 'active',
        recipientCount: 1250,
        openRate: 68.5,
        clickRate: 15.2,
        createdAt: '2024-01-15T10:00:00Z',
        sentAt: '2024-01-15T14:00:00Z'
      },
      {
        id: '2',
        title: '產品更新通知',
        subject: '🚀 全新模板上線了！',
        type: 'product_update',
        status: 'sent',
        recipientCount: 3420,
        openRate: 45.8,
        clickRate: 8.7,
        createdAt: '2024-01-10T09:00:00Z',
        sentAt: '2024-01-10T16:00:00Z'
      },
      {
        id: '3',
        title: '訂閱到期提醒',
        subject: '您的訂閱即將到期',
        type: 'subscription_reminder',
        status: 'draft',
        recipientCount: 0,
        openRate: 0,
        clickRate: 0,
        createdAt: '2024-01-20T11:00:00Z',
        sentAt: null
      }
    ];

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total: campaigns.length,
        totalPages: Math.ceil(campaigns.length / limit)
      }
    });

  } catch (error) {
    console.error('Email campaigns API error:', error);
    return NextResponse.json(
      { error: '獲取郵件活動失敗' },
      { status: 500 }
    );
  }
}

// 創建新的郵件活動
export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { title, subject, content, type, targetAudience } = body;

    if (!title || !subject || !content) {
      return NextResponse.json({ error: '標題、主旨和內容為必填' }, { status: 400 });
    }

    // 在實際應用中，這裡會創建郵件活動並存儲到數據庫
    const newCampaign = {
      id: Date.now().toString(),
      title,
      subject,
      content,
      type: type || 'general',
      targetAudience: targetAudience || 'all',
      status: 'draft',
      recipientCount: 0,
      openRate: 0,
      clickRate: 0,
      createdAt: new Date().toISOString(),
      sentAt: null
    };

    return NextResponse.json({ 
      message: '郵件活動已創建',
      campaign: newCampaign
    });

  } catch (error) {
    console.error('Create email campaign error:', error);
    return NextResponse.json(
      { error: '創建郵件活動失敗' },
      { status: 500 }
    );
  }
} 