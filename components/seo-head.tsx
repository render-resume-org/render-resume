import { Metadata } from 'next';
import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
  noFollow?: boolean;
}

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  noFollow?: boolean;
}

export function generatePageMetadata({
  title = "RenderResume - AI 履歷生成器",
  description = "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型，採用 STAR 原則架構，為求職者提供個性化履歷優化建議。",
  keywords = [],
  canonicalUrl,
  ogImage = "/og-image.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  noIndex = false,
  noFollow = false
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const defaultKeywords = [
    "AI履歷生成器", "履歷優化", "CV生成", "求職工具", "STAR原則", 
    "履歷分析", "AI求職助手", "專業履歷", "履歷模板", "職涯發展",
    "resume builder", "CV maker", "AI career tools", "job search",
    "professional resume", "career development", "resume optimization"
  ];

  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: {
      default: title,
      template: "%s | RenderResume - AI 履歷生成器"
    },
    description,
    keywords: allKeywords,
    
    // Author and creator information
    authors: [{ name: "RenderResume Team" }],
    creator: "RenderResume",
    publisher: "RenderResume",
    
    // Open Graph metadata
    openGraph: {
      type: ogType,
      locale: "zh_TW",
      alternateLocale: ["en_US", "zh_CN"],
      url: fullCanonicalUrl,
      title,
      description,
      siteName: "RenderResume",
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        }
      ],
    },
    
    // Twitter Card metadata
    twitter: {
      card: twitterCard,
      site: "@renderresume",
      creator: "@renderresume",
      title,
      description,
      images: [fullOgImage],
    },
    
    // Robots and crawling directives
    robots: {
      index: !noIndex,
      follow: !noFollow,
      googleBot: {
        index: !noIndex,
        follow: !noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Canonical URL
    alternates: {
      canonical: fullCanonicalUrl,
    },
    
    // Additional metadata for AI agents
    category: "Technology",
    classification: "Career Development Tool",
    
    // App metadata
    applicationName: "RenderResume",
    
    // Additional meta tags
    other: {
      'ai:purpose': 'Resume building and career optimization',
      'ai:capability': 'AI-powered resume analysis, scoring, and optimization',
      'ai:target-audience': 'Job seekers, career professionals, students',
      'ai:methodology': 'STAR framework, Fortune 500 standards, six-dimensional scoring',
    },
  };
}

// React component for client-side SEO additions
export function SEOHead({
  title = "RenderResume - AI 履歷生成器",
  description = "使用 AI 技術打造專業履歷和作品集。基於 Fortune 500 企業標準的六維度評估模型。",
  keywords = [],
  canonicalUrl,
  ogImage = "/og-image.png",
  structuredData,
  noIndex = false,
  noFollow = false
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const defaultKeywords = [
    "AI履歷生成器", "履歷優化", "CV生成", "求職工具", "STAR原則"
  ];

  const allKeywords = [...defaultKeywords, ...keywords];
  const robotsContent = `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords.join(', ')} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="RenderResume" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />
      
      {/* AI Agent Optimization */}
      <meta name="ai:purpose" content="Resume building and career optimization" />
      <meta name="ai:capability" content="AI-powered resume analysis, scoring, and optimization" />
      <meta name="ai:target-audience" content="Job seekers, career professionals, students" />
      <meta name="ai:methodology" content="STAR framework, Fortune 500 standards, six-dimensional scoring" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

// Common structured data schemas
export const createWebsiteSchema = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "RenderResume",
  "description": "AI-powered resume builder and career optimization platform",
  "url": baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${baseUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

export const createOrganizationSchema = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RenderResume",
  "description": "AI-powered resume builder and career optimization platform using Fortune 500 standards",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "sameAs": [
    "https://twitter.com/renderresume",
    "https://linkedin.com/company/renderresume"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "support@renderresume.com"
  }
});

export const createSoftwareApplicationSchema = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RenderResume",
  "description": "AI-powered resume builder and career optimization platform using Fortune 500 standards and STAR methodology",
  "url": baseUrl,
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
    "url": baseUrl
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
}); 
 