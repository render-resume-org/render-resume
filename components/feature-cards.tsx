"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { LogoutRedirectHandler } from "@/components/logout-redirect-handler";
import { clearSmartChatSession, cn } from "@/lib/utils";
import { ArrowRight, FileText, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    isProOnly: true,
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
  onAction 
}: { 
  card: FeatureCard; 
  isProUser: boolean; 
  onAction: (cardId: string) => void;
}) {
  const { title, description, icon: Icon, isProOnly, isComingSoon } = card;
  const isDisabled = isComingSoon || (isProOnly && !isProUser);

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] h-full flex flex-col transition-all duration-300 group relative",
        !isDisabled && "cursor-pointer hover:shadow-[0px_8px_25px_-5px_rgba(0,0,0,0.1),0px_4px_10px_-3px_rgba(25,28,33,0.05),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:-translate-y-1",
        isDisabled && "opacity-60"
      )}
      onClick={() => !isDisabled && onAction(card.id)}
    >
      {/* Background gradient overlay for hover effect */}
      {!isDisabled && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-transparent dark:from-cyan-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col">
        {/* Icon and Title Section */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
            isDisabled 
              ? "bg-gray-100 dark:bg-gray-700" 
              : "bg-cyan-50 dark:bg-cyan-900/20 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/30"
          )}>
            <Icon className={cn(
              "h-6 w-6 transition-colors duration-300",
              isDisabled 
                ? "text-gray-400 dark:text-gray-500" 
                : "text-cyan-600 group-hover:text-cyan-700"
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

        {/* Status and Action Indicator */}
        <div className="mt-auto">
          {isComingSoon ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                即將推出
              </span>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          ) : isProOnly && !isProUser ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                Pro 功能
              </span>
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            </div>
                     ) : (
             <div className="flex items-center justify-between">
               <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                 立即使用
               </span>
               <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
             </div>
          )}
        </div>

        {/* Hover indicator */}
        {!isDisabled && (
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
            <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main component
export function FeatureCards() {
  const { user } = useAuth();
  const router = useRouter();
  
  const isProUser = user?.currentPlan?.type?.toLowerCase() === 'pro';

  // Clear smart chat session when user returns to dashboard
  useEffect(() => {
    clearSmartChatSession();
  }, []);

  // Handle feature card actions
  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case 'create-resume':
        router.push('/service-selection');
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
    <>
      <LogoutRedirectHandler />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURE_CARDS.map((card) => (
          <FeatureCard
            key={card.id}
            card={card}
            isProUser={isProUser}
            onAction={handleCardAction}
          />
        ))}
      </div>
    </>
  );
} 