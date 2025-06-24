"use client";

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Brain,
  MessageSquare,
  ScrollText,
  Star,
  TrendingUp,
  Upload,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

// Structured data for the homepage
const homepageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "RenderResume - AI 履歷生成器",
  "description": "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構。",
  "url": typeof window !== 'undefined' ? window.location.origin : '',
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Any",
  "browserRequirements": "Modern web browser with JavaScript support",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01"
  },
  "creator": {
    "@type": "Organization",
    "name": "RenderResume Team"
  },
  "featureList": [
    "AI 智能履歷分析",
    "六維度專業評分",
    "STAR 原則架構",
    "個性化優化建議",
    "Fortune 500 企業標準",
    "多語言支援"
  ],
  "screenshot": [
    {
      "@type": "ImageObject",
      "url": "/screenshot-desktop.png",
      "caption": "RenderResume 桌面版介面"
    },
    {
      "@type": "ImageObject", 
      "url": "/screenshot-mobile.png",
      "caption": "RenderResume 手機版介面"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "10000",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export default function Home() {
  // Add structured data to page
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(homepageStructuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const stats = [
    { number: "10,000+", label: "履歷生成數量" },
    { number: "95%", label: "用戶滿意度" },
    { number: "3分鐘", label: "平均生成時間" }
  ];

  const scoreCategories = [
    {
      icon: "💻",
      name: "技術深度與廣度",
      description: "評估技術棧掌握程度、架構設計能力與創新突破",
      weight: "25%"
    },
    {
      icon: "🚀", 
      name: "項目複雜度與影響力",
      description: "分析項目規模、技術挑戰與可量化的商業成果",
      weight: "25%"
    },
    {
      icon: "💼",
      name: "專業經驗完整度", 
      description: "評估職涯發展軌跡、領導能力與管理經驗",
      weight: "20%"
    },
    {
      icon: "🎓",
      name: "教育背景匹配度",
      description: "分析學歷與專業相關性、持續學習能力",
      weight: "15%"
    },
    {
      icon: "🏆",
      name: "成果與驗證",
      description: "識別專業成就、外部認可與量化影響力",
      weight: "10%"
    },
    {
      icon: "✨",
      name: "整體專業形象",
      description: "評估履歷呈現、溝通能力與個人品牌",
      weight: "5%"
    }
  ];

  // Core features data
  const coreFeatures = [
    {
      id: 1,
      icon: Brain,
      title: "AI 智能解析",
      subtitle: "上傳即分析，深度挖掘職涯亮點！",
      description: [
        "還在為如何展現自己的專業能力煩惱嗎？上傳履歷、作品集甚至專案報告書，",
        "AI 馬上為你深度分析技術、項目複雜度和職業成就，給你最專業的履歷優化建議！",
        "不論是技術項目還是管理經驗，瞬間變身履歷達人！"
      ],
      imageSrc: "/images/analyze.png",
      imageAlt: "AI 智能解析界面展示",
      layout: "imageRight"
    },
    {
      id: 2,
      icon: Upload,
      title: "智能辨識結果",
      subtitle: "精準識別，自動分類專業技能！",
      description: [
        "上傳文件後不知道 AI 看懂了什麼？別擔心！",
        "系統會清楚展示辨識結果，讓你看到 AI 如何理解你的專業背景，",
        "從技術棧到項目成果，每個細節都透明呈現，確保分析準確無誤！"
      ],
      imageSrc: "/images/recognize.png",
      imageAlt: "智能辨識結果展示",
      layout: "imageLeft"
    },
    {
      id: 3,
      icon: BarChart3,
      title: "六維度專業評分",
      subtitle: "深度分析，精準定位職場競爭力！",
      description: [
        "想知道自己的履歷在 HR 眼中到底幾分嗎？不用再猜測了！",
        "基於 Fortune 500 企業標準，從技術深度、項目影響力、專業經驗等六維度評分，",
        "A+ 到 F 的等第評分，讓你清楚知道改進方向，精準提升競爭力！"
      ],
      imageSrc: "/images/grade.png",
      imageAlt: "六維度評分雷達圖展示",
      layout: "imageRight"
    },
    {
      id: 4,
      icon: MessageSquare,
      title: "智能問答優化",
      subtitle: "對話互動，挖掘更多履歷亮點！",
      description: [
        "擔心遺漏了重要的經歷或技能嗎？別怕！",
        "AI 會透過智能問答，針對你的背景提出精準問題，引導你補充有價值的細節，",
        "確保每一個履歷亮點都不被埋沒！就像有專業顧問在身邊一對一指導！"
      ],
      imageSrc: "/images/chat.png",
      imageAlt: "AI 智能問答界面展示",
      layout: "imageLeft"
    },
    {
      id: 5,
      icon: Star,
      title: "STAR 原則重構",
      subtitle: "一鍵套版，高效佈局，讓經歷說話更有力！",
      description: [
        "是不是常常覺得工作經歷寫得平淡無奇，無法突出自己的價值？",
        "AI 採用國際認可的 STAR 方法論，自動將你的經歷重構為：情境描述 → 任務界定 → 行動策略 → 成果量化，",
        "一鍵套版，節省寶貴時間！讓每一段經歷都有說服力，HR 一眼就能看見你的價值！"
      ],
      imageSrc: "/images/preview.png",
      imageAlt: "STAR 原則重構展示",
      layout: "imageRight"
    },
  ];

  // Feature card component
  const FeatureCard = ({ feature }: { feature: typeof coreFeatures[0] }) => {
    const isImageRight = feature.layout === "imageRight";
    
    return (
      <div className="mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`space-y-6 ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="flex items-center space-x-3">
              <feature.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {feature.title}
              </h3>
            </div>
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {feature.subtitle}
            </h4>
            {feature.description.map((paragraph, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
          
          {/* Image Section */}
          <div className={`flex justify-center ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <Image 
                src={feature.imageSrc}
                alt={feature.imageAlt}
                width={500}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center" itemScope itemType="https://schema.org/WebApplication">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-16 w-16 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center">
                <span className="text-3xl" role="img" aria-label="sparkles">✨</span>
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>
          </div>
          
          <div className="flex w-full justify-center items-center">
            <h1 className="text-nowrap mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white" itemProp="name">
              讓 AI 為您打造
              <span className="text-cyan-600 dark:text-cyan-400">
                專業履歷
              </span>
            </h1>
          </div>
          
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" itemProp="description">
            基於 Fortune 500 企業標準的 AI 履歷分析系統，採用六維度評估模型，
            讓您的才華以最完美的方式呈現給雇主和客戶。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg" itemProp="potentialAction" itemScope itemType="https://schema.org/Action">
                <span itemProp="name">加入 Waitlist</span>
                <ScrollText className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/auth/login">
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-cyan-200 text-cyan-700 hover:bg-cyan-50 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-950">
                已有帳戶？登入
                <Eye className="ml-2 h-5 w-5" />
              </Button>
            </Link> */}
          </div>

          <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4 mb-8">
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              💎 <strong>搶先體驗：</strong>註冊即可加入 Waitlist，搶先使用基於國際標準的 AI 履歷分析系統！
            </p>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" itemScope itemType="https://schema.org/ItemList">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" itemScope itemType="https://schema.org/Statistic">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400" itemProp="value">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300" itemProp="name">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Scoring System */}
      <section className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 py-16" itemScope itemType="https://schema.org/Service">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" itemProp="name">
              六維度專業評分架構
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto" itemProp="description">
              採用國際頂級獵頭公司標準，結合 Fortune 500 企業人才評估框架，
              為您提供最專業的履歷分析與等第制評分
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto" itemScope itemType="https://schema.org/ItemList">
            {scoreCategories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow" itemScope itemType="https://schema.org/Service">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3" role="img" aria-label={category.name}>{category.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white" itemProp="name">
                      {category.name}
                    </h3>
                    <span className="text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                      權重 {category.weight}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed" itemProp="description">
                  {category.description}
                </p>
              </div>
            ))}
          </div>

         
        </div>
      </section>

     

      {/* Core Features with Images */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ✨ 核心功能介紹
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              AI 技術驅動，讓履歷分析更智能、更專業！
            </p>
          </div>

          {/* Render all features using the modular component */}
          {coreFeatures.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-600 to-blue-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              準備好體驗專業級 AI 履歷分析了嗎？
            </h2>
            <p className="text-xl mb-8 opacity-90">
              加入 Waitlist，搶先體驗基於 Fortune 500 企業標準的六維度評分系統，
              讓您的履歷在競爭中脫穎而出！
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="font-semibold">六維度評分</div>
                  <div className="text-sm opacity-80">專業權威認證</div>
                </div>
                <div>
                  <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="font-semibold">3分鐘完成</div>
                  <div className="text-sm opacity-80">AI 快速分析</div>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                  <div className="font-semibold">面試機率 +N%</div>
                  <div className="text-sm opacity-80">實證效果</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  立即加入 Waitlist
                  <ScrollText className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {/* <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white/30 text-white hover:bg-white/10">
                  已有帳戶？登入
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </Link> */}
            </div>

            <p className="text-sm mt-6 opacity-80">
              💫 註冊即表示您同意搶先體驗最新的 AI 履歷分析技術
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
