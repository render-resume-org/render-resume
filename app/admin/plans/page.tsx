"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AlertCircle, CreditCard, Edit, Loader2, Package, Plus, Star, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Plan {
  id: number;
  title: string | null;
  type: string | null;
  price: number | null;
  daily_usage: number;
  default: boolean;
  duration_days: number | null;
  created_at: string;
}

interface PlanFormData {
  title: string;
  type: string;
  price: number | null;
  daily_usage: number;
  duration_days: number | null;
  default: boolean;
}

const PLAN_TYPES = [
  { value: 'free', label: '免費方案' },
  { value: 'basic', label: '基礎方案' },
  { value: 'pro', label: '專業方案' },
  { value: 'premium', label: '高級方案' },
  { value: 'enterprise', label: '企業方案' },
];

const initialFormData: PlanFormData = {
  title: '',
  type: 'free',
  price: null,
  daily_usage: 0,
  duration_days: null,
  default: false,
};

export default function PlansManagementPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PlanFormData>(initialFormData);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/plans');
      if (!response.ok) throw new Error("Failed to fetch plans");
      
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      toast.error("載入方案列表失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setFormData(initialFormData);
    setShowForm(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title || '',
      type: plan.type || 'free',
      price: plan.price,
      daily_usage: plan.daily_usage,
      duration_days: plan.duration_days,
      default: plan.default,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("請輸入方案標題");
      return;
    }

    if (!formData.type) {
      toast.error("請選擇方案類型");
      return;
    }

    if (formData.daily_usage < 0) {
      toast.error("每日使用次數不能為負數");
      return;
    }

    setSaving(true);
    try {
      const url = '/api/admin/plans';
      const method = editingPlan ? 'PUT' : 'POST';
      const payload = editingPlan 
        ? { ...formData, id: editingPlan.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '操作失敗');
      }

      toast.success(result.message);
      setShowForm(false);
      fetchPlans();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失敗');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: Plan) => {
    const confirmed = window.confirm(
      `確定要刪除方案「${plan.title}」嗎？此操作無法復原。`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/plans?id=${plan.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '刪除失敗');
      }

      toast.success(result.message);
      fetchPlans();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '刪除失敗');
      console.error(error);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return '免費';
    return `$${price}`;
  };

  const formatDuration = (days: number | null) => {
    if (days === null) return '永久';
    return `${days} 天`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          <Package className="inline-block mr-2 w-8 h-8" />
          方案管理
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          管理系統訂閱方案，包括價格、使用限制等設定
        </p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">總方案數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
              免費方案
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {plans.filter(p => p.price === null || p.price === 0).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              價格為 0 或空值
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              付費方案
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {plans.filter(p => p.price && p.price > 0).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              價格大於 0
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 調試資訊 - 僅在開發環境顯示 */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">調試資訊</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-gray-500 space-y-1">
              <div>總方案數: {plans.length}</div>
              <div>免費方案: {plans.filter(p => p.price === null || p.price === 0).length}</div>
              <div>付費方案: {plans.filter(p => p.price && p.price > 0).length}</div>
              <div className="mt-2">
                <div>方案詳情:</div>
                {plans.map(plan => (
                  <div key={plan.id} className="ml-2">
                    {plan.title} - 價格: {plan.price} - 類型: {plan.type}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 主要內容 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>方案列表</CardTitle>
              <CardDescription>管理所有訂閱方案</CardDescription>
            </div>
            <Button onClick={handleCreatePlan}>
              <Plus className="mr-2 w-4 h-4" />
              新增方案
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              還沒有任何方案
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>方案名稱</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>價格</TableHead>
                  <TableHead>每日使用</TableHead>
                  <TableHead>有效期</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>創建時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {plan.title || '未命名方案'}
                        {plan.default && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {PLAN_TYPES.find(t => t.value === plan.type)?.label || plan.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium",
                          (plan.price === null || plan.price === 0) 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-blue-600 dark:text-blue-400"
                        )}>
                          {formatPrice(plan.price)}
                        </span>
                        {(plan.price === null || plan.price === 0) && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            免費
                          </Badge>
                        )}
                        {plan.price && plan.price > 0 && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            付費
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{plan.daily_usage} 次</TableCell>
                    <TableCell>{formatDuration(plan.duration_days)}</TableCell>
                    <TableCell>
                      <Badge variant={plan.default ? "default" : "secondary"}>
                        {plan.default ? "預設方案" : "一般方案"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(plan.created_at).toLocaleDateString('zh-TW')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(plan)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 新增/編輯表單對話框 */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    <CreditCard className="inline-block mr-2 w-5 h-5" />
                    {editingPlan ? '編輯方案' : '新增方案'}
                  </CardTitle>
                  <CardDescription>
                    設定方案的基本資訊和使用限制
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">方案名稱 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="輸入方案名稱"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>方案類型 *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇方案類型" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">價格（元）</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      price: e.target.value ? parseFloat(e.target.value) : null 
                    }))}
                    placeholder="0 表示免費方案"
                  />
                  <p className="text-sm text-gray-500">
                    留空或輸入 0 表示免費方案
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="daily_usage">每日使用次數 *</Label>
                  <Input
                    id="daily_usage"
                    type="number"
                    min="0"
                    value={formData.daily_usage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      daily_usage: parseInt(e.target.value) || 0 
                    }))}
                    placeholder="每日可使用次數"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    0 表示無限制使用
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_days">有效期（天）</Label>
                  <Input
                    id="duration_days"
                    type="number"
                    min="1"
                    value={formData.duration_days || ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      duration_days: e.target.value ? parseInt(e.target.value) : null 
                    }))}
                    placeholder="方案有效期"
                  />
                  <p className="text-sm text-gray-500">
                    留空表示永久有效
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="default"
                    checked={formData.default}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      default: checked as boolean 
                    }))}
                  />
                  <Label htmlFor="default" className="cursor-pointer">
                    設為預設方案
                  </Label>
                </div>

                {formData.default && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      設為預設方案後，其他方案的預設狀態將被取消
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        儲存中...
                      </>
                    ) : (
                      editingPlan ? '更新方案' : '創建方案'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}