"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { threadsPosts } from "../lib/landing-content";

interface BubblePostProps {
  post: typeof threadsPosts[0];
  index: number;
}

function BubblePost({ post, index }: BubblePostProps) {
  const position = post.position || { top: '50%', left: '50%', rotate: 0 };

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

export default function PainPointsSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              你也有這些困擾嗎？
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              看看社群中大家對履歷問題的真實心聲，這些痛點是否也困擾著你？
            </p>
          </motion.div>
        </div>
        
        {/* Bubble Threads */}
        <div className="relative h-[600px] sm:h-[700px] lg:h-[750px]">
          {threadsPosts.map((post, index) => (
            <BubblePost key={index} post={post} index={index} />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link 
            href="#teaser-video"
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('teaser-video');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-block"
          >
            <p className="text-lg text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-300 cursor-pointer border-b border-cyan-600 dark:border-cyan-400 pb-0.5">
              我也有一樣的問題！該怎麼辦？！
            </p>
          </Link>
        </motion.div>
      </div>
    </section>
  );
} 