"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ProBadge } from "@/components/ui/pro-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu, TestTubeDiagonal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ThemeSwitcher } from "./theme-switcher";
import { UserDropdown } from "./user-dropdown";

const NAVIGATIONS = [
  { name: "儀表板", href: "/dashboard" },
  { name: "論壇", href: "/threads" },
];

const AppHeader = () => {
  const { user, isAuthenticated, signOut, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  
  // Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Expose header height as CSS variable for viewport calculations
  useEffect(() => {
    const updateHeaderHeight = () => {
      const h = headerRef.current?.getBoundingClientRect().height || 0;
      document.documentElement.style.setProperty('--app-header-height', `${h}px`);
    };
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

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
    <header ref={headerRef} className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between min-w-0">
          {/* Brand Logo & Name & Navigation */}
          <div className="flex items-center space-x-6 lg:space-x-8 flex-shrink-0 min-w-0">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 min-w-0">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link href="/">
                  <Image
                    src="/images/logo-transparent.png"
                    alt="RenderResume Logo"
                    width={1024}
                    height={1024}
                    className="w-full h-full object-contain"
                    />
                </Link>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link href="/">
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                      RenderResume
                    </h1>
                  </Link>
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
                  懶得履歷．AI 履歷編輯器
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="hidden sm:flex items-center space-x-4 lg:space-x-4">
              {NAVIGATIONS.map((nav) => (
                <Link 
                  key={nav.href}
                  href={nav.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-600 transition-colors"
                >
                  {nav.name}
                </Link>
              ))}
            </div>
          </div>

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
            {mounted && isAuthenticated && user && (
              <Button asChild variant="ghost" size="sm" className="p-2 flex-shrink-0">
                <Link href={`/account-settings/${user.id}`}>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {(user.display_name || user.email?.split('@')[0] || 'U')
                        .split(' ')
                        .map(word => word[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                </Link>
              </Button>
            )}
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 md:hidden border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Mobile Navigation Buttons */}
            <div className="space-y-2 px-2 mb-4">
              {NAVIGATIONS.map((nav) => (
                <Button 
                  key={nav.href}
                  asChild 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-base font-medium"
                >
                  <Link 
                    href={nav.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {nav.name}
                  </Link>
                </Button>
              ))}
            </div>

            {!mounted || loading ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="space-y-4">
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
