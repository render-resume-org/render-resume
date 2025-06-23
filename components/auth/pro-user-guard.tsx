"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Loader2, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProUserGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
  showUpgradePrompt?: boolean;
}

export function ProUserGuard({ 
  children, 
  fallbackPath = "/dashboard",
  showUpgradePrompt = true 
}: ProUserGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [planDataLoaded, setPlanDataLoaded] = useState(false);

  // Check if user has pro plan
  const isProUser = user?.currentPlan?.type.toLowerCase() === 'pro';
  const hasActivePlan = user?.currentPlan !== null;
  const planExpired = user?.currentPlan?.expire_at ? 
    new Date(user?.currentPlan?.expire_at) < new Date() : false;

  // Track when plan data has been loaded to prevent false negatives
  useEffect(() => {
    if (user && user.hasOwnProperty('currentPlan')) {
      setPlanDataLoaded(true);
    }
  }, [user]);

  // Handle navigation in a separate useEffect
  useEffect(() => {
    if (shouldRedirect) {
      router.push(fallbackPath);
    }
  }, [shouldRedirect, router, fallbackPath]);

  // Auto redirect countdown for non-pro users (only after plan data is loaded)
  useEffect(() => {
    if (!loading && isAuthenticated && planDataLoaded && !isProUser && showUpgradePrompt) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShouldRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, isAuthenticated, planDataLoaded, isProUser, showUpgradePrompt]);

  // Show loading state (for auth or plan data)
  if (loading || (isAuthenticated && !planDataLoaded)) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                {loading ? '正在驗證身份...' : '正在載入會員資格...'}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show upgrade prompt for non-pro users (only after plan data is confirmed loaded)
  if (isAuthenticated && planDataLoaded && !isProUser && showUpgradePrompt) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Pro 功能專區
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                此功能僅限 Pro 會員使用
              </p>
            </div>
            
            <Card>
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-900 dark:to-cyan-800">
                  <Lock className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    <Crown className="h-5 w-5 text-amber-500" />
                    需要 Pro 會員資格
                  </CardTitle>
                  <CardDescription>
                    升級至 Pro 會員即可使用高級功能
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Plan Status */}
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      目前方案
                    </h4>
                    <Badge variant="outline" className="text-gray-600">
                      {hasActivePlan ? (
                        planExpired ? '已到期' : user?.currentPlan?.title
                      ) : 'FREE'}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4 mr-2" />
                    每日額度：{user?.currentPlan?.daily_usage || 3} 次
                  </div>
                  {planExpired && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                      您的方案已到期，請續費或升級
                    </div>
                  )}
                </div>

                {/* Pro Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Pro 會員專享功能：
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      高級履歷分析
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      文件上傳分析
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      AI 視覺識別
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      更高每日使用額度
                    </li>
                  </ul>
                </div>

                {/* Countdown Notice */}
                <div className="rounded-md border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-800 dark:bg-cyan-950">
                  <p className="text-sm text-cyan-800 dark:text-cyan-200">
                    {countdown} 秒後將自動返回儀表板...
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                  >
                    <Link href="/settings">
                      <Crown className="h-4 w-4 mr-2" />
                      升級至 Pro 會員
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShouldRedirect(true)}
                    className="w-full"
                  >
                    返回儀表板
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                ← 返回首頁
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show children if user is pro (only after plan data is loaded)
  if (isAuthenticated && planDataLoaded && isProUser) {
    return <>{children}</>;
  }

  // Fallback - redirect to dashboard (only after plan data is loaded)
  if (isAuthenticated && planDataLoaded) {
    setShouldRedirect(true);
    return null;
  }

  // This should not happen as this component should be used within a protected layout
  return null;
} 