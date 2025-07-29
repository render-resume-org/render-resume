"use client";

import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/ui/countdown-timer";
import { ScrollText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroSectionProps {
  stats: Array<{
    number: string;
    label: string;
  }>;
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900" itemScope itemType="https://schema.org/WebApplication">

      <div className="relative container mx-auto px-4 py-8 sm:py-24 md:py-16 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center flex-col md:flex-row justify-center gap-8">
            <div className="flex justify-center items-center">
              <div className="h-32 w-32 p-4 rounded-full flex items-center justify-center">
                <Image 
                  src="/images/logo-transparent.png"
                  alt="RenderResume Logo"
                  width={1024}
                  height={1024}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center gap-6">
              <h1 className="text-nowrap text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white" itemProp="name">
                讓 AI 為您打造
                <span className="text-cyan-600 dark:text-cyan-400">
                  專業履歷
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto italic" itemProp="description">
                RenderResume 幫您在最短時間呈現最大價值，找到理想工作
              </p>
            </div>
          </div>

          <CountdownTimer />
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto" itemScope itemType="https://schema.org/ItemList">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" itemScope itemType="https://schema.org/Statistic">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400" itemProp="value">
                  {stat.number}
                </div>
                <div className="text-md text-gray-600 dark:text-gray-300" itemProp="name">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105" itemProp="potentialAction" itemScope itemType="https://schema.org/Action">
                <span itemProp="name">加入 Waitlist 搶先體驗</span>
                <ScrollText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 