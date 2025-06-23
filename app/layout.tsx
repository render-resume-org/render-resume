import { AppHeader } from "@/components/app-header";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

// Enhanced metadata for SEO and AI Agent Optimization
export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "RenderResume - AI 履歷生成器 | 專業履歷分析與優化平台",
    template: "%s | RenderResume - AI 履歷生成器"
  },
  description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構，為求職者提供個性化履歷優化建議。免費註冊，3分鐘生成專業履歷。",
  
  // Keywords for AI agents and search engines
  keywords: [
    "AI履歷生成器", "履歷優化", "CV生成", "求職工具", "STAR原則", 
    "履歷分析", "AI求職助手", "專業履歷", "履歷模板", "職涯發展",
    "resume builder", "CV maker", "AI career tools", "job search",
    "professional resume", "career development", "resume optimization"
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
    title: "RenderResume - AI 履歷生成器 | 專業履歷分析與優化平台",
    description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構，為求職者提供個性化履歷優化建議。",
    siteName: "RenderResume",
    images: [
      {
        url: `${defaultUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "RenderResume - AI 履歷生成器",
        type: "image/png",
      },
      {
        url: `${defaultUrl}/og-image-square.png`,
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
    title: "RenderResume - AI 履歷生成器",
    description: "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型。",
    images: [`${defaultUrl}/twitter-image.png`],
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
    "Multi-language support"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "10000",
    "bestRating": "5"
  }
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
        <link rel="prefetch" href="/auth/sign-up" />
      </head>
      <body className={`${geistSans.className} antialiased w-full overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full overflow-x-hidden">
            <AppHeader />
            <main className="w-full overflow-x-hidden">
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
