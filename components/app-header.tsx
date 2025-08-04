"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/ui/pro-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, TestTubeDiagonal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ThemeSwitcher } from "./theme-switcher";
import { UserDropdown } from "./user-dropdown";

const AppHeader = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  
  // 計算進度
  const getProgress = () => {
    const progressMap: { [key: string]: number } = {
      '/service-selection': 1,
      '/upload': 10,
      '/analyze': 20,
      '/results': 40,
      '/smart-chat': 60,
      '/suggestions': 80,
      '/preview': 100,
    };
    return progressMap[pathname] || -1;
  };

  const getStepName = () => {
    const stepMap: { [key: string]: string } = {
      '/': '歡迎',
      '/service-selection': '選擇服務',
      '/upload': '上傳作品',
      '/analyze': '分析中',
      '/results': '分析完成',
      '/smart-chat': '智慧問答',
      '/suggestions': '優化建議',
      '/preview': '履歷生成',
    };
    return stepMap[pathname] || '處理中';
  };

  const progress = getProgress();
  const stepName = getStepName();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBetaBadgeClick = () => {
    toast.info(
      "歡迎加入 RenderResume Beta！目前我們正在為 waitlist 用戶提供獨家搶先體驗，同時進行系統優化與功能完善。Beta 階段預計持續至 9 月，我們將在正式上線前通知所有用戶。",
      {
        duration: 6000,
        description: "感謝您的參與，您的反饋對我們非常重要 💙",
        position: "top-center",
      }
    );
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between min-w-0">
          {/* Brand Logo & Name */}
          <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0">
              <Image
                src="/images/logo-transparent.png"
                alt="RenderResume Logo"
                width={1024}
                height={1024}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  RenderResume
                </h1>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span 
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 active:scale-95"
                      onClick={handleBetaBadgeClick}
                    >
                      <TestTubeDiagonal className="h-3 w-3" />
                      Beta
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>點擊查看 Beta 詳情</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                懶得履歷．AI 履歷生成器
              </p>
            </div>
          </Link>

          

          {/* Desktop Progress Section */}
          {progress >= 0 && (
            <div className="hidden md:flex flex-1 items-center justify-center max-w-md mx-8 min-w-0">
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {stepName}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                    {progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Auth Section & Theme Switcher */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            {!mounted || loading ? (
              <div className="w-6 h-6 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
            ) : isAuthenticated && user ? (
                <>
                  {/* Desktop Pro Badge */}
                  <ProBadge 
                    planType={user?.currentPlan?.type} 
                    userPlan={user?.currentPlan?.type} 
                    className="hidden md:flex" 
                  />
                  <UserDropdown />
                </>
            ) : (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button asChild size="sm" variant="outline">
                  <Link href="/auth/login">登入</Link>
                </Button>
                <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/auth/sign-up">註冊</Link>
                </Button>
              </div>
            )}
            <ThemeSwitcher />
          </div>

          {/* Mobile Menu Button & Theme Switcher */}
          <div className="flex md:hidden items-center space-x-1 flex-shrink-0">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 flex-shrink-0"
              aria-label="開啟選單"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Progress Section */}
        {progress >= 0 && (
          <div className="mt-3 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                {stepName}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-cyan-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden border-t border-gray-200 dark:border-gray-700 pt-4">
            {!mounted || loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="space-y-4">
                {/* User Info Display */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {(user.display_name || user.email?.split('@')[0] || 'U')
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.display_name || user.email?.split('@')[0] || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  {/* Mobile Pro Badge */}
                  <ProBadge 
                    planType={user?.currentPlan?.type} 
                    userPlan={user?.currentPlan?.type} 
                    className="flex-shrink-0" 
                  />
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 px-2">
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link href={`/profile/${user.id}`} onClick={() => setIsMobileMenuOpen(false)}>
                      個人資料
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="w-full justify-start">
                    <Link href="/subscription" onClick={() => setIsMobileMenuOpen(false)}>
                      訂閱
                    </Link>
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  登出
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button asChild size="sm" variant="outline" className="w-full">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    登入
                  </Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                    註冊
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export { AppHeader };
