"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which image to show based on theme
  const getImageSrc = () => {
    if (!mounted) return "/images/editor-light.png"; // Default to light theme during SSR
    
    const currentTheme = resolvedTheme || theme;
    return currentTheme === "dark" ? "/images/editor-dark.png" : "/images/editor-light.png";
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800 w-full py-16 sm:py-24 text-center" itemScope itemType="https://schema.org/WebApplication">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title & Slogan */}
        <div className="flex flex-col justify-center items-center gap-6 mb-12">
          <h1 className="text-nowrap text-6xl lg:text-7xl font-bold tracking-tight text-white" itemProp="name">
            AI 履歷編輯器
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto" itemProp="description">
            讓你獲得頂尖的履歷撰寫能力，取得更多工作機會。
          </p>
        </div>

        {/* Primary Button */}
        <div className="flex justify-center">
          <Link href="/auth/sign-up">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-6 py-6 text-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-105" itemProp="potentialAction" itemScope itemType="https://schema.org/Action">
              <span itemProp="name">立即建立履歷 - 免費！</span>
            </Button>
          </Link>
        </div>

        {/* Primary Image Component */}
        <div className="flex justify-center mt-16">
          <Card className="p-0 overflow-hidden border-0 shadow-2xl max-w-6xl w-full">
            <Image
              src={getImageSrc()}
              alt="RenderResume 編輯器預覽"
              width={1600}
              height={1200}
              className="w-full h-auto object-cover"
              priority
            />
          </Card>
        </div>
      </div>
    </section>
  );
} 