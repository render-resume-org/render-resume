"use client";

import { Avatar } from "@/components/ui/avatar";
import { Heart, MessageCircle, MoreHorizontal, Repeat, Send } from "lucide-react";
import Image from "next/image";

interface ThreadsPostProps {
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
  reposts: number;
  shares: number;
  isThread?: boolean;
  isLastInThread?: boolean;
  isReply?: boolean;
  replyTo?: string;
}

export default function ThreadsPost({
  author,
  content,
  timestamp,
  likes,
  replies,
  reposts,
  shares,
  isReply = false,
  replyTo
}: ThreadsPostProps) {
  return (
    <div className="relative w-full">
      <div className="flex space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          <Avatar className="w-10 h-10">
            <Image 
              src='/images/default-avatar.jpg' 
              alt={author.name} 
              fill
              className="object-cover rounded-full" 
            />
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {author.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              @{author.handle}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              ·
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {timestamp}
            </span>
            <div className="ml-auto">
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reply indicator */}
          {isReply && replyTo && (
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              回覆 @{replyTo}
            </div>
          )}

          {/* Post content */}
          <p className="text-gray-900 dark:text-white text-sm leading-relaxed mb-3">
            {content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-2 hover:text-red-500 transition-colors duration-200 group">
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs">{likes}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors duration-200 group">
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs">{replies}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-green-500 transition-colors duration-200 group">
                <Repeat className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs">{reposts}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 group">
                <Send className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-xs">{shares}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 