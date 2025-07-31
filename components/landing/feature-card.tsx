import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  isActive?: boolean;
  onClick?: () => void;
}

export default function FeatureCard({ feature, isActive = false, onClick }: FeatureCardProps) {
  return (
    <Card 
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg w-full max-w-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm",
        isActive 
          ? "shadow-xl ring-2 ring-cyan-500/20 dark:ring-cyan-400/20" 
          : "hover:shadow-md hover:ring-1 hover:ring-gray-200 dark:hover:ring-gray-700"
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-sm">
            <feature.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {feature.title}
            </CardTitle>
            <p className="text-base font-medium text-cyan-600 dark:text-cyan-400 mt-1">
              {feature.subtitle}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Image/Video Section */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br">
          <Image 
            src={feature.imageSrc}
            alt={feature.imageAlt}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
        
        {/* Description */}
        <div className="space-y-3">
          {feature.description.map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 