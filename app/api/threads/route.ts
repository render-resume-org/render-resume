import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/threads?sort=recommended|new&page=1&limit=20
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const sort = (searchParams.get("sort") || "recommended") as "recommended" | "new";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: rows, error } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views")
      .is("parent_thread_id", null)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const threadIds = (rows || []).map(r => r.id);

    // Current user (for liked_by_me)
    const { data: authData } = await supabase.auth.getUser();
    const currentUserId = authData?.user?.id || null;
    const likedSet = new Set<number>();
    if (currentUserId && threadIds.length > 0) {
      const { data: myLikes } = await supabase
        .from("likes")
        .select("thread_id")
        .eq("user_id", currentUserId)
        .in("thread_id", threadIds);
      (myLikes || []).forEach(l => l.thread_id && likedSet.add(l.thread_id));
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

    // Compute likes_count per thread by fetching likes rows for these threads
    const likesCountMap: Record<number, number> = {};
    if (threadIds.length > 0) {
      const { data: likesRows } = await supabase
        .from("likes")
        .select("thread_id")
        .in("thread_id", threadIds);
      (likesRows || []).forEach(l => {
        if (!l.thread_id) return;
        likesCountMap[l.thread_id] = (likesCountMap[l.thread_id] || 0) + 1;
      });
    }

    // Compute comments_count per thread by fetching child threads for these parents
    const commentsCountMap: Record<number, number> = {};
    if (threadIds.length > 0) {
      const { data: commentRows } = await supabase
        .from("threads")
        .select("parent_thread_id")
        .in("parent_thread_id", threadIds);
      (commentRows || []).forEach(c => {
        if (!c.parent_thread_id) return;
        commentsCountMap[c.parent_thread_id] = (commentsCountMap[c.parent_thread_id] || 0) + 1;
      });
    }

    // Simple recommendation score (computed in app layer)
    const scored = (rows || []).map((r) => {
      const likesCount = likesCountMap[r.id] || 0;
      const commentsCount = commentsCountMap[r.id] || 0;
      const ageHours = Math.max(1, (Date.now() - new Date(r.created_at).getTime()) / 3600000);
      const popularity = likesCount * 3 + commentsCount * 2 + (r.views || 0) * 0.5;
      const recScore = popularity / Math.pow(ageHours, 0.6);
      return { 
        ...r, 
        likes_count: likesCount, 
        comments_count: commentsCount, 
        recScore, 
        author: userMap[r.user_id], 
        is_liked_by_me: likedSet.has(r.id)
      };
    });

    const threads = sort === "recommended"
      ? scored.sort((a, b) => b.recScore - a.recScore)
      : scored;

    return NextResponse.json({ threads, page, limit });
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