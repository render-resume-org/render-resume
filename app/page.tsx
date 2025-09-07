"use client";

import Footer from "@/components/footer";
import {
  AfterSection,
  PainPointsSection,
  CTASection,
  FeaturesSection,
  HeroSection,
  StructuredData
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen">
      <StructuredData />

      <HeroSection />
      
      <PainPointsSection />
      
      <FeaturesSection />
      
      <AfterSection />
      
      <CTASection />

      <Footer />
    </div>
  );
}
