"use client";

// 關鍵！禁用靜態生成，因為 layout 包含 Supabase 相關組件
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Brain,
    CheckCircle,
    Eye,
    FileText,
    MessageSquare,
    ScrollText,
    Shield,
    Star,
    Target,
    TrendingUp,
    Upload,
    Zap
} from "lucide-react";
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

  const keyFeatures = [
    {
      icon: Brain,
      title: "AI 智能解析",
      description: "基於 Fortune 500 企業標準，採用國際頂級獵頭公司六維度評估模型",
      highlights: ["STAR 原則分析", "多元資料整合", "深度內容提取"]
    },
    {
      icon: Star,
      title: "STAR 原則架構",
      description: "採用國際認可的 STAR 方法論，系統性重組您的工作經歷與成就",
      highlights: ["Situation: 情境描述", "Task: 任務界定", "Action: 行動策略", "Result: 成果量化"]
    },
    {
      icon: Target,
      title: "個性化優化建議",
      description: "Chain of Thought 推理提供具體可執行的改進方案",
      highlights: ["STAR 方法重組", "技術亮點突出", "量化成果展示"]
    },
    {
      icon: Shield,
      title: "專業權威認證",
      description: "15年人才評估經驗，對標國際標準的履歷分析框架",
      highlights: ["頂級 HR 標準", "業界基準對齊", "建設性導向"]
    }
  ];

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

          <div id="grading-levels" className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                等第制評分系統
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                我們採用等第制評分，從 F 級到 A+ 級共 11 個層次，
                為您的履歷提供精確的專業評估。
              </p>
              <div className="text-center">
                <Link href="/help">
                  <Button variant="link" className="">
                    📊 查看詳細評分說明
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              系統核心亮點
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              領先業界的 AI 技術，為您提供最專業的履歷分析服務
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <feature.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {feature.description}
                    </p>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* How it works */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              如何運作
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              簡單六步驟，獲得專業級履歷分析與優化建議
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "註冊帳戶",
                  description: "創建免費帳戶，開始您的 AI 履歷生成之旅",
                  icon: FileText
                },
                {
                  step: "02",
                  title: "上傳作品",
                  description: "拖拽上傳作品說明文件、截圖或簡短文字說明",
                  icon: Upload
                },
                {
                  step: "03", 
                  title: "AI智能解析",
                  description: "AI 自動分析您的作品內容，採用 STAR 原則識別技能和成就",
                  icon: Brain
                },
                {
                  step: "04",
                  title: "六維度評分",
                  description: "基於國際標準進行六維度專業評估，提供 A+ 到 F 的等第制評分",
                  icon: BarChart3
                },
                {
                  step: "05",
                  title: "智慧問答與優化",
                  description: "AI 問答收集補充信息，並提供個性化優化建議",
                  icon: MessageSquare
                },
                {
                  step: "06",
                  title: "預覽下載",
                  description: "預覽最終結果，下載專業的履歷和作品集",
                  icon: Eye
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-cyan-600 text-white rounded-full font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <item.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
