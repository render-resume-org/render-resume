import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";


// GET /api/threads?sort=recommended|new
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get("sort") || "recommended") as "recommended" | "new";

    const { data: rows, error } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
      .is("parent_thread_id", null)
      .order(sort === "new" ? "created_at" : "created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch authors
    const userIds = Array.from(new Set((rows || []).map(r => r.user_id)));
    const userMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from("users")
        .select("id,display_name,avatar_url")
        .in("id", userIds);
      (users || []).forEach(u => { userMap[u.id] = { display_name: u.display_name, avatar_url: u.avatar_url }; });
    }

    // Simple recommendation score
    const scored = (rows || []).map((r) => {
      const ageHours = Math.max(1, (Date.now() - new Date(r.created_at).getTime()) / 3600000);
      const popularity = (r.likes_count || 0) * 3 + (r.comments_count || 0) * 2 + (r.views || 0) * 0.5;
      const recScore = popularity / Math.pow(ageHours, 0.6);
      return { ...r, recScore, author: userMap[r.user_id] };
    });

    const threads = sort === "recommended"
      ? scored.sort((a, b) => b.recScore - a.recScore)
      : scored;

    return NextResponse.json({ threads });
      } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
  
// POST /api/threads
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuthentication();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const content = body?.content?.toString()?.trim();
    if (!content) {
      return NextResponse.json({ error: "內容不可為空" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("threads")
      .insert({
        user_id: auth.user.id,
        content,
        parent_thread_id: null,
        views: 0,
        likes_count: 0,
        comments_count: 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ thread: data });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}