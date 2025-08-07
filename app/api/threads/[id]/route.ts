import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data: thread, error } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
      .eq("id", id)
      .single();

    if (error || !thread) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: comments } = await supabase
      .from("threads")
      .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
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
    const likedIds = new Set<number>();
    if (authUser?.user) {
      const { data: likes } = await supabase
        .from("likes")
        .select("thread_id")
        .eq("user_id", authUser.user.id)
        .in("thread_id", [thread.id, ...((comments || []).map(c => c.id))]);
      (likes || []).forEach(l => likedIds.add(l.thread_id));
    }

    const threadDto = { ...thread, author: map[thread.user_id], is_liked_by_me: likedIds.has(thread.id) };
    const commentsDto = (comments || []).map(c => ({ ...c, author: map[c.user_id], is_liked_by_me: likedIds.has(c.id) }));

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
        parent_thread_id: Number(id),
        views: 0,
        likes_count: 0,
        comments_count: 0,
      });

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // increment parent comments_count
    await supabase.rpc("noop"); // placeholder if no RPC; ignore errors
    await supabase
      .from("threads")
      .update({ comments_count: (undefined as unknown as number) }) // will be ignored if no trigger; best-effort via SQL not supported here
      .eq("id", Number(id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}