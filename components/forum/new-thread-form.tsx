"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ThreadData } from "./thread-card";

interface NewThreadFormProps {
  onCreated?: (e: { clientId: number; state: "created" | "success" | "error"; temp?: ThreadData; serverThread?: Partial<ThreadData> & { id: number } }) => void;
  variant?: "standalone" | "inset";
}

export default function NewThreadForm({ onCreated, variant = "standalone" }: NewThreadFormProps) {
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();
  const { user } = useAuth();

  const handleSubmit = () => {
    const text = content.trim();
    if (!text) {
      toast.error("請輸入內容");
      return;
    }
    const clientId = Date.now();
    // optimistic temp
    const temp: ThreadData = {
      id: clientId,
      user_id: user?.id || "me",
      content: text,
      created_at: new Date().toISOString(),
      parent_thread_id: null,
      likes_count: 0,
      comments_count: 0,
      views: 0,
      is_pending: true,
      author: user ? { display_name: user.display_name || user.email || "", avatar_url: user.avatar_url || null } : undefined,
    } as ThreadData;
    onCreated?.({ clientId, state: "created", temp });

    startTransition(async () => {
      try {
        const res = await fetch("/api/threads", {
          cache: "no-store",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: text }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || "發佈失敗");
          onCreated?.({ clientId, state: "error" });
          return;
        }
        const payload = await res.json().catch(() => null);
        const serverThread = payload?.thread as (Partial<ThreadData> & { id: number }) | undefined;
        setContent("");
        toast.success("已發佈");
        onCreated?.({ clientId, state: "success", serverThread });
      } catch {
        toast.error("發佈失敗");
        onCreated?.({ clientId, state: "error" });
      }
    });
  };

  const outerClass =
    variant === "inset"
      ? "bg-transparent border-0 rounded-none shadow-none"
      : "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 shadow-sm backdrop-blur-sm";
  const innerClass =
    variant === "inset"
      ? "p-4 sm:p-5 border-b border-gray-200 dark:border-gray-800"
      : "p-4 sm:p-5";

  return (
    <div className={outerClass}>
      <div className={innerClass}>
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="w-10 h-10 sm:w-11 sm:h-11">
            <Image
              src={user?.avatar_url || "/images/default-avatar.jpg"}
              alt={user?.display_name || user?.email || "user"}
              width={44}
              height={44}
              className="rounded-full object-cover w-11 h-11"
            />
          </Avatar>
          <div className="flex-1 min-w-0">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的求職經驗、履歷問題或面試心得..."
              className="min-h-[5.5rem] bg-transparent"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{content.trim().length}/1000</span>
              <Button onClick={handleSubmit} disabled={pending} aria-busy={pending} className="bg-cyan-600 hover:bg-cyan-700">
                {pending ? "發佈中..." : "發佈"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}