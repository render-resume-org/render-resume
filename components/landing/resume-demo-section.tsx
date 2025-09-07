"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { beforeAfterData } from "./data";

function ResumeOptimizedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <Image 
          src="/images/standard-resume-remo.png" 
          alt="優化後履歷範例" 
          width={400}
          height={600}
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

function HighlightsSection() {
  const highlights = beforeAfterData.after.highlights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="space-y-4">
        {highlights.map((highlight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="flex items-start space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-green-100 dark:bg-green-900/30">
              <Check className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {highlight}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ResumeDemoSection() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              AI 優化的絕佳效果
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              煥然一新的履歷，讓你在茫茫人海中脫穎而出
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 items-center">
          {/* Resume Image Section - 左邊 */}
          <ResumeOptimizedSection />

          {/* Highlights Section - 右邊 */}
          <HighlightsSection />
        </div>
      </div>
    </section>
  );
}
