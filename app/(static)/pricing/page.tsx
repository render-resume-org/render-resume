"use client";

import { PlanCard } from "@/components/subscription/plan-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plan } from "@/types/user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "@/components/footer";

export default function PricingPage() {
  const [loading, setLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState<number | null>(null);
  const [allPlans, setAllPlans] = useState<Plan[]>([]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions');
      
      if (!response.ok) {
        throw new Error('獲取方案信息失敗');
      }
      
      const data = await response.json();
      setAllPlans(data.allPlans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('獲取方案信息失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleUpgrade = async (planId: number) => {
    try {
      setIsUpgrading(planId);

      // Beta 版暫時不開放付費
      toast.info('Beta 版尚未開放付費！感謝您的支持！')
      
      // 暫時 disable 金流串接
      // const response = await fetch('/api/payment/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ planId }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || '建立支付頁面失敗');
      // }

      // if (data.paymentUrl) {
      //   // 導向支付頁面
      //   window.location.href = data.paymentUrl;
      // } else {
      //   throw new Error('未收到支付頁面 URL');
      // }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '升級失敗，請稍後再試';
      toast.error('升級失敗', {
        description: errorMessage,
      });
    } finally {
      setIsUpgrading(null);
    }
  };

  // 獲取免費方案
  const getFreePlan = () => {
    return allPlans.find(plan => plan.type === 'free');
  };

  // show skeleton when loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-48 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const freePlan = getFreePlan();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* 主要標題區域 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            選擇您的方案
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            選擇最適合您的方案，讓您求職過程更有效率！
          </p>
        </div>

        {/* 主要方案卡片區域 */}
        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {allPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrent={false}
              canUpgrade={true}
              onUpgrade={handleUpgrade}
              isUpgrading={isUpgrading === plan.id}
              currentPlanType={'FREE'}
              freePlanId={freePlan?.id || 0}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
} 