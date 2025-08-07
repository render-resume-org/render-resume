import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Get current views
    const { data } = await supabase
      .from("threads")
      .select("views")
      .eq("id", Number(id))
      .single();

    const current = data?.views || 0;
    await supabase
      .from("threads")
      .update({ views: current + 1 })
      .eq("id", Number(id));

    return NextResponse.json({ views: current + 1 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}