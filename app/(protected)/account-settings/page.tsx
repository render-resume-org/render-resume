"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AccountSettingsRedirectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // 如果用户未登录，重定向到登录页面
      router.push("/login");
      return;
    }

    // 重定向到当前用户的 account-settings 页面
    router.push(`/account-settings/${user.id}`);
  }, [user, loading, router]);

  // 在重定向过程中显示加载状态
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在重定向到帳戶設定...</p>
        </div>
      </div>
    </div>
  );
}
