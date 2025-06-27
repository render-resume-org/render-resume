import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 處理Supabase session
  const response = await updateSession(request);

  // 檢查是否為admin路由
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 在實際應用中，這裡應該檢查用戶是否為管理員
    // 現在暫時允許所有已登入用戶訪問admin路由
    // 實際實現時需要檢查用戶角色或權限
    
    // 可以在這裡添加admin權限檢查
    // const user = await getUser(request);
    // if (!user || !user.is_admin) {
    //   return NextResponse.redirect(new URL('/auth/login', request.url));
    // }
    
    console.log('Admin route accessed:', request.nextUrl.pathname);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
