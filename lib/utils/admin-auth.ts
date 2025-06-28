import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/config/admin-config";

export interface AdminAuthResult {
  success: true;
  user: {
    id: string;
    email: string;
    name: string;
  };
  supabase: Awaited<ReturnType<typeof createClient>>;
}

export interface AdminAuthError {
  success: false;
  error: string;
  status: number;
}

export type AdminAuthResponse = AdminAuthResult | AdminAuthError;

/**
 * Centralized admin authentication check
 * Returns either success with user data or error with status
 */
export async function checkAdminAuth(): Promise<AdminAuthResponse> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { 
        success: false, 
        error: "未登入", 
        status: 401 
      };
    }

    if (!isAdmin(user.id)) {
      return { 
        success: false, 
        error: "權限不足", 
        status: 403 
      };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || '管理員'
      },
      supabase
    };

  } catch (error) {
    console.error('Admin auth error:', error);
    return {
      success: false,
      error: '認證檢查失敗',
      status: 500
    };
  }
}