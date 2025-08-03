"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { PlanCard } from "@/components/subscription/plan-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProBadge } from "@/components/ui/pro-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plan, Subscription } from "@/types/user";
import { Calendar, Crown, Gift, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, refreshUserPlan } = useAuth();
  const [loading, setLoading] = useState(true);
  const [redeemCode, setRedeemCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState<number | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null);
  const [allPlans, setAllPlans] = useState<Plan[]>([]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions');
      
      if (!response.ok) {
        throw new Error('獲取訂閱信息失敗');
      }
      
      const data = await response.json();
      setSubscriptions(data.subscriptions || []);
      setCurrentPlan(data.currentPlan || null);
      setAllPlans(data.allPlans || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('獲取訂閱信息失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      toast.error('請輸入序號');
      return;
    }

    try {
      setIsRedeeming(true);
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: redeemCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '兌換失敗');
      }

      toast.success('兌換成功！', {
        description: `已成功兌換 ${data.subscription.plans?.title} 方案`,
      });

      setRedeemCode('');
      await fetchSubscriptions();
      await refreshUserPlan();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '兌換失敗，請稍後再試';
      toast.error('兌換失敗', {
        description: errorMessage,
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleUpgrade = async (planId: number) => {
    try {
      setIsUpgrading(planId);
      
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '建立支付頁面失敗');
      }

      if (data.paymentUrl) {
        // 導向支付頁面
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('未收到支付頁面 URL');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '升級失敗，請稍後再試';
      toast.error('升級失敗', {
        description: errorMessage,
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 檢查是否為當前方案
  const isCurrentPlan = (planId: number) => {
    if (!currentPlan) return false;
    return currentPlan.plans?.id === planId;
  };

  // 檢查是否可以升級到該方案
  const canUpgradeToPlan = (plan: Plan) => {
    if (isCurrentPlan(plan.id)) return false;
    
    const currentDailyUsage = currentPlan?.plans?.daily_usage || 0;
    return plan.daily_usage > currentDailyUsage;
  };

  const isPlanExpired = (expireAt: string | null) => {
    if (!expireAt) return false;
    return new Date(expireAt) < new Date();
  };

  // 獲取免費方案
  const getFreePlan = () => {
    return allPlans.find(plan => plan.type === 'free');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-6 w-64 mb-8" />
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const freePlan = getFreePlan();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">訂閱</h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理您的訂閱方案
        </p>
      </div>
      

      <div className="grid gap-6">
        {/* 序號兌換卡片 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              序號兌換
            </CardTitle>
            <CardDescription>
              輸入序號來兌換方案或升級您的帳戶
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="redeem-code"></Label>
                <Input
                  id="redeem-code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  placeholder="輸入您的序號"
                  disabled={isRedeeming}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleRedeemCode}
                  disabled={isRedeeming || !redeemCode.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isRedeeming ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Gift className="h-4 w-4 mr-2" />
                  )}
                  兌換
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 當前訂閱 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              當前訂閱
            </CardTitle>
            <CardDescription>
              您目前的方案資訊和使用限制
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ProBadge 
                      planType={currentPlan.plans?.type} 
                      userPlan={currentPlan?.plans?.type || 'free'} 
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentPlan.plans?.title || '未知方案'}
                    </span>
                    {currentPlan.id && isPlanExpired(currentPlan.expire_at) && (
                      <Badge variant="destructive">已到期</Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Zap className="h-4 w-4 mr-1" />
                    每日 {currentPlan.plans?.daily_usage || 0} 次額度
                  </div>
                </div>
                
                {currentPlan.id && currentPlan.expire_at && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    到期日：{formatDate(currentPlan.expire_at)}
                  </div>
                )}
                
                {!currentPlan.id && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    永久有效
                  </div>
                )}
                
                {currentPlan.id && currentPlan.created_at && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    訂閱於：{formatDate(currentPlan.created_at)}
                  </div>
                )}
                
                {!currentPlan.id && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 您目前使用的是免費方案。使用序號兌換或購買付費方案來升級，享受更多功能和額度！
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Fallback for edge case where no plan is available
              <div className="text-sm text-gray-500 dark:text-gray-400">
                無法載入方案資訊
              </div>
            )}
          </CardContent>
        </Card>

        {/* 可用方案 */}
        <Card>
          <CardHeader>
            <CardTitle>可用方案</CardTitle>
            <CardDescription>
              查看所有可用的訂閱方案
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {/* 顯示所有方案，包括免費方案 */}
              {allPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCurrent={isCurrentPlan(plan.id)}
                  canUpgrade={canUpgradeToPlan(plan)}
                  onUpgrade={handleUpgrade}
                  isUpgrading={isUpgrading === plan.id}
                  currentPlanType={currentPlan?.plans?.type || 'FREE'}
                  freePlanId={freePlan?.id || 0}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 訂閱歷史 */}
        {subscriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>訂閱歷史</CardTitle>
              <CardDescription>
                您的所有訂閱記錄
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <ProBadge 
                        planType={subscription.plans?.type} 
                        userPlan={currentPlan?.plans?.type || 'free'} 
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {subscription.plans?.title || '未知方案'}
                      </span>
                      {isPlanExpired(subscription.expire_at) && (
                        <Badge variant="outline" className="text-gray-500">
                          已到期
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {subscription.expire_at 
                        ? `到期：${formatDate(subscription.expire_at)}`
                        : '永久有效'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 