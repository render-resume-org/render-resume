"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { coreFeatures } from "./data";
import FeatureCard from "./feature-card";

interface FeatureCarouselProps {
  className?: string;
}

export default function FeatureCarousel({ className }: FeatureCarouselProps) {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const handlePrevious = () => {
    setActiveFeatureIndex((prev) => 
      prev === 0 ? coreFeatures.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveFeatureIndex((prev) => 
      prev === coreFeatures.length - 1 ? 0 : prev + 1
    );
  };

  const handleCardClick = (index: number) => {
    setActiveFeatureIndex(index);
  };

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      viewport={{ once: true }}
    >
      {/* Cards Container */}
      <div className="relative h-[700px] flex items-center justify-center overflow-visible">
        {coreFeatures.map((feature, index) => {
          const isActive = index === activeFeatureIndex;
          
          // Calculate position based on distance from active card
          const distance = index - activeFeatureIndex;
          let transformX = 0;
          let scale = 1;
          let zIndex = 10;

          if (isActive) {
            // Active card - center, full size
            transformX = 0;
            scale = 1;
            zIndex = 30;
          } else {
            // Background cards - positioned to sides
            if (distance === -1) {
              // Left adjacent card
              transformX = -140;
              scale = 0.85;
              zIndex = 20;
            } else if (distance === 1) {
              // Right adjacent card
              transformX = 140;
              scale = 0.85;
              zIndex = 20;
            } else if (distance === -2) {
              // Further left card
              transformX = -280;
              scale = 0.7;
              zIndex = 10;
            } else if (distance === 2) {
              // Further right card
              transformX = 280;
              scale = 0.7;
              zIndex = 10;
            } else {
              // Other cards - even more distant
              const direction = distance > 0 ? 1 : -1;
              transformX = direction * (420 + Math.abs(distance) * 50);
              scale = 0.6;
              zIndex = 5;
            }
          }

          return (
            <motion.div
              key={feature.id}
              initial={false}
              animate={{ 
                x: transformX,
                scale: scale,
                zIndex: zIndex
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 80,
                damping: 25
              }}
              className="absolute cursor-pointer"
              onClick={() => handleCardClick(index)}
            >
              <FeatureCard
                feature={feature}
                isActive={isActive}
                onClick={() => handleCardClick(index)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-center mt-2 space-x-6">
        <motion.button
          onClick={handlePrevious}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600"
          aria-label="Previous feature"
        >
          <ChevronLeft className="w-7 h-7 text-gray-600 dark:text-gray-300" />
        </motion.button>
        
        <motion.button
          onClick={handleNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600"
          aria-label="Next feature"
        >
          <ChevronRight className="w-7 h-7 text-gray-600 dark:text-gray-300" />
        </motion.button>
      </div>
    </motion.div>
  );
} 