"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PlanBadgeProps {
  planType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProBadge({ planType, className = "", size = 'md' }: PlanBadgeProps) {
  const [clickCount, setClickCount] = useState(0);

  const getPlanBadgeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pro':
        return 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600';
      case 'free':
        return 'bg-cyan-500 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-700';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600';
    }
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          badge: 'text-xs px-2 py-1',
          icon: 'h-3 w-3'
        };
      case 'lg':
        return {
          badge: 'text-sm px-3 py-1.5',
          icon: 'h-4 w-4'
        };
      default: // md
        return {
          badge: 'text-xs px-2 py-1',
          icon: 'h-3 w-3'
        };
    }
  };

  const getEasterEggMessage = (type: string, count: number) => {
    const isPro = type?.toLowerCase() === 'pro';
    
    if (count > 30) {
      return isPro 
        ? '😏 好啦你是 Pro 會員就原諒你亂按！'
        : '🤨 一直按也不會免費升級啦！';
    } else if (count > 20) {
      return isPro 
        ? '😅 Pro 會員真的很愛按欸，我懂我懂～'
        : '🙄 還在按？真的沒有隱藏功能啦！';
    } else if (count > 10) {
      return isPro 
        ? '🤣 你已經是按鈕大師了！Pro 會員果然不一樣！'
        : '😂 你的毅力我佩服！要不要考慮升級 Pro 呢？';
    }
    return null;
  };

  const getPlanConfig = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pro':
        return {
          icon: Crown,
          text: 'PRO',
          tooltip: '🌟 你享有最高級的體驗！',
          clickMessage: '✨ 魔法力量已啟動！你真是太棒了！'
        };
      case 'free':
        return {
          icon: null,
          text: 'FREE',
          tooltip: '💝 免費的，但很棒！',
          clickMessage: '🤗 喜歡 RenderResume 嗎？升級獲得更多功能！'
        };
      default:
        return {
          icon: Crown,
          text: 'PLAN',
          tooltip: '🎯 Ready for something great!',
          clickMessage: '👋 Hello there! Thanks for clicking!'
        };
    }
  };

  // Show badge for both pro and free plans
  if (!planType || (planType.toLowerCase() !== 'pro' && planType.toLowerCase() !== 'free')) {
    return null;
  }

  const sizeClasses = getSizeClasses(size);
  const planConfig = getPlanConfig(planType);
  const IconComponent = planConfig.icon;

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Check for easter egg messages
    const easterEggMessage = getEasterEggMessage(planType, newCount);
    
    if (easterEggMessage) {
      toast.success(easterEggMessage, {
        duration: 4000,
        position: 'top-center',
      });
    } else {
      toast.success(planConfig.clickMessage, {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge 
          className={`${getPlanBadgeColor(planType)} text-white font-semibold ${sizeClasses.badge} flex items-center space-x-1 transition-all duration-300 cursor-pointer active:scale-95 ${className}`}
          onClick={handleClick}
        >
          {IconComponent && <IconComponent className={`${sizeClasses.icon} drop-shadow-sm`} />}
          <span className="drop-shadow-sm">{planConfig.text}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{planConfig.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
} 