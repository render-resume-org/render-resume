"use client";

import { PartyPopper } from "lucide-react";

export default function CelebrationBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border-b border-cyan-200 dark:border-cyan-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-6 w-6 text-cyan-600 dark:text-cyan-400 animate-bounce" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              150+ 人已加入 Waitlist
            </span>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            感謝大家的支持！我們正在努力為您打造最佳的 AI 履歷優化體驗
          </p>
        </div>
      </div>
    </section>
  );
} 