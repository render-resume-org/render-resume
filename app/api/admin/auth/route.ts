import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// 管理員 ID 列表
const ADMINS = ['049512f1-9b80-4848-9df3-03adcc8f61c9'];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: "未登入" 
      }, { status: 401 });
    }

    const isAdmin = ADMINS.includes(user.id);
    
    if (!isAdmin) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: "權限不足" 
      }, { status: 403 });
    }

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '管理員'
      }
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { 
        isAdmin: false, 
        error: '認證檢查失敗' 
      },
      { status: 500 }
    );
  }
} 