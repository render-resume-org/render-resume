import ThreadCard, { ThreadData } from "@/components/forum/thread-card";
import ViewsTracker from "@/components/forum/views-tracker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: thread } = await supabase
    .from("threads")
    .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
    .eq("id", id)
    .single();

  if (!thread) {
    return <div className="container mx-auto px-3 sm:px-4 py-6">貼文不存在</div>;
  }

  const { data: comments } = await supabase
    .from("threads")
    .select("id,user_id,content,created_at,parent_thread_id,views,likes_count,comments_count")
    .eq("parent_thread_id", id)
    .order("created_at", { ascending: true });

  const allUserIds = Array.from(new Set([thread.user_id, ...(comments || []).map(c => c.user_id)]));
  const { data: users } = await supabase
    .from("users")
    .select("id,display_name,avatar_url")
    .in("id", allUserIds);
  const map: Record<string, { display_name: string | null; avatar_url: string | null }> = {};
  (users || []).forEach(u => map[u.id] = { display_name: u.display_name, avatar_url: u.avatar_url });

  const threadDto: ThreadData = { ...thread, author: map[thread.user_id] } as ThreadData;
  const commentsDto: ThreadData[] = (comments || []).map(c => ({ ...c, author: map[c.user_id] })) as ThreadData[];

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 space-y-4">
      <ViewsTracker threadId={Number(id)} />
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <ThreadCard thread={threadDto} />
        {commentsDto.map((c) => (
          <ThreadCard key={c.id} thread={c} isComment />
        ))}
      </div>
      <CommentComposer threadId={Number(id)} />
    </div>
  );
}

function CommentComposer({ threadId }: { threadId: number }) {
  return (
    <form
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-3"
      action={`/api/threads/${threadId}`}
      method="post"
    >
      <Textarea name="content" placeholder="發表回應" className="min-h-[5rem]" />
      <div className="flex justify-end">
        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">回應</Button>
      </div>
    </form>
  );
}