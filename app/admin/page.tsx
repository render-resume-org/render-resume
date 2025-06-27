"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  Bell,
  DollarSign,
  RefreshCw,
  TrendingUp,
  Users
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  activeSubscriptions: number;
  premiumUsers: number;
  totalAnnouncements: number;
  activeAnnouncements: number;
  totalTemplates: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  avatar: string;
}

interface ChartData {
  date: string;
  users: number;
  revenue: number;
}

interface PlanDistribution {
  free: number;
  basic: number;
  pro: number;
  enterprise: number;
}

interface SystemHealth {
  uptime: string;
  responseTime: string;
  errorRate: string;
  lastBackup: string;
}

interface Summary {
  growth: string;
  conversionRate: string;
  avgRevenuePerUser: number;
}

interface DashboardData {
  stats: DashboardStats;
  recentUsers: RecentUser[];
  chartData: ChartData[];
  planDistribution: PlanDistribution;
  systemHealth: SystemHealth;
  summary: Summary;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || '獲取數據失敗');
      }
      
      setData(result);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : '獲取儀表板數據失敗';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">管理總覽</h1>
            <p className="text-gray-600">系統概況與關鍵指標</p>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-12 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">載入失敗</h2>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          重試
        </Button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { stats, recentUsers, planDistribution, systemHealth, summary } = data;

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理總覽</h1>
          <p className="text-gray-600">系統概況與關鍵指標</p>
        </div>
        <Button onClick={fetchDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          重新整理
        </Button>
      </div>

      {/* 關鍵指標卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              總用戶數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              成長率 {summary.growth}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              今日新用戶
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.newUsersToday}</div>
            <div className="text-xs text-gray-500">
              活躍訂閱 {stats.activeSubscriptions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              月收入
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.monthlyRevenue)}
            </div>
            <div className="text-xs text-gray-500">
              轉換率 {summary.conversionRate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              系統公告
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnnouncements}</div>
            <div className="text-xs text-gray-500">
              已發布 {stats.activeAnnouncements}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 詳細資訊區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近用戶 */}
        <Card>
          <CardHeader>
            <CardTitle>最近註冊用戶</CardTitle>
            <CardDescription>最新加入的用戶列表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">暫無用戶數據</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(user.joinDate)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* 方案使用分布 */}
        <Card>
          <CardHeader>
            <CardTitle>方案使用分布</CardTitle>
            <CardDescription>各訂閱方案的用戶分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(planDistribution).map(([plan, count]) => {
                const percentage = stats.totalUsers > 0 ? (count / stats.totalUsers) * 100 : 0;
                const planLabels = {
                  free: '免費方案',
                  basic: '基礎方案',
                  pro: '專業方案',
                  enterprise: '企業方案'
                };
                
                return (
                  <div key={plan} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{planLabels[plan as keyof typeof planLabels]}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 系統狀態 */}
      <Card>
        <CardHeader>
          <CardTitle>系統狀態</CardTitle>
          <CardDescription>系統運行狀況與效能指標</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemHealth.uptime}</div>
              <div className="text-xs text-gray-500">系統正常運行時間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{systemHealth.responseTime}</div>
              <div className="text-xs text-gray-500">平均回應時間</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{systemHealth.errorRate}</div>
              <div className="text-xs text-gray-500">錯誤率</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatDate(systemHealth.lastBackup)}
              </div>
              <div className="text-xs text-gray-500">最後備份時間</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 