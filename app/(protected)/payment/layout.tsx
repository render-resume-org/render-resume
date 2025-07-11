"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ReactNode, Suspense } from "react";

interface PaymentLayoutProps {
  children: ReactNode;
}

function PaymentLoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">載入中...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentLayout({ children }: PaymentLayoutProps) {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Suspense fallback={<PaymentLoadingFallback />}>
        {children}
      </Suspense>
    </div>
  );
} 