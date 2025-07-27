"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { LogoutRedirectHandler } from "@/components/logout-redirect-handler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clearSmartChatSession, cn } from "@/lib/utils";
import { FileText, Plus, Upload, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function DashboardClient() {
  const { user } = useAuth();
  const router = useRouter();
  
  // 檢查用戶是否為 Pro 計劃
  const isProUser = user?.currentPlan?.type?.toLowerCase() === 'pro';

  // 清除智慧問答會話數據（用戶返回儀表板表示完成了流程）
  useEffect(() => {
    clearSmartChatSession();
  }, []);
  
  const handleCreateResume = () => {
    if (isProUser) {
      // Pro 用戶可以直接進入創建流程
      router.push('/service-selection');
    } else {
      // 非 Pro 用戶顯示升級提示
      toast.info('🌟 此功能需要 Pro 計劃才能使用', {
        description: '升級到 Pro 計劃即可開始創建專業履歷！',
        duration: 4000,
        action: {
          label: '了解更多',
          onClick: () => router.push('/settings')
        }
      });
    }
  };

  return (
    <>
      <LogoutRedirectHandler />
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Plus className="h-6 w-6 text-cyan-600" />
              <CardTitle className="text-lg">創建新履歷</CardTitle>
            </div>
            <CardDescription>
              上傳您的作品並讓 AI 生成專業履歷
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleCreateResume}
              disabled={!isProUser} 
              variant='outline' 
              className={cn("w-full", isProUser && "bg-cyan-600 hover:bg-cyan-700 text-white hover:text-white")}
            >
              開始創建
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-cyan-600" />
              <CardTitle className="text-lg">我的履歷</CardTitle>
            </div>
            <CardDescription>
              查看和管理您已創建的履歷
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              即將推出
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-shadow">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-cyan-600" />
              <CardTitle className="text-lg">職缺搜尋</CardTitle>
            </div>
            <CardDescription>
              為您推薦最適合的職缺
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              即將推出
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          最近活動
        </h3>
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>還沒有任何履歷記錄</p>
              <p className="text-sm">開始創建您的第一份履歷吧！</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
} 