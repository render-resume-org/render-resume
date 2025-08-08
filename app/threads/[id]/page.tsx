"use client";

import ThreadCard, { ThreadData } from "@/components/forum/thread-card";
import { ThreadSkeleton } from "@/components/forum/thread-skeleton";
import ViewsTracker from "@/components/forum/views-tracker";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

async function fetchThread(id: number) {
  const res = await fetch(`/api/threads/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as { thread: ThreadData; comments: ThreadData[] };
}

async function fetchComments(id: number, page: number, limit: number) {
  const res = await fetch(`/api/threads/${id}/comments?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) return { comments: [], total: 0 };
  return (await res.json()) as { comments: ThreadData[]; total: number; page: number; limit: number };
}

export default function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<number | null>(null);
  const [thread, setThread] = useState<ThreadData | null>(null);
  const [comments, setComments] = useState<ThreadData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [appending, setAppending] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setId(Number(p.id));
    })();
  }, [params]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const data = await fetchThread(id);
      if (data) {
        setThread(data.thread);
        setComments(data.comments);
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setComments([]);
    setPage(1);
    setHasMore(true);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const run = async () => {
      if (page > 1) setAppending(true);
      const resp = await fetchComments(id, page, 20);
      if (cancelled) return;
      setComments(prev => (page === 1 ? resp.comments : [...prev, ...resp.comments]));
      setHasMore(resp.comments.length > 0);
      setAppending(false);
    };
    run();
    return () => { cancelled = true; };
  }, [id, page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) setPage(p => p + 1);
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore]);

  if (!id) return null;
  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <ThreadSkeleton />
          {Array.from({ length: 4 }).map((_, i) => (
            <ThreadSkeleton key={i} isComment />
          ))}
        </div>
      </div>
    );
  }

  if (!thread) return <div className="container mx-auto px-3 sm:px-4 py-6">貼文不存在</div>;

  const handleCommentSubmit = async (formData: FormData) => {
    const content = (formData.get("content") || "").toString().trim();
    if (!content) return;
    // optimistic
    const temp: ThreadData = {
      id: Date.now(),
      user_id: "me",
      content,
      created_at: new Date().toISOString(),
      parent_thread_id: id,
      likes_count: 0,
      comments_count: 0,
      views: 0,
    } as ThreadData;
    setComments(prev => [temp, ...prev]);
    setThread(prev => (prev ? { ...prev, comments_count: (prev.comments_count || 0) + 1 } : prev));
    try {
      const res = await fetch(`/api/threads/${id}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      // refresh from first page to get real data
      setPage(1);
    } catch {
      // rollback
      setComments(prev => prev.filter(c => c.id !== temp.id));
      setThread(prev => (prev ? { ...prev, comments_count: Math.max(0, (prev.comments_count || 0) - 1) } : prev));
    }
  };

  const handleDeleted = (commentId: number) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    setThread(prev => (prev ? { ...prev, comments_count: Math.max(0, (prev.comments_count || 0) - 1) } : prev));
  };

  const handleUpdated = (cid: number, content: string) => {
    setComments(prev => prev.map(c => (c.id === cid ? { ...c, content } : c)));
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <Link href="/threads" className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>
        </div>
        <ViewsTracker threadId={Number(id)} />
        <div className="rounded-xl overflow-hidden">
          <ThreadCard thread={thread} onUpdated={(tid, content) => { if (tid === thread.id) setThread({ ...thread, content }); }} />
          {comments.map((c) => (
            <ThreadCard key={c.id} thread={c} isComment onDeleted={handleDeleted} onUpdated={handleUpdated} />
          ))}
          {appending && (
            <div>
              {Array.from({ length: 2 }).map((_, i) => (
                <ThreadSkeleton key={`append-${i}`} isComment />
              ))}
            </div>
          )}
          <div ref={loaderRef} className="h-8" />
        </div>
        <CommentComposer threadId={Number(id)} onSubmit={handleCommentSubmit} />
      </div>
    </div>
  );
}

function CommentComposer({ threadId, onSubmit }: { threadId: number; onSubmit: (formData: FormData) => void }) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  return (
    <form
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3"
      action={async (fd) => {
        setPending(true);
        await onSubmit(fd);
        setPending(false);
        setValue("");
      }}
    >
      <Textarea name="content" value={value} onChange={(e) => setValue(e.target.value)} placeholder="發表回應" className="min-h-[4.5rem]" />
      <div className="flex justify-end">
        <Button type="submit" disabled={pending} aria-busy={pending} className="bg-cyan-600 hover:bg-cyan-700">{pending ? "回應中..." : "回應"}</Button>
      </div>
    </form>
  );
}