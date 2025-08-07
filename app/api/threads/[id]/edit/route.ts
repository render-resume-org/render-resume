import { requireAuthentication } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthentication();
    if (!auth.isAuthenticated || !auth.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    const body = await request.json().catch(() => null);
    const content = body?.content?.toString()?.trim();
    if (!content) return NextResponse.json({ error: "內容不可為空" }, { status: 400 });

    const supabase = await createClient();

    // Verify ownership
    const { data: thread } = await supabase
      .from("threads")
      .select("id,user_id")
      .eq("id", Number(id))
      .single();
    if (!thread || thread.user_id !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: updateErr } = await supabase
      .from("threads")
      .update({ content })
      .eq("id", Number(id));

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}