"use client";

import Footer from "@/components/footer";
import {
  AfterSection,
  BeforeSection,
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
      
      <BeforeSection />
      
      <FeaturesSection />
      
      <AfterSection />
      
      <CTASection />

      <Footer />
    </div>
  );
}
