"use client";

import { useEffect } from "react";

export default function ViewsTracker({ threadId }: { threadId: string }) {
  useEffect(() => {
    fetch(`/api/threads/${threadId}/views`, { method: "POST", cache: "no-store" }).catch(() => {});
  }, [threadId]);
  return null;
}