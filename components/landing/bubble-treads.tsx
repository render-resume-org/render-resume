"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import Image from "next/image";
import { threadsPosts } from "./data";

interface BubblePostProps {
  post: typeof threadsPosts[0];
  index: number;
}

function BubblePost({ post, index }: BubblePostProps) {
  // 為每個貼文定義不同的位置和大小
  const positions: Array<{
    top: string;
    left: string;
    rotate: number;
  }> = [
    { top: '5%', left: '5%', rotate: -4 },      // 小雅
    { top: '20%', left: '66%', rotate: 3 },     // 阿哲
    { top: '35%', left: '5%', rotate: 2 },     // 大貓
    { top: '5%', left: '35%', rotate: 3 },     // 阿傑
    { top: '60%', left: '61%', rotate: -3 },   // 小卡
    { top: '70%', left: '20%', rotate: -2 },     // 阿明
    { top: '28%', left: '39%', rotate: -3 },   // 小美
    { top: '50%', left: '32%', rotate: 1 }      // 大雄
  ];

  const position = positions[index] || { top: '50%', left: '50%', rotate: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      whileInView={{ 
        opacity: 1, 
        scale: 1, 
        rotate: position.rotate 
      }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        zIndex: 10
      }}
      className="absolute w-72 sm:w-80"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        {/* 用戶頭像和暱稱 */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="relative">
            <Image
              src="/images/default-avatar.jpg"
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {post.author.name}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                @{post.author.handle}
              </span>
            </div>
          </div>
        </div>

        {/* 貼文內容 */}
        <div className="mb-4">
          <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>

        {/* 互動按鈕 */}
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1 hover:text-red-500 transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
            <span className="text-xs">{post.likes}</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{post.replies}</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-green-500 transition-colors cursor-pointer">
            <Repeat2 className="w-4 h-4" />
            <span className="text-xs">{post.reposts}</span>
          </div>
          <div className="flex items-center space-x-1 hover:text-blue-500 transition-colors cursor-pointer">
            <Share className="w-4 h-4" />
            <span className="text-xs">{post.shares}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BubbleTreads() {
  return (
    <section className="overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* 散落的貼文氣泡 */}
        <div className="relative h-[600px] sm:h-[700px] lg:h-[750px]">
          {threadsPosts.map((post, index) => (
            <BubblePost key={index} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
