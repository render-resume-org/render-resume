"use client";

import { useEffect } from "react";

// Structured data for the homepage
const homepageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "RenderResume - AI 履歷編輯器",
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
};

export default function StructuredData() {
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

  return null; // This component doesn't render anything visible
} 