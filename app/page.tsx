"use client";

import Footer from "@/components/footer";
import {
  AfterSection,
  BeforeSection,
  CTASection,
  FeaturesSection,
  HeroSection,
  stats,
  StructuredData
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <StructuredData />

      <HeroSection stats={stats} />
      
      {/* <ScoringSystem scoreCategories={scoreCategories} /> */}
      
      <BeforeSection />
      
      <FeaturesSection />
      
      <AfterSection />
      
      <CTASection />

      <Footer />
    </div>
  );
}
