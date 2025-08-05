"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountSettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      {/* 個人資料區域 */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Avatar Card Skeleton */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Profile Information - now empty since email and join date moved */}
              <div className="space-y-3">
                {/* Empty space for profile info */}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>

              {/* Account Statistics */}
              <div>
                <div className="flex items-center mb-3">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-32 mb-4" />
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Skeleton className="h-8 w-8 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Skeleton className="h-8 w-8 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information Card Skeleton */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 其他功能區域 - 序號兌換 */}
      <div className="mt-8 space-y-8">
        {/* Redeem Code Card Skeleton */}
        <div className="w-full">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 訂閱相關卡片 */}
        <div className="space-y-8">
          {/* Current Plan Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-5 w-5 mr-2" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-9 w-full" />
              </div>
            </CardContent>
          </Card>

          {/* Subscription History Card Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <Skeleton className="h-9 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 