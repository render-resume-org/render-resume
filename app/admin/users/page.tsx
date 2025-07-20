"use client";

import { useAdminData, type UserWithSubscription } from "@/components/hooks/use-admin-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Ban, ChevronLeft, ChevronRight, Download, Edit, Eye, Filter, Loader2, MoreHorizontal, Search, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const planTypeColors = {
  free: "bg-gray-100 text-gray-800",
  paid: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800"
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

interface Plan {
  id: number;
  title: string;
  type: string;
  daily_usage: number;
  duration_days: number | null;
  price: number | null;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "paid" | "free">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [subscriptionDuration, setSubscriptionDuration] = useState("30");
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  const { 
    users, 
    stats, 
    pagination, 
    loading, 
    error, 
    refetch, 
    deleteUser 
  } = useAdminData({
    page: currentPage,
    limit: pageSize,
    search: searchTerm,
    filter: filterType
  });

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // 重置到第一頁
  };

  const handleFilterChange = (value: "all" | "active" | "paid" | "free") => {
    setFilterType(value);
    setCurrentPage(1); // 重置到第一頁
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewUser = (user: UserWithSubscription) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleManageSubscription = async (user: UserWithSubscription) => {
    setSelectedUser(user);
    setIsSubscriptionModalOpen(true);
    
    // 獲取可用方案
    try {
      const response = await fetch('/api/admin/subscriptions');
      const data = await response.json();
      if (response.ok) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('獲取方案失敗:', error);
      toast.error('獲取方案列表失敗');
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedUser || !selectedPlan) return;

    try {
      setIsSubscriptionLoading(true);
      const response = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          planId: selectedPlan,
          duration: parseInt(subscriptionDuration)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '設定訂閱失敗');
      }

      toast.success('訂閱已成功設定');
      setIsSubscriptionModalOpen(false);
      setSelectedPlan("");
      setSubscriptionDuration("30");
      await refetch(); // 重新獲取用戶數據
    } catch (error) {
      console.error('設定訂閱失敗:', error);
      toast.error(error instanceof Error ? error.message : '設定訂閱失敗');
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const handleCancelSubscription = async (userId: string) => {
    if (!confirm("確定要取消此用戶的訂閱嗎？")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subscriptions?userId=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '取消訂閱失敗');
      }

      toast.success('訂閱已成功取消');
      await refetch(); // 重新獲取用戶數據
    } catch (error) {
      console.error('取消訂閱失敗:', error);
      toast.error(error instanceof Error ? error.message : '取消訂閱失敗');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("確定要刪除此用戶嗎？此操作不可恢復。")) {
      return;
    }

    try {
      setIsDeleting(userId);
      await deleteUser(userId);
    } catch (error) {
      console.error("刪除用戶失敗:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleExportUsers = () => {
    // 將用戶數據轉換為CSV格式
    const csvData = users.map(user => ({
      用戶ID: user.id,
      電子信箱: user.email || "",
      姓名: user.display_name || "",
      方案: user.subscription?.plan_title || "無",
      方案類型: user.subscription?.plan_type || "free",
      狀態: user.subscription?.is_active ? "活躍" : "停用",
      註冊時間: user.created_at,
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('用戶數據已導出');
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">載入數據時出現錯誤</div>
          <div className="text-gray-600 mb-4">{error}</div>
          <Button onClick={refetch}>重試</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用戶管理</h1>
          <p className="text-gray-600 mt-2">管理系統中的所有用戶帳戶</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportUsers} variant="outline" disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            導出數據
          </Button>
          <Button disabled={loading}>
            <UserPlus className="h-4 w-4 mr-2" />
            新增用戶
          </Button>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">總用戶數</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">活躍用戶</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">付費用戶</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">{stats.paidUsers}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">免費用戶</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold text-gray-600">{stats.freeUsers}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 搜尋和篩選 */}
      <Card>
        <CardHeader>
          <CardTitle>用戶列表</CardTitle>
          <CardDescription>搜尋和管理系統用戶</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜尋用戶名稱或電子信箱..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={handleFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部用戶</SelectItem>
                  <SelectItem value="active">活躍用戶</SelectItem>
                  <SelectItem value="paid">付費用戶</SelectItem>
                  <SelectItem value="free">免費用戶</SelectItem>
                </SelectContent>
              </Select>
              <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 筆</SelectItem>
                  <SelectItem value="25">25 筆</SelectItem>
                  <SelectItem value="50">50 筆</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用戶</TableHead>
                      <TableHead>方案</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead>註冊時間</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar_url || `https://avatar.vercel.sh/${user.email}`} />
                              <AvatarFallback>{getInitials(user.display_name || user.email || 'U')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.display_name || '未設定'}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {user.subscription?.plan_title || '免費方案'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              user.subscription?.is_active 
                                ? planTypeColors.paid 
                                : planTypeColors.expired
                            }
                          >
                            {user.subscription?.is_active ? '活躍' : '停用'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                <Eye className="mr-2 h-4 w-4" />
                                查看詳情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageSubscription(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                管理訂閱
                              </DropdownMenuItem>
                              {user.subscription?.is_active && (
                                <DropdownMenuItem 
                                  className="text-orange-600"
                                  onClick={() => handleCancelSubscription(user.id)}
                                >
                                  <Ban className="mr-2 h-4 w-4" />
                                  取消訂閱
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={isDeleting === user.id}
                              >
                                {isDeleting === user.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                刪除用戶
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* 分頁控制 */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    顯示 {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 
                    筆，共 {pagination.total} 筆
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      上一頁
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                    >
                      下一頁
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 用戶詳情模態框 */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>用戶詳情</DialogTitle>
            <DialogDescription>查看用戶的詳細信息</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || `https://avatar.vercel.sh/${selectedUser.email}`} />
                  <AvatarFallback>{getInitials(selectedUser.display_name || selectedUser.email || 'U')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.display_name || '未設定'}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">用戶 ID</Label>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">註冊時間</Label>
                  <p className="text-sm mt-1">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">訂閱方案</Label>
                  <p className="text-sm mt-1">{selectedUser.subscription?.plan_title || '免費方案'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">方案狀態</Label>
                  <p className="text-sm mt-1">{selectedUser.subscription?.is_active ? '活躍' : '停用'}</p>
                </div>
              </div>
              
              {selectedUser.subscription?.expire_at && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">訂閱到期時間</Label>
                  <p className="text-sm mt-1">{formatDate(selectedUser.subscription.expire_at)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 訂閱管理模態框 */}
      <Dialog open={isSubscriptionModalOpen} onOpenChange={setIsSubscriptionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>管理訂閱</DialogTitle>
            <DialogDescription>
              為 {selectedUser?.display_name || selectedUser?.email} 設定訂閱方案
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="plan">選擇方案</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="請選擇方案" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.title} - {plan.type === 'free' ? '免費' : `$${plan.price}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">有效期（天）</Label>
              <Select value={subscriptionDuration} onValueChange={setSubscriptionDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 天</SelectItem>
                  <SelectItem value="30">30 天</SelectItem>
                  <SelectItem value="90">90 天</SelectItem>
                  <SelectItem value="365">365 天</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsSubscriptionModalOpen(false)}
                className="flex-1"
              >
                取消
              </Button>
              <Button 
                onClick={handleAssignSubscription}
                disabled={!selectedPlan || isSubscriptionLoading}
                className="flex-1"
              >
                {isSubscriptionLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                設定訂閱
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
