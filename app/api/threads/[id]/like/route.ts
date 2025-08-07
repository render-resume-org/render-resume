import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthentication();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const threadId = Number(id);
    const userId = auth.user.id;

    const supabase = await createClient();

    // Check existing like
    const { data: existing } = await supabase
      .from("likes")
      .select("id")
      .eq("thread_id", threadId)
      .eq("user_id", userId)
      .maybeSingle();

    let liked = false;
    if (existing) {
      await supabase.from("likes").delete().eq("id", existing.id);
    } else {
      const { error: likeErr } = await supabase
        .from("likes")
        .insert({ thread_id: threadId, user_id: userId });
      if (likeErr) return NextResponse.json({ error: likeErr.message }, { status: 500 });
      liked = true;
    }

    // Refresh likes count
    const { count } = await supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("thread_id", threadId);

    const likesCount = count || 0;
    await supabase.from("threads").update({ likes_count: likesCount }).eq("id", threadId);

    return NextResponse.json({ liked, likes_count: likesCount });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}