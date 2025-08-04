"use client";

import { motion } from "framer-motion";

export default function FeaturesSection() {
  return (
    <section id="teaser-video" className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              核心功能介紹
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI 技術驅動，讓履歷分析更智能、更專業！體驗前所未有的履歷優化流程
            </p>
          </motion.div>
        </div>

        {/* YouTube Embed */}
        <motion.div 
          className="max-w-5xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/UKV6sOK44UM?rel=0&modestbranding=1&showinfo=0&autoplay=1&mute=1"
              title="Render Resume 核心功能介紹"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Feature Cards Carousel */}
        {/* <FeatureCarousel /> */}
      </div>
    </section>
  );
} 