"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { beforeAfterData } from "./data";
import ThreadsContainer from "./threads-container";

function ResumeProblemSection() {
  const issues = beforeAfterData.before.issues;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="w-full h-full flex items-center justify-center"
    >
      {/* Resume Image with Overlay */}
      <div className="relative w-full max-w-lg h-full max-h-[500px] lg:max-h-none">
        {/* Resume Image with Issues Overlay */}
        <div className="relative rounded-xl overflow-hidden h-full min-h-[300px] lg:min-h-0">
          <Image 
            src="/images/bad-resume.png" 
            alt="傳統履歷範例" 
            fill
            className="object-cover"
          />
          
          {/* Issues Overlay */}
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-3">
                常見問題
              </h3>
              <div className="space-y-2 max-h-48">
                {issues.map((issue, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-2"
                  >
                    <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 bg-red-100 dark:bg-red-900/30">
                      <X className="w-2.5 h-2.5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-md text-white leading-relaxed">
                      {issue}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BeforeSection() {
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
              你也有這些困擾嗎？
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              看看社群中大家對履歷問題的真實心聲，這些痛點是否也困擾著你？
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Resume Problem Section - 移到左邊 */}
          <div className="flex justify-center h-full min-h-[400px] lg:min-h-0">
            <ResumeProblemSection />
          </div>

          {/* Threads Container - 移到右邊 */}
          <ThreadsContainer />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
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