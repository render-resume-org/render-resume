"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

export type ThreadsTabValue = "recommended" | "new";

interface ThreadsTabsProps {
  active: ThreadsTabValue;
  className?: string;
}

export default function ThreadsTabs({ active, className }: ThreadsTabsProps) {
  return (
    <motion.div
      className={cn("flex items-center justify-center", className)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="bg-[#f8fafb] dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1"
        role="tablist"
        aria-label="Threads tabs"
      >
        <div className="flex gap-2">
          <Link
            role="tab"
            aria-selected={active === "recommended"}
            href="/threads?sort=recommended"
            className={cn(
              "px-8 py-2 rounded-xl text-sm transition-all",
              active === "recommended"
                ? "bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-semibold shadow"
                : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            精選
          </Link>
          <Link
            role="tab"
            aria-selected={active === "new"}
            href="/threads?sort=new"
            className={cn(
              "px-8 py-2 rounded-xl text-sm transition-all",
              active === "new"
                ? "bg-cyan-50 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 font-semibold shadow"
                : "bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            最新
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


