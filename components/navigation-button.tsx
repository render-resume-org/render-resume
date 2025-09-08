"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRouter } from 'next/navigation';

interface NavigationButtonProps {
  direction: 'left' | 'right';
  route: string;
  text: string;
  disabled?: boolean;
  beforeNavigate?: () => Promise<void> | void;
  className?: string;
}

export function NavigationButton({ direction, route, text, disabled = false, beforeNavigate, className }: NavigationButtonProps) {
  const router = useRouter();
  
  const isLeft = direction === 'left';
  const Icon = isLeft ? ArrowLeft : ArrowRight;
  
  const baseStyles = "text-sm px-3 py-2 rounded-md flex items-center gap-2 shadow-lg";
  
  const variantStyles = isLeft
    ? "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
    : "bg-cyan-600 hover:bg-cyan-700 text-white";

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  const handleClick = async () => {
    if (!disabled) {
      try {
        if (beforeNavigate) {
          await beforeNavigate();
        }
        router.push(route);
      } catch (error) {
        console.error('❌ [NavigationButton] Error in beforeNavigate:', error);
        alert(error instanceof Error ? error.message : '操作失敗，請重試');
      }
    }
  };

  return (
    <Button
      variant={isLeft ? "outline" : "default"}
      onClick={handleClick}
      disabled={disabled}
      className={cn(baseStyles, variantStyles, disabledStyles, className)}
    >
      {isLeft && <Icon className="h-4 w-4" />}
      <span>{text}</span>
      {!isLeft && <Icon className="h-4 w-4" />}
    </Button>
  );
}
