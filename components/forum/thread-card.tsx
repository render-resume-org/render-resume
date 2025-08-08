"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Check, Eye, Heart, MessageCircle, Pencil, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export interface ThreadData {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  parent_thread_id: number | null;
  likes_count?: number;
  comments_count?: number;
  views: number;
  is_liked_by_me?: boolean;
  is_pending?: boolean;
  author?: {
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface ThreadCardProps {
  thread: ThreadData;
  isComment?: boolean;
  onLikedChanged?: (liked: boolean) => void;
  onDeleted?: (id: number) => void;
  onUpdated?: (id: number, content: string) => void;
}

export default function ThreadCard({ thread, isComment = false, onLikedChanged, onDeleted, onUpdated }: ThreadCardProps) {
  const [pending, startTransition] = useTransition();
  const [likes, setLikes] = useState(thread.likes_count || 0);
  const [liked, setLiked] = useState(!!thread.is_liked_by_me);
  const { user } = useAuth();
  const isOwner = user?.id === thread.user_id;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(thread.content);
  const [openConfirm, setOpenConfirm] = useState(false);

  const disabled = pending || !!thread.is_pending;

  const handleToggleLike = async () => {
    if (disabled) return;
    // optimistic
    const nextLiked = !liked;
    const nextLikes = likes + (nextLiked ? 1 : -1);
    setLiked(nextLiked);
    setLikes(Math.max(0, nextLikes));
    onLikedChanged?.(nextLiked);

    startTransition(async () => {
      try {
        const res = await fetch(`/api/threads/${thread.id}/like`, { method: "POST", cache: "no-store" });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // reconcile with server
        setLiked(data.liked);
        setLikes(data.likes_count);
      } catch {
        // rollback
        setLiked(liked);
        setLikes(likes);
      }
    });
  };

  const confirmDelete = async () => {
    const prev = thread.content;
    onDeleted?.(thread.id);
    try {
      const res = await fetch(`/api/threads/${thread.id}/delete`, { method: "DELETE", cache: "no-store" });
      if (!res.ok) throw new Error();
      toast.success("已刪除貼文");
    } catch {
      toast.error("刪除失敗");
      onUpdated?.(thread.id, prev);
    } finally {
      setOpenConfirm(false);
    }
  };

  const handleStartEdit = () => {
    if (disabled) return;
    setEditValue(thread.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(thread.content);
  };

  const handleSaveEdit = async () => {
    if (disabled) return;
    const newContent = editValue.trim();
    if (!newContent) return;
    onUpdated?.(thread.id, newContent);
    setIsEditing(false);
    try {
      const res = await fetch(`/api/threads/${thread.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error();
      toast.success("已更新貼文");
    } catch {
      toast.error("更新失敗");
      onUpdated?.(thread.id, thread.content);
    }
  };

  return (
    <div className={`w-full ${isComment ? "pl-10" : ""}`} role="article" aria-label="thread-card" aria-busy={disabled}>
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
            {thread.is_pending && (
              <span className="ml-2 inline-flex items-center gap-2 text-xs text-gray-400">
                <span className="w-3 h-3 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin" />
                發佈中...
              </span>
            )}
            {isOwner && !isComment && (
              <div className="ml-auto flex items-center gap-2 text-gray-400">
                {!isEditing ? (
                  <>
                    <button onClick={handleStartEdit} disabled={disabled} className={`hover:text-cyan-600 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} title="編輯"><Pencil className="w-4 h-4" /></button>
                    <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
                      <AlertDialogTrigger asChild>
                        <button disabled={disabled} className={`hover:text-red-600 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} title="刪除"><Trash2 className="w-4 h-4" /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>刪除貼文</AlertDialogTitle>
                          <AlertDialogDescription>
                            確定要刪除此貼文嗎？此操作無法復原。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>取消</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">刪除</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  <>
                    <button onClick={handleSaveEdit} disabled={disabled} className={`text-cyan-600 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} title="儲存"><Check className="w-4 h-4" /></button>
                    <button onClick={handleCancelEdit} className="hover:text-gray-600" title="取消"><X className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            )}
          </div>
          {!isEditing ? (
            <p className="text-gray-900 dark:text-gray-100 text-[0.95rem] leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          ) : (
            <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} />
          )}

          {!isEditing && (
            <div className="mt-3 flex items-center gap-4 text-gray-500 dark:text-gray-400">
              <button
                onClick={handleToggleLike}
                disabled={disabled}
                aria-busy={disabled}
                className={`inline-flex items-center gap-1.5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors ${liked ? "text-cyan-600 dark:text-cyan-400" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm">{likes}</span>
              </button>
              <Link href={`/threads/${thread.id}`} className={`inline-flex items-center gap-1.5 transition-colors ${disabled ? "pointer-events-none opacity-50" : "hover:text-cyan-600 dark:hover:text-cyan-400"}`}>
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