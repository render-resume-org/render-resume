import { LucideIcon } from "lucide-react";
import FeatureCard from "./feature-card";

interface CoreFeature {
  id: number;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string[];
  imageSrc: string;
  imageAlt: string;
  layout: "imageRight" | "imageLeft";
}

interface FeaturesSectionProps {
  coreFeatures: CoreFeature[];
}

export default function FeaturesSection({ coreFeatures }: FeaturesSectionProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ✨ 核心功能介紹
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI 技術驅動，讓履歷分析更智能、更專業！
          </p>
        </div>

        {/* Render all features using the modular component */}
        {coreFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
} 