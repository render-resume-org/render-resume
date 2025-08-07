import { createClient } from "@/lib/supabase/server";
import NewThreadForm from "@/components/forum/new-thread-form";
import ThreadCard, { ThreadData } from "@/components/forum/thread-card";
import Link from "next/link";

export default async function ThreadsPage({ searchParams }: { searchParams: { sort?: string } }) {
  const sortParam = (searchParams?.sort === "new" ? "new" : "recommended") as "recommended" | "new";
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("threads")
    .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
    .is("parent_thread_id", null)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load threads:", error.message);
  }

  const userIds = Array.from(new Set((rows || []).map(r => r.user_id)));
  const { data: users } = await supabase
    .from("users")
    .select("id,display_name,avatar_url")
    .in("id", userIds);
  const userMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
  (users || []).forEach(u => { userMap[u.id] = { display_name: u.display_name, avatar_url: u.avatar_url }; });

  const scored = (rows || []).map((r) => {
    const ageHours = Math.max(1, (Date.now() - new Date(r.created_at).getTime()) / 3600000);
    const popularity = (r.likes_count || 0) * 3 + (r.comments_count || 0) * 2 + (r.views || 0) * 0.5;
    const recScore = popularity / Math.pow(ageHours, 0.6);
    return { ...r, recScore, author: userMap[r.user_id] } as ThreadData & { recScore: number };
  });

  const threads = (sortParam === "recommended"
    ? scored.sort((a, b) => b.recScore - a.recScore)
    : scored) as ThreadData[];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">社群論壇</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/threads?sort=recommended" className={`px-3 py-1 rounded-md border ${sortParam === "recommended" ? "bg-cyan-600 text-white border-cyan-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>推薦</Link>
          <Link href="/threads?sort=new" className={`px-3 py-1 rounded-md border ${sortParam === "new" ? "bg-cyan-600 text-white border-cyan-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>最新</Link>
        </div>
      </div>

      <NewThreadForm />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {threads.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">暫無貼文</div>
        ) : (
          threads.map((t) => <ThreadCard key={t.id} thread={t} />)
        )}
      </div>
    </div>
  );
}