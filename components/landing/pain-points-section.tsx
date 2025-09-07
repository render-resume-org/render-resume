"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import BubbleTreads from "./bubble-treads";


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
        
        {/* Bubble Treads */}
        <BubbleTreads />
        
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