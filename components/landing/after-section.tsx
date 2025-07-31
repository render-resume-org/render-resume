"use client";

import { FullscreenImagePreview } from "@/components/upload/uploaded-files-list";
import { motion } from "framer-motion";
import { Check, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { beforeAfterData } from "./data";

function ResumeOptimizedSection() {
  const [showPreview, setShowPreview] = useState(false);

  const handleOpenPreview = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full h-full flex items-center justify-center"
    >
      {/* Resume Image */}
      <div className="relative w-full max-w-lg">
        {/* Resume Image */}
        <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg group cursor-pointer" onClick={handleOpenPreview}>
          <Image 
            src="/images/stephanie-resume.png" 
            alt="優化後履歷範例" 
            width={400}
            height={600}
            className="w-full h-auto object-contain"
          />
          {/* Overlay with view icon */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-800/90 rounded-full p-3 shadow-lg">
              <Eye className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showPreview && (
        <FullscreenImagePreview
          images={["/images/stephanie-resume.png"]}
          index={0}
          onClose={handleClosePreview}
          onPrev={() => {}}
          onNext={() => {}}
        />
      )}
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
      className="w-full h-full flex items-center justify-center"
    >
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">



        </div>

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
      </div>
    </motion.div>
  );
}

export default function AfterSection() {
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
              看看 AI 優化的神奇效果
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              經過 RenderResume 優化後，你的履歷將煥然一新，讓 HR 一眼就看見你的價值
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Resume Image Section - 左邊 */}
          <div className="flex justify-center h-full min-h-[400px] lg:min-h-0">
            <ResumeOptimizedSection />
          </div>

          {/* Highlights Section - 右邊 */}
          <div className="flex justify-center h-full min-h-[400px] lg:min-h-0">
            <HighlightsSection />
          </div>
        </div>
      </div>
    </section>
  );
} 