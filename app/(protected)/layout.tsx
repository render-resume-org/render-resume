"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果未登入且不在加載中，直接重定向到登入頁面
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [loading, isAuthenticated, router]);

  // 如果還在加載中，顯示加載畫面
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">正在驗證身份...</p>
          </div>
        </div>
      </div>
    );
  }

  // 如果用戶已登入，顯示內容
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 如果未登入，返回 null（因為會重定向）
  return null;
}
