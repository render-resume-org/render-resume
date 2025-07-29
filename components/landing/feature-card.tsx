import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface FeatureCardProps {
  feature: {
    id: number;
    icon: LucideIcon;
    title: string;
    subtitle: string;
    description: string[];
    imageSrc: string;
    imageAlt: string;
    layout: "imageRight" | "imageLeft";
  };
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const isImageRight = feature.layout === "imageRight";
  
  return (
    <div className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Content Section */}
        <div className={`space-y-6 ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="flex items-center space-x-3">
            <feature.icon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
          </div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {feature.subtitle}
          </h4>
          {feature.description.map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        
        {/* Image Section */}
        <div className={`flex justify-center ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <Image 
              src={feature.imageSrc}
              alt={feature.imageAlt}
              width={500}
              height={300}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 