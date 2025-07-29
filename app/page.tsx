"use client";

import Footer from "@/components/footer";
import {
  CTASection,
  FeaturesSection,
  HeroSection,
  ScoringSystem,
  StructuredData,
  coreFeatures,
  scoreCategories,
  stats,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <StructuredData />

      <HeroSection stats={stats} />
      
      <ScoringSystem scoreCategories={scoreCategories} />
      
      <FeaturesSection coreFeatures={coreFeatures} />
      
      <CTASection />

      <Footer />
    </div>
  );
}
