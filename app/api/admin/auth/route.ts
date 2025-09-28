import { checkAdminAuth } from "@/features/admin/services/admin-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const authResult = await checkAdminAuth();
  
  if (!authResult.success) {
    return NextResponse.json(
      { 
        isAdmin: false, 
        error: authResult.error 
      },
      { status: authResult.status }
    );
  }

  return NextResponse.json({
    isAdmin: true,
    user: authResult.user
  });
} 