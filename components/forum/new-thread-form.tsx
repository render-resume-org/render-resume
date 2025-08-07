"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface NewThreadFormProps {
  onCreated?: () => void;
}

export default function NewThreadForm({ onCreated }: NewThreadFormProps) {
  const [content, setContent] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("請輸入內容");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/threads", {
          cache: "no-store",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data.error || "發佈失敗");
          return;
        }
        setContent("");
        toast.success("已發佈");
        onCreated?.();
      } catch {
        toast.error("發佈失敗");
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的求職經驗、履歷問題或面試心得..."
        className="min-h-[6rem]"
      />
      <div className="mt-3 flex justify-end">
        <Button onClick={handleSubmit} disabled={pending} className="bg-cyan-600 hover:bg-cyan-700">
          發佈
        </Button>
      </div>
    </div>
  );
}