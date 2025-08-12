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
  ogImage = "/og-cover.png",
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
  ogImage = "/og-cover.png",
  structuredData,
  noIndex = false,
  noFollow = false
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  const defaultKeywords = [
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
    "AI resume refinement", "AI resume perfection",
    
    // Chinese/Traditional Chinese keywords
    "AI履歷生成器", "履歷優化", "CV生成", "求職工具", "STAR原則", 
    "履歷分析", "AI求職助手", "專業履歷", "履歷模板", "職涯發展",
    
    // English resume and job search keywords
    "resume builder", "CV maker", "AI career tools", "job search",
    "professional resume", "career development", "resume optimization",
    "Render Resume", "Render", 'Resume'
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
    "email": "info@render-resume.com"
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
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "10000",
    "bestRating": "5"
  },
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
}); 
 