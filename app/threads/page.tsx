"use client";


import NewThreadForm from "@/components/forum/new-thread-form";
import ThreadCard, { ThreadData } from "@/components/forum/thread-card";
import { ThreadSkeleton } from "@/components/forum/thread-skeleton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const LIMIT = 20;

async function loadThreads(sort: "recommended" | "new", page: number, limit: number): Promise<ThreadData[]> {
  const res = await fetch(`/api/threads?sort=${sort}&page=${page}&limit=${limit}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({ threads: [] }));
  return data.threads || [];
}

export default function ThreadsPage() {
  const searchParams = useSearchParams();
  const sortParam = (searchParams.get("sort") === "new" ? "new" : "recommended") as "recommended" | "new";
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [appending, setAppending] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Reset and show skeleton immediately to prevent empty state flash
    setThreads([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setAppending(false);
  }, [sortParam]);

  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      if (page === 1) setLoading(true); else setAppending(true);
      const items = await loadThreads(sortParam, page, LIMIT);
      if (cancelled) return;
      setThreads(prev => (page === 1 ? items : [...prev, ...items]));
      setHasMore(items.length === LIMIT);
      setLoading(false);
      setAppending(false);
    };
    fetchPage();
    return () => { cancelled = true; };
  }, [sortParam, page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore && !loading && !appending) {
          setPage(p => p + 1);
        }
      });
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, appending]);

  const handleDeleted = (id: number) => {
    setThreads(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdated = (id: number, content: string) => {
    setThreads(prev => prev.map(t => (t.id === id ? { ...t, content } : t)));
  };

  // Handle optimistic create lifecycle
  const handleCreatedEvent: NonNullable<React.ComponentProps<typeof NewThreadForm>["onCreated"]> = (e) => {
    const tempId = -Math.abs(e.clientId);
    if (e.state === "created" && e.temp) {
      // Insert temp with pending flag
      const tempItem = { ...e.temp, id: tempId, is_pending: true } as ThreadData;
      setThreads(prev => [tempItem, ...prev]);
      return;
    }
    if (e.state === "success") {
      // Replace temp with server thread (use new id)
      if (e.serverThread?.id) {
        setThreads(prev => prev.map(t => (t.id === tempId ? { ...t, ...e.serverThread, id: e.serverThread!.id, is_pending: false } as ThreadData : t)));
      } else {
        // Fallback: just clear pending
        setThreads(prev => prev.map(t => (t.id === tempId ? { ...t, is_pending: false } : t)));
      }
      return;
    }
    if (e.state === "error") {
      // Remove failed temp
      setThreads(prev => prev.filter(t => t.id !== tempId));
      return;
    }
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">社群論壇</h1>
          <div className="flex gap-1 p-1 rounded-md border border-gray-200 dark:border-gray-800" role="tablist" aria-label="Threads tabs">
            <Link
              role="tab"
              aria-selected={sortParam === "recommended"}
              href="/threads?sort=recommended"
              className={`px-3 py-1 rounded-md text-sm transition-colors ${sortParam === "recommended" ? "bg-cyan-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              精選
            </Link>
            <Link
              role="tab"
              aria-selected={sortParam === "new"}
              href="/threads?sort=new"
              className={`px-3 py-1 rounded-md text-sm transition-colors ${sortParam === "new" ? "bg-cyan-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"}`}
            >
              最新
            </Link>
          </div>
        </div>

        {/* Unified card container like announcements */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 shadow-sm overflow-hidden">
          {/* Compose inset */}
          <NewThreadForm onCreated={handleCreatedEvent} variant="inset" />

          {/* Feed body */}
          <div className="p-0">
            {loading ? (
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <ThreadSkeleton key={i} />
                ))}
              </div>
            ) : threads.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">暫無貼文</div>
            ) : (
              <>
                {threads.map((t) => (
                  <ThreadCard key={t.id} thread={t} onDeleted={handleDeleted} onUpdated={handleUpdated} />
                ))}
                {appending && (
                  <div>
                    {Array.from({ length: 2 }).map((_, i) => (
                      <ThreadSkeleton key={`append-${i}`} />
                    ))}
                  </div>
                )}
              </>
            )}
            {threads.length > 0 && <div ref={loaderRef} className="h-10" />}
          </div>
        </div>
      </div>
    </div>
  );
}