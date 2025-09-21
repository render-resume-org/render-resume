"use client";

import { useAuth } from "@/hooks/use-auth";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { clearSessionData } from "@/services/storage";
import { ArrowRight, FileText, HardHat, Lock, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isProOnly?: boolean;
  isComingSoon?: boolean;
}

// Feature card data
const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'create-resume',
    title: '創建新履歷',
    description: '上傳您的作品並讓 AI 生成專業履歷',
    icon: Plus,
  },
  {
    id: 'my-resumes',
    title: '我的履歷',
    description: '查看和管理您已創建的履歷',
    icon: FileText,
    isComingSoon: true,
  },
  {
    id: 'job-search',
    title: '職缺搜尋',
    description: '為您推薦最適合的職缺',
    icon: User,
    isComingSoon: true,
  },
];

// Individual feature card component
function FeatureCard({ 
  card, 
  isProUser, 
  onAction,
  isLoading 
}: { 
  card: FeatureCard; 
  isProUser: boolean; 
  onAction: (cardId: string) => Promise<void> | void;
  isLoading?: boolean;
}) {
  const { title, description, icon: Icon, isProOnly, isComingSoon } = card;
  const isDisabled = isComingSoon || (isProOnly && !isProUser) || (isLoading && card.id === 'create-resume');

  // Get hover icon and tooltip text based on state
  const getHoverInfo = () => {
    if (isComingSoon) {
      return {
        icon: HardHat,
        tooltip: "即將推出"
      };
    } else if (isProOnly && !isProUser) {
      return {
        icon: Lock,
        tooltip: "Pro 專屬功能"
      };
    } else {
      return {
        icon: ArrowRight,
        tooltip: "立即使用"
      };
    }
  };

  const { icon: HoverIcon, tooltip } = getHoverInfo();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={cn(
            "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col transition-all duration-300 group relative",
            !isDisabled && "cursor-pointer hover:shadow-[0px_8px_25px_-5px_rgba(0,0,0,0.1),0px_4px_10px_-3px_rgba(25,28,33,0.05),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-700",
            isDisabled && "opacity-60"
          )}
          onClick={() => !isDisabled && onAction(card.id)}
        >
          {/* Content */}
          <div className="relative z-10 p-6 h-full flex flex-col justify-center">
            {/* Icon and Title Section */}
            <div className="flex items-start space-x-4">
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
                isDisabled 
                  ? "bg-gray-100 dark:bg-gray-700" 
                  : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
              )}>
                <Icon className={cn(
                  "h-6 w-6 transition-colors duration-300",
                  isDisabled 
                    ? "text-gray-400 dark:text-gray-500" 
                    : "text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-lg font-semibold transition-colors duration-300",
                  isDisabled 
                    ? "text-gray-400 dark:text-gray-500" 
                    : "text-gray-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400"
                )}>
                  {title}
                </h3>
                <p className={cn(
                  "text-sm mt-1 transition-colors duration-300",
                  isDisabled 
                    ? "text-gray-400 dark:text-gray-500" 
                    : "text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                )}>
                  {description}
                </p>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 pointer-events-none">
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <HoverIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Main component
export function FeatureCards() {
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  
  const isProUser = user?.currentPlan?.type?.toLowerCase() === 'pro';

  // Clear smart chat session when user returns to dashboard
  useEffect(() => {
    clearSessionData();
  }, []);

  // Handle feature card actions
  const handleCardAction = async (cardId: string) => {
    switch (cardId) {
      case 'create-resume':
        // 檢查用量是否已達上限
        setIsCheckingUsage(true);
        try {
          const response = await fetch('/api/usage-check');
          const usageResult = await response.json();
          
          if (!response.ok || !usageResult.canProceed) {
            // 達到用量上限，顯示 toast 通知
            toast.error("已達當前方案用量上限，請至帳戶設定升級方案", {
              duration: 5000,
              position: 'bottom-right',
            });
            return;
          }
          
          // 用量檢查通過，可以進行跳轉
          router.push('/service-selection');
        } catch (error) {
          console.error('用量檢查失敗:', error);
          toast.error("系統錯誤，請稍後再試", {
            duration: 3000,
            position: 'bottom-right',
          });
        } finally {
          setIsCheckingUsage(false);
        }
        break;
      case 'my-resumes':
        // TODO: Implement my resumes functionality
        console.log('My resumes feature coming soon');
        break;
      case 'job-search':
        // TODO: Implement job search functionality
        console.log('Job search feature coming soon');
        break;
      default:
        console.warn(`Unknown card action: ${cardId}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard
            key={card.id}
            card={card}
            isProUser={isProUser}
            onAction={handleCardAction}
            isLoading={isCheckingUsage}
          />
        ))}
    </div>
  );
} 