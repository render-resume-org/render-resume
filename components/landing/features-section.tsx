"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FeaturesSection() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI (avoid hydration mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which image to show based on theme
  const getResultsImageSrc = () => {
    if (!mounted) return "/images/results-light.png"; // Default to light theme during SSR
    
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" ? "/images/results-dark.png" : "/images/results-light.png";
  };

  const getEditorImageSrc = () => {
    if (!mounted) return "/images/editor-light.png"; // Default to light theme during SSR
    
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" ? "/images/editor-dark.png" : "/images/editor-light.png";
  };

  return (
    <section id="teaser-video" className="py-24 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
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
              由最前沿的 AI 技術驅動，讓履歷分析更智能、更專業！創造前所未有的履歷優化流程
            </p>
          </motion.div>
        </div>

        {/* evaluate feature demo */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 items-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Left side - Text content */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              深度分析履歷競爭力
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              對比 Fortune 500 企業錄取標準，客觀分析履歷的競爭力。讓你清楚了解當前履歷的優劣勢，並明確掌握改進方向。
            </p>
          </div>

          {/* Right side - Image */}
          <div className="md:col-span-2 flex justify-center">
            <Card className="p-0 overflow-hidden border-0 shadow-2xl w-full max-w-none">
              <Image
                src={getResultsImageSrc()}
                alt="履歷評估功能示範"
                width={1600}
                height={1200}
                className="w-full h-auto object-cover"
                priority
              />
            </Card>
          </div>
        </motion.div>

        {/* editor feature demo */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 items-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Left side - Image */}
          <div className="md:col-span-2 flex justify-center">
            <Card className="p-0 overflow-hidden border-0 shadow-2xl w-full max-w-none">
              <Image
                src={getEditorImageSrc()}
                alt="履歷編輯功能示範"
                width={1600}
                height={1200}
                className="w-full h-auto object-cover"
                priority
              />
            </Card>
          </div>

          {/* Right side - Text content */}
          <div className="md:col-span-1">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              即時提問，即時編輯
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              AI 履歷顧問提供以對話的方式引導你逐步優化履歷。根據你的需求提供具體的修改建議，同時讓你掌控編輯節奏。
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
} 