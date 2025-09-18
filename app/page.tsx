"use client";

import Footer from "@/components/layout/footer";
import {
  ResumeDemoSection,
  PainPointsSection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  StructuredData
} from "@/features/content/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <StructuredData />

      <HeroSection />
      
      <PainPointsSection />
      
      <FeaturesSection />
      
      <ResumeDemoSection />
      
      <FAQSection />

      <Footer />
    </div>
  );
}
