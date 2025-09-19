import { AppHeader } from "@/components/layout/app-header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

const defaultUrl = 'https://render-resume.com'

// Enhanced metadata for SEO and AI Agent Optimization
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "RenderResume - AI 履歷編輯器 | 專業履歷分析與優化平台",
    template: "%s | RenderResume - AI 履歷編輯器"
  },
  description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構，為求職者提供個性化履歷優化建議。免費註冊，3分鐘生成專業履歷。",
  
  // Keywords for AI agents and search engines
  keywords: [
    // Primary AI Resume Builder Keywords
    "AI resume builder", "AI resume generator", "AI resume maker", "AI resume creator",
    "AI-powered resume builder", "AI resume writing tool", "AI resume optimization",
    "AI resume analyzer", "AI resume scanner", "AI resume parser", "AI resume checker",
    "AI resume grader", "AI resume scorer", "AI resume evaluator", "AI resume reviewer",
    
    // AI Resume Builder Dependencies and Related Terms
    "machine learning resume", "artificial intelligence resume", "AI career tools",
    "smart resume builder", "intelligent resume maker", "automated resume creation",
    "AI job application", "AI career assistant", "AI job search tool", "AI hiring tool",
    "AI recruitment tool", "AI talent acquisition", "AI candidate screening",
    "AI resume matching", "AI job matching", "AI career optimization",
    
    // Advanced AI Resume Features
    "AI resume templates", "AI resume customization", "AI resume personalization",
    "AI resume suggestions", "AI resume recommendations", "AI resume improvements",
    "AI resume enhancement", "AI resume refinement", "AI resume editing",
    "AI resume formatting", "AI resume design", "AI resume layout",
    "AI resume structure", "AI resume content", "AI resume keywords",
    
    // AI Resume Analysis and Scoring
    "AI resume analysis", "AI resume assessment", "AI resume evaluation",
    "AI resume scoring", "AI resume rating", "AI resume grading",
    "AI resume feedback", "AI resume insights", "AI resume metrics",
    "AI resume performance", "AI resume quality", "AI resume effectiveness",
    "AI resume optimization", "AI resume improvement", "AI resume enhancement",
    
    // AI Resume Technology Stack
    "natural language processing resume", "NLP resume builder", "AI text analysis",
    "machine learning resume builder", "deep learning resume", "AI content generation",
    "AI writing assistant", "AI career coach", "AI job counselor", "AI career advisor",
    "AI professional development", "AI skill assessment", "AI competency analysis",
    
    // AI Resume Industry Applications
    "AI resume for tech jobs", "AI resume for software engineers", "AI resume for developers",
    "AI resume for data scientists", "AI resume for marketing", "AI resume for sales",
    "AI resume for finance", "AI resume for healthcare", "AI resume for education",
    "AI resume for consulting", "AI resume for startups", "AI resume for Fortune 500",
    
    // AI Resume User Experience
    "easy AI resume builder", "simple AI resume maker", "quick AI resume generator",
    "fast AI resume creator", "instant AI resume builder", "one-click AI resume",
    "automated AI resume", "smart AI resume tool", "intelligent AI resume builder",
    "user-friendly AI resume", "intuitive AI resume maker", "accessible AI resume builder",
    
    // AI Resume Benefits and Outcomes
    "AI resume success", "AI resume results", "AI resume outcomes", "AI resume impact",
    "AI resume effectiveness", "AI resume performance", "AI resume quality",
    "AI resume improvement", "AI resume enhancement", "AI resume optimization",
    "AI resume optimization", "AI resume refinement", "AI resume perfection",
    
    // Chinese/Traditional Chinese keywords
    "AI履歷生成器", "履歷優化", "CV生成", "求職工具", "STAR原則", 
    "履歷分析", "AI求職助手", "專業履歷", "履歷模板", "職涯發展",
    "懶得履歷", "懶人履歷", "懶人履歷製作", "懶人履歷產生器", "懶人履歷產生器",
    
    // 熱門中文求職關鍵字
    "線上履歷", "履歷表", "簡歷製作", "求職網站", "人力銀行", "104人力銀行",
    "1111人力銀行", "yes123", "518人力銀行", "Cake Resume", "CakeResume",
    "面試技巧", "面試準備", "面試問題", "求職面試", "工作面試", "視訊面試",
    "求職信", "自傳範例", "自傳寫法", "求職自傳", "履歷自傳",
    
    // 職場技能相關中文關鍵字
    "遠距工作", "居家辦公", "混合辦公", "WFH", "遠端工作", "在家工作",
    "數位技能", "AI技能", "資料分析", "專案管理", "領導能力", "溝通技巧",
    "團隊合作", "問題解決", "敏捷開發", "Scrum", "產品經理", "軟體工程師",
    
    // 行業相關中文關鍵字
    "科技業履歷", "金融業履歷", "行銷履歷", "業務履歷", "工程師履歷",
    "設計師履歷", "教育業履歷", "醫療業履歷", "服務業履歷", "製造業履歷",
    "新創公司", "外商公司", "台積電", "聯發科", "Google", "微軟", "Meta",
    
    // 職涯發展中文關鍵字
    "轉職", "跳槽", "職涯規劃", "職業發展", "升職", "加薪", "薪資談判",
    "職場技能", "專業證照", "證照考試", "技能提升", "職場學習", "進修",
    "職涯諮詢", "職業諮商", "獵頭", "人資", "HR", "招募", "徵才",
    
    // 現代職場中文關鍵字
    "永續發展", "ESG", "多元共融", "職場心理健康", "工作生活平衡",
    "員工福利", "企業文化", "團隊建設", "變革管理", "創新", "數位轉型",
    "自動化", "機器學習", "人工智慧", "大數據", "雲端運算", "區塊鏈",
    
    // 求職流程中文關鍵字
    "找工作", "求職", "應徵", "投履歷", "履歷投遞", "工作機會", "職缺",
    "就業", "徵才活動", "就業博覽會", "校園徵才", "實習", "工讀", "兼職",
    "正職", "約聘", "派遣", "freelance", "自由工作者", "SOHO族",
    
    // 地區相關中文關鍵字
    "台北工作", "新竹工作", "台中工作", "高雄工作", "桃園工作", "台南工作",
    "竹科工作", "南科工作", "中科工作", "內湖科技園區", "信義區工作",
    "香港工作", "澳門工作", "新加坡工作", "大陸工作", "海外工作", "外派",
    
    // 學歷與經驗中文關鍵字
    "社會新鮮人", "應屆畢業生", "新鮮人履歷", "無經驗可", "轉換跑道",
    "中高階主管", "資深工程師", "10年經驗", "5年經驗", "3年經驗",
    "碩士學歷", "博士學歷", "大學畢業", "專科畢業", "高中職", "留學",
    
    // English resume and job search keywords
    "resume builder", "CV maker", "AI career tools", "job search",
    "professional resume", "career development", "resume optimization",
    "Render Resume", "Render", 'Resume',
    
    // 2024-2025 trending job search keywords
    "ATS resume", "applicant tracking system", "resume keywords", "job application",
    "resume scanner", "ATS optimization", "resume parser", "job matching",
    "career coach", "interview preparation", "job interview tips", "resume templates",
    "cover letter generator", "LinkedIn optimization", "job board", "career advice",
    
    // Popular skill-based keywords
    "remote work", "hybrid work", "work from home", "digital skills", "AI skills",
    "data analysis", "project management", "leadership skills", "communication skills",
    "problem solving", "team collaboration", "agile methodology", "scrum master",
    
    // Industry trending keywords
    "tech resume", "software engineer resume", "marketing resume", "sales resume",
    "finance resume", "healthcare resume", "education resume", "consulting resume",
    "startup jobs", "Fortune 500", "entry level jobs", "senior positions",
    
    // Career development keywords
    "career change", "salary negotiation", "job promotion", "performance review",
    "skill assessment", "career path", "professional growth", "networking",
    "personal branding", "thought leadership", "career transition", "upskilling",
    
    // Modern workplace keywords
    "sustainability", "ESG", "diversity and inclusion", "mental health", "work-life balance",
    "employee wellness", "company culture", "team building", "change management",
    "innovation", "digital transformation", "automation", "machine learning",
    
    // Job search process keywords
    "job hunting", "job application process", "resume writing", "CV writing",
    "interview skills", "background check", "reference check", "salary research",
    "job offer negotiation", "onboarding", "career fair", "recruitment",
    
    // Geographic and demographic keywords
    "jobs near me", "local jobs", "international jobs", "expat jobs", "freelance",
    "contract work", "part-time jobs", "full-time jobs", "internships", "graduate jobs"
  ],
  
  // Author and creator information
  authors: [{ name: "RenderResume Team" }],
  creator: "RenderResume",
  publisher: "RenderResume",
  
  // Open Graph metadata for social sharing
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: ["en_US", "zh_CN"],
    url: defaultUrl,
    title: "RenderResume - AI 履歷編輯器 | 專業履歷分析與優化平台",
    description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構，為求職者提供個性化履歷優化建議。",
    siteName: "RenderResume",
    images: [
      {
        url: `${defaultUrl}/images/og-cover.png`,
        width: 1200,
        height: 630,
        alt: "RenderResume - AI 履歷編輯器",
        type: "image/png",
      },
      {
        url: `${defaultUrl}/images/og-cover.png`,
        width: 400,
        height: 400,
        alt: "RenderResume Logo",
        type: "image/png",
      }
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: "@renderresume",
    creator: "@renderresume",
    title: "RenderResume - AI 履歷編輯器",
    description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型。",
    images: [`${defaultUrl}/images/og-cover.png`],
  },
  
  // Additional metadata for AI agents
  category: "Technology",
  classification: "Career Development Tool",
  
  // Robots and crawling directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification for search engines
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
  
  // Alternate languages
  alternates: {
    canonical: defaultUrl,
    languages: {
      'zh-TW': defaultUrl,
      'en': `${defaultUrl}/en`,
      'zh-CN': `${defaultUrl}/zh-cn`,
    },
  },
  
  // App metadata for PWA
  applicationName: "RenderResume",
  appleWebApp: {
    title: "RenderResume",
    statusBarStyle: "default",
    capable: true,
  },
  
  // Structured data hints
  other: {
    'application-name': 'RenderResume',
    'apple-mobile-web-app-title': 'RenderResume',
    'format-detection': 'telephone=no',
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

// JSON-LD structured data for AI agents and search engines
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RenderResume",
  "description": "AI-powered resume builder and career optimization platform using Fortune 500 standards and STAR methodology",
  "url": defaultUrl,
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "creator": {
    "@type": "Organization",
    "name": "RenderResume Team",
    "url": defaultUrl
  },
  "featureList": [
    "AI-powered resume analysis",
    "Six-dimensional professional scoring",
    "STAR methodology framework",
    "Personalized optimization suggestions",
    "Fortune 500 enterprise standards",
    "Multi-language support",
    "AI resume builder",
    "AI resume generator",
    "AI resume maker",
    "AI resume creator",
    "AI resume optimization",
    "AI resume analysis",
    "AI resume scoring",
    "AI resume templates",
    "AI resume customization",
    "AI resume personalization",
    "Machine learning resume builder",
    "Natural language processing resume",
    "AI career tools",
    "AI job application",
    "AI career assistant",
    "AI job search tool",
    "AI hiring tool",
    "AI recruitment tool",
    "AI talent acquisition",
    "AI candidate screening",
    "AI resume matching",
    "AI job matching",
    "AI career optimization",
    "AI writing assistant",
    "AI career coach",
    "AI job counselor",
    "AI career advisor",
    "AI professional development",
    "AI skill assessment",
    "AI competency analysis",
    "ATS resume optimization",
    "Applicant tracking system",
    "Resume keywords",
    "Job application",
    "Resume scanner",
    "Resume parser",
    "Job matching",
    "Career coach",
    "Interview preparation",
    "Job interview tips",
    "Resume templates",
    "Cover letter generator",
    "LinkedIn optimization",
    "Job board",
    "Career advice"
  ],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "AI Technology",
      "value": "Machine Learning, Natural Language Processing, Artificial Intelligence"
    },
    {
      "@type": "PropertyValue", 
      "name": "Methodology",
      "value": "STAR Framework, Fortune 500 Standards, Six-Dimensional Scoring"
    },
    {
      "@type": "PropertyValue",
      "name": "Target Audience",
      "value": "Job seekers, Career professionals, Students, Recent graduates"
    },
    {
      "@type": "PropertyValue",
      "name": "Industries Supported",
      "value": "Technology, Finance, Healthcare, Education, Marketing, Sales, Consulting"
    },
    {
      "@type": "PropertyValue",
      "name": "Languages Supported",
      "value": "Traditional Chinese, English, Simplified Chinese"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0891b2" />
        <meta name="color-scheme" content="light dark" />
        
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Additional meta tags for AI agents */}
        <meta name="ai:purpose" content="Resume building and career optimization" />
        <meta name="ai:capability" content="AI-powered resume analysis, scoring, and optimization" />
        <meta name="ai:target-audience" content="Job seekers, career professionals, students" />
        <meta name="ai:methodology" content="STAR framework, Fortune 500 standards, six-dimensional scoring" />
        
        {/* Performance hints */}
        <link rel="preload" href="/api/sitemap" as="document" />
        <link rel="prefetch" href="/faq" />
        <link rel="prefetch" href="/sign-up" />
      </head>
      <body className={`${geistSans.className} antialiased w-full overflow-x-hidden h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full h-full flex flex-col overflow-x-hidden">
            <AppHeader />
            <main className="flex-1 w-full overflow-x-hidden overflow-y-auto min-h-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
