import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProBadge } from "@/components/ui/pro-badge";
import { Plan } from "@/features/account/types/user";
import { Calendar, CreditCard, Lock, Zap } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isCurrent: boolean;
  canUpgrade: boolean;
  onUpgrade?: (planId: number) => void;
  isUpgrading?: boolean;
  currentPlanType: string;
  freePlanId: number;
}

export function PlanCard({
  plan,
  isCurrent,
  canUpgrade,
  onUpgrade,
  isUpgrading = false,
  currentPlanType,
  freePlanId,
}: PlanCardProps) {
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return '';
    return `NT$ ${price.toLocaleString()}`;
  };

  return (
    <Card className={
      (isCurrent
        ? "border-2 border-cyan-500 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-900/20 shadow-lg"
        : "border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
      ) + " flex flex-col h-full"
    }>
      <CardHeader className="flex-1 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <ProBadge 
              planType={plan.type} 
              userPlan={currentPlanType}
            />
          </div>
        </div>
        {plan.id === freePlanId && (
          <div className="text-sm text-gray-500 dark:text-gray-400">完全免費</div>
        )}
        {plan.price && plan.id !== freePlanId ? (
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(plan.price)}</div>
        ) : null}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-0">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Zap className="h-4 w-4 mr-2 text-cyan-500" />
            每日 {plan.daily_usage} 次使用額度
          </div>
          {plan.duration_days && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
              有效期 {plan.duration_days} 天
            </div>
          )}
          {!plan.duration_days && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-cyan-500" />
              永久有效
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col items-center justify-end min-h-[40px] w-full">
          {isCurrent ? (
            <Button disabled className="w-full rounded-lg bg-cyan-500 text-white font-semibold py-2 px-4 text-sm shadow-sm">
              目前使用中
            </Button>
          ) : plan.price ? (
            canUpgrade ? (
              <Button
                onClick={() => onUpgrade && onUpgrade(plan.id)}
                disabled={isUpgrading}
                className="w-full rounded-lg bg-cyan-500 hover:bg-cyan-700 text-white font-semibold py-2 px-4 text-sm shadow-sm transition-colors"
                style={{minHeight: 40}}
              >
                {isUpgrading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-lg animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                升級到此方案
              </Button>
            ) : (
              <Button variant="outline" className="w-full rounded-lg text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed" disabled style={{minHeight: 40}}>
                無法降級
              </Button>
            )
          ) : (
            <div className="flex items-center justify-center text-sm text-gray-400 w-full">
              <Lock className="h-4 w-4 mr-2" />
              非公開販售
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 