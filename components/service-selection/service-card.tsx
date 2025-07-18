import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string; // Tailwind class for button color
  onClick: () => void;
  className?: string;
}

export function ServiceCard({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  onClick,
  className
}: ServiceCardProps) {
  return (
    <Card
      className={cn("cursor-pointer hover:shadow-lg transition-all duration-300 border-2 py-1 md:py-6", className)}
      onClick={onClick}
    >
      <div className="flex flex-row md:flex-col items-center md:items-center gap-6 md:gap-0 px-6 pt-6 md:pt-0">
        <div className="flex-shrink-0 w-24 h-24 md:w-48 md:h-48 flex items-center justify-center mx-0 md:mx-auto my-0 md:my-6">
          {icon}
        </div>
        <div className="flex-1 text-left md:text-center">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2 md:mb-4">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 mt-2 md:mb-6">
            {description}
          </CardDescription>
        </div>
      </div>
      <CardContent className="pt-4 md:pt-0 pb-6 md:pb-0 px-6 flex flex-col">
        <Button
          className={cn("w-full text-white mt-2 md:mt-0", buttonColor)}
          onClick={e => {
            e.stopPropagation();
            onClick();
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
} 