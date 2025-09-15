"use client";

import { UploadIllustration } from "@/components/svg-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BackToHomeButton, PaymentContainer } from "../components";

interface FailureOrderInfoProps {
  orderId: string | null;
}

function FailureOrderInfo({ orderId }: FailureOrderInfoProps) {
  if (!orderId) return null;

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-red-50 dark:bg-red-900/20",
      "border-red-200 dark:border-red-800"
    )}>
      <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
        訂單資訊
      </h3>
      <div className="space-y-1 text-sm text-red-700 dark:text-red-300">
        <p><span className="font-medium">訂單編號：</span>{orderId}</p>
        <p><span className="font-medium">狀態：</span>支付失敗</p>
      </div>
    </div>
  );
}

function SolutionsInfo() {
  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-yellow-50 dark:bg-yellow-900/20",
      "border-yellow-200 dark:border-yellow-800"
    )}>
      <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
        可能的解決方案：
      </h3>
      <ul className="space-y-2 text-sm text-yellow-700 dark:text-yellow-300">
        <li>• 檢查您的信用卡或付款方式是否有效</li>
        <li>• 確認帳戶餘額是否充足</li>
        <li>• 嘗試使用其他付款方式</li>
        <li>• 聯繫客服尋求幫助</li>
      </ul>
    </div>
  );
}

function FailActionButtons() {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1">
          <Link href="/pricing">
            <RefreshCw className="w-4 h-4 mr-2" />
            重新訂閱
          </Link>
        </Button>
        <BackToHomeButton />
      </div>

      <div className="text-center">
        <Button asChild variant="ghost" size="sm">
          <Link href="/faq">
            需要幫助？查看常見問題
          </Link>
        </Button>
      </div>
    </>
  );
}

function getFailureMessage(reason: string | null): string {
  switch (reason) {
    case "cancelled":
      return "您取消了支付流程";
    case "timeout":
      return "支付超時，請重新嘗試";
    case "failed":
      return "支付失敗，請檢查您的付款方式";
    default:
      return "支付過程中發生錯誤";
  }
}

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const orderId = searchParams.get("orderId");

  return (
    <PaymentContainer>
      <div className="flex justify-center mb-8">
        <UploadIllustration className="w-full max-w-xl h-auto opacity-40 grayscale" />
      </div>
      <Card className={cn(
        "shadow-lg border",
        "border-red-200 dark:border-red-800"
      )}>
        <CardHeader className="text-center">
          <div className={cn(
            "mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center",
            "bg-red-100 dark:bg-red-900"
          )}>
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl text-red-800 dark:text-red-200">
            訂閱失敗
          </CardTitle>
          <CardDescription className="text-lg">
            {getFailureMessage(reason)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FailureOrderInfo orderId={orderId} />
          <SolutionsInfo />
          <FailActionButtons />
        </CardContent>
      </Card>
    </PaymentContainer>
  );
} 