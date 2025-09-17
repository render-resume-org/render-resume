import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: thread, error } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views")
      .eq("id", id)
      .single();

    if (error || !thread) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: comments } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views")
      .eq("parent_thread_id", id)
      .order("created_at", { ascending: true });

    // Attach author info and liked_by_me
    const allUsers = Array.from(new Set([thread.user_id, ...(comments || []).map(c => c.user_id)]));
    const { data: users } = await supabase
      .from("users")
      .select("id,display_name,avatar_url")
      .in("id", allUsers);
    const map: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
    (users || []).forEach(u => map[u.id] = { display_name: u.display_name, avatar_url: u.avatar_url });

    // Is liked by me
    const { data: authUser } = await supabase.auth.getUser();
    const likedIds = new Set<string>();
    if (authUser?.user) {
      const allIds = [thread.id, ...((comments || []).map(c => c.id))];
      if (allIds.length > 0) {
        const { data: likes } = await supabase
          .from("likes")
          .select("thread_id")
          .eq("user_id", authUser.user.id)
          .in("thread_id", allIds);
        (likes || []).forEach(l => l.thread_id && likedIds.add(l.thread_id));
      }
    }

    // Compute likes for thread
    const { data: likesForThread } = await supabase.from("likes").select("id").eq("thread_id", thread.id);
    const threadLikes = (likesForThread || []).length;
    const threadCommentsCount = (comments || []).length;

    const threadDto = { ...thread, author: map[thread.user_id], is_liked_by_me: likedIds.has(thread.id), likes_count: threadLikes, comments_count: threadCommentsCount };

    // Compute likes and children comments count for each comment
    const commentIds = (comments || []).map(c => c.id);
    const commentLikesCountMap: Record<string, number> = {};
    const commentChildrenCountMap: Record<string, number> = {};
    if (commentIds.length > 0) {
      const [{ data: likesRows }, { data: childRows }] = await Promise.all([
        supabase.from("likes").select("thread_id").in("thread_id", commentIds),
        supabase.from("threads").select("parent_thread_id").in("parent_thread_id", commentIds),
      ]);
      (likesRows || []).forEach(l => {
        if (!l.thread_id) return;
        commentLikesCountMap[l.thread_id] = (commentLikesCountMap[l.thread_id] || 0) + 1;
      });
      (childRows || []).forEach(c => {
        if (!c.parent_thread_id) return;
        commentChildrenCountMap[c.parent_thread_id] = (commentChildrenCountMap[c.parent_thread_id] || 0) + 1;
      });
    }

    const commentsDto = (comments || []).map(c => ({
      ...c,
      author: map[c.user_id],
      is_liked_by_me: likedIds.has(c.id),
      likes_count: commentLikesCountMap[c.id] || 0,
      comments_count: commentChildrenCountMap[c.id] || 0,
    }));

    return NextResponse.json({ thread: threadDto, comments: commentsDto });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthentication();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;

    let content = "";
    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = await request.json().catch(() => null);
      content = body?.content?.toString()?.trim() || "";
    } else {
      const form = await request.formData();
      content = (form.get("content")?.toString() || "").trim();
    }
    if (!content) {
      return NextResponse.json({ error: "內容不可為空" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error: insertErr } = await supabase
      .from("threads")
      .insert({
        user_id: auth.user.id,
        content,
        parent_thread_id: id,
        views: 0,
      });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}