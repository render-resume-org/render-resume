"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PaymentContainer } from "../components";

interface OrderInfoProps {
  orderId: string | null;
  planName: string | null;
}

function OrderInfo({ orderId, planName }: OrderInfoProps) {
  if (!orderId) return null;

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-cyan-50 dark:bg-cyan-900/20",
      "border-cyan-200 dark:border-cyan-800"
    )}>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        訂單資訊
      </h3>
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <p><span className="font-medium">訂單編號：</span>{orderId}</p>
        {planName && (
          <p><span className="font-medium">訂閱方案：</span>{planName}</p>
        )}
      </div>
    </div>
  );
}

function NextStepsInfo() {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-blue-50 dark:bg-blue-900/20",
      "border-blue-200 dark:border-blue-800"
    )}>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        接下來您可以：
      </h3>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <li>• 立即開始使用增加的功能額度</li>
        <li>• 在個人資料頁面查看您的訂閱狀態</li>
        <li>• 開始享受 Pro 功能和服務</li>
      </ul>
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button asChild className={cn(
        "flex-1",
        "bg-cyan-500 hover:bg-cyan-600 text-white"
      )}>
        <Link href="/dashboard">
          回到首頁
        </Link>
      </Button>
      <Button asChild variant="outline" className={cn(
        "flex-1",
        "border-gray-300 dark:border-gray-600",
        "text-gray-700 dark:text-gray-300",
        "hover:bg-gray-50 dark:hover:bg-gray-800"
      )}>
        <Link href="/account-settings">
          <User className="w-4 h-4 mr-2" />
          查看帳戶設定
        </Link>
      </Button>
    </div>
  );
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const planName = searchParams.get("planName");

  return (
    <PaymentContainer>
      <Card className={cn(
        "shadow-lg border",
        "border-gray-200 dark:border-gray-700"
      )}>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            訂閱成功！
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            感謝您的訂閱，您的方案已經啟用
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <OrderInfo orderId={orderId} planName={planName} />
          <NextStepsInfo />
          <ActionButtons />
        </CardContent>
      </Card>
    </PaymentContainer>
  );
} 