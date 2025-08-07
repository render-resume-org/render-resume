"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import React from "react";

export interface ThreadData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  parent_thread_id: number | null;
  likes_count: number;
  comments_count: number;
  views: number;
  is_liked_by_me?: boolean;
  author?: {
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface ThreadCardProps {
  thread: ThreadData;
  isComment?: boolean;
  onLikedChanged?: (liked: boolean) => void;
}

export default function ThreadCard({ thread, isComment = false, onLikedChanged }: ThreadCardProps) {
  const [pending, startTransition] = useTransition();
  const [likes, setLikes] = useState(thread.likes_count || 0);
  const [liked, setLiked] = useState(!!thread.is_liked_by_me);

  const handleToggleLike = async () => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/threads/${thread.id}/like`, { method: "POST", cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setLiked(data.liked);
        setLikes(data.likes_count);
        onLikedChanged?.(data.liked);
      } catch {
        // noop
      }
    });
  };

  return (
    <div className={`w-full ${isComment ? "pl-10" : ""}`} role="article" aria-label="thread-card">
      <div className="flex space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
        <div className="flex-shrink-0 relative">
          <Avatar className="w-10 h-10">
            <Image 
              src={thread.author?.avatar_url || "/images/default-avatar.jpg"}
              alt={thread.author?.display_name || "user"}
              width={40}
              height={40}
              className="object-cover rounded-full w-10 h-10"
            />
          </Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {thread.author?.display_name || "匿名用戶"}
            </span>
            <span className="text-gray-400 text-xs">·</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {new Date(thread.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-gray-900 dark:text-gray-100 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </p>
          {!isComment && (
            <div className="mt-3 flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <button
                onClick={handleToggleLike}
                disabled={pending}
                className={`inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${liked ? "text-cyan-600 dark:text-cyan-400" : ""}`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm">{likes}</span>
              </button>
              <Link href={`/threads/${thread.id}`} className="inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{thread.comments_count || 0}</span>
              </Link>
              <div className="inline-flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{thread.views || 0}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}