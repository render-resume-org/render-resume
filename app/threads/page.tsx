"use client";


import NewThreadForm from "@/components/forum/new-thread-form";
import ThreadCard, { ThreadData } from "@/components/forum/thread-card";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

async function loadThreads(sort: "recommended" | "new"): Promise<ThreadData[]> {
  const res = await fetch(`/api/threads?sort=${sort}`, { cache: "no-store" });
  const data = await res.json().catch(() => ({ threads: [] }));
  return data.threads || [];
}

export default function ThreadsPage({ searchParams }: { searchParams: { sort?: string } }) {
  const sortParam = (searchParams?.sort === "new" ? "new" : "recommended") as "recommended" | "new";
  const [threads, setThreads] = useState<ThreadData[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setThreads([]);
    setPage(1);
    setHasMore(true);
  }, [sortParam]);

  useEffect(() => {
    let cancelled = false;
    const fetchPage = async () => {
      const items = await loadThreads(sortParam);
      if (cancelled) return;
      setThreads(prev => (page === 1 ? items : [...prev, ...items]));
      setHasMore(items.length > 0);
    };
    fetchPage();
    return () => { cancelled = true; };
  }, [sortParam, page]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const el = loaderRef.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore) {
          setPage(p => p + 1);
        }
      });
    });
    io.observe(el);
    return () => { io.disconnect(); };
  }, [hasMore]);

  const handleDeleted = (id: number) => {
    setThreads(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdated = (id: number, content: string) => {
    setThreads(prev => prev.map(t => (t.id === id ? { ...t, content } : t)));
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">社群論壇</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/threads?sort=recommended" className={`px-3 py-1 rounded-md border ${sortParam === "recommended" ? "bg-cyan-600 text-white border-cyan-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>推薦</Link>
          <Link href="/threads?sort=new" className={`px-3 py-1 rounded-md border ${sortParam === "new" ? "bg-cyan-600 text-white border-cyan-600" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}>最新</Link>
        </div>
      </div>

      <NewThreadForm onCreated={() => { setPage(1); }} />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {threads.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">暫無貼文</div>
        ) : (
          threads.map((t) => (
            <ThreadCard key={t.id} thread={t} onDeleted={handleDeleted} onUpdated={handleUpdated} />
          ))
        )}
        <div ref={loaderRef} className="h-10" />
      </div>
    </div>
  );
}