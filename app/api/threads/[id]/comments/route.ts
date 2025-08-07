import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/threads/[id]/comments?page=1&limit=20
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = await createClient();
    const { data: items, error, count } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count", { count: "exact" })
      .eq("parent_thread_id", Number(id))
      .order("created_at", { ascending: true })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comments: items || [], total: count || 0, page, limit });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}