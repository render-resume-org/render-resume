"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountSettingsRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      // 如果用戶未登入，重定向到登入頁面或顯示錯誤
      return;
    }

    // 重定向到用戶自己的帳戶設定頁面
    router.replace(`/account-settings/${user.id}`);
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            請先登入
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            您需要登入才能查看個人資料
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-cyan-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 