"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Calendar, Eye, Gift, Loader2, Mail, Send, Users, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  display_name: string | null;
  email: string;
  avatar_url?: string | null;
  created_at?: string;
  subscription?: {
    plan_type: string;
    is_active: boolean;
  };
}

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

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
  promoCode?: string;
}

interface PromoConfig {
  plan_id: number;
  single_use: boolean;
  expire_date?: string;
}

export default function BatchPromoEmailPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  
  // Email content
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  
  // Promo configuration
  const [promoConfig, setPromoConfig] = useState<PromoConfig>({
    plan_id: 0,
    single_use: true,
    expire_date: ""
  });
  
  // Preview
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    selectedCount: 0
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?limit=1000&filter=${filter}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      toast.error("載入使用者列表失敗");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const response = await fetch('/api/admin/subscriptions');
      if (!response.ok) throw new Error("Failed to fetch plans");
      
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      toast.error("載入方案列表失敗");
      console.error(error);
    } finally {
      setPlansLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, [fetchUsers, fetchPlans]);

  useEffect(() => {
    setStats({
      totalUsers: users.length,
      selectedCount: selectedUsers.length
    });
  }, [users, selectedUsers]);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePreview = async () => {
    if (!title || !body) {
      toast.error("請填寫標題和內容");
      return;
    }

    try {
      // Generate a sample preview with mock promo code
      const sampleUser = users[0] || { 
        id: "sample", 
        email: "user@example.com", 
        display_name: "測試用戶",
        created_at: new Date().toISOString(),
        avatar_url: null
      };
      
      const mockPromoCode = "SAMPLE123";
      
      // Replace variables for preview
      const previewBody = body
        .replace(/\{\{user\.email\}\}/g, sampleUser.email)
        .replace(/\{\{user\.display_name\}\}/g, sampleUser.display_name || sampleUser.email.split('@')[0])
        .replace(/\{\{user\.id\}\}/g, sampleUser.id)
        .replace(/\{\{user\.created_at\}\}/g, new Date().toLocaleDateString('zh-TW'))
        .replace(/\{\{user\.avatar_url\}\}/g, sampleUser.avatar_url || '')
        .replace(/\{\{promo_code\}\}/g, mockPromoCode);

      const userName = sampleUser.display_name || sampleUser.email?.split('@')[0] || '';
      
      const html = `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap');
            
            body {
              font-family: 'Noto Sans TC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #111827;
              background-color: #f9fafb;
              margin: 0;
              padding: 0;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .header {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: white;
              padding: 40px 30px;
              text-align: center;
            }
            
            .logo {
              font-size: 24px;
              font-weight: 700;
              margin-bottom: 8px;
            }
            
            .header h1 {
              font-size: 28px;
              font-weight: 700;
              margin: 0 0 8px 0;
            }
            
            .header p {
              font-size: 16px;
              opacity: 0.9;
              margin: 0;
            }
            
            .content {
              padding: 40px 30px;
            }
            
            .promo-box {
              background-color: #f0fdf4;
              border: 2px dashed #059669;
              border-radius: 12px;
              padding: 24px;
              margin: 24px 0;
              text-align: center;
            }
            
            .promo-code {
              font-size: 24px;
              font-weight: 700;
              color: #059669;
              background-color: white;
              padding: 12px 24px;
              border-radius: 8px;
              display: inline-block;
              margin: 12px 0;
              letter-spacing: 2px;
              border: 2px solid #059669;
            }
            
            .cta-button {
              display: inline-block;
              background-color: #059669;
              color: white !important;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
            }
            
            .footer {
              background-color: #f9fafb;
              padding: 30px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <div class="logo">🎉 Render Resume</div>
              <h1>${title}</h1>
              <p>專屬優惠代碼</p>
            </div>
            <div class="content">
              <p>親愛的 ${userName}，您好！</p>
              ${previewBody}
              <div class="promo-box">
                <h3 style="color: #059669; margin: 0 0 12px 0;">🎁 您的專屬優惠代碼</h3>
                <div class="promo-code">${mockPromoCode}</div>
                <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
                  請複製此代碼並在結帳時使用
                </p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://www.render-resume.com/settings" class="cta-button">立即使用優惠</a>
              </div>
            </div>
            <div class="footer">
              <p>優惠條款與細則請參考網站說明</p>
              <p>© 2025 Render Resume. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      setPreviewHtml(html);
      setPreviewMode(true);
    } catch (error) {
      toast.error("預覽郵件失敗");
      console.error(error);
    }
  };

  const handleSendEmails = async () => {
    if (selectedUsers.length === 0) {
      toast.error("請選擇至少一個收件人");
      return;
    }

    if (!title.trim()) {
      toast.error("請輸入郵件標題");
      return;
    }

    if (!body.trim()) {
      toast.error("請輸入郵件內容");
      return;
    }

    if (!promoConfig.plan_id) {
      toast.error("請選擇優惠方案");
      return;
    }

    const confirmed = window.confirm(
      `確定要發送促銷郵件給 ${selectedUsers.length} 位使用者嗎？每位使用者都會收到唯一的優惠代碼。`
    );

    if (!confirmed) return;

    setSending(true);
    try {
      const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
      
      const response = await fetch("/api/admin/email/batch-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          recipients: selectedUserData.map(user => ({
            email: user.email,
            username: user.display_name || user.email.split('@')[0]
          })),
          promoConfig
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "發送失敗");
      }

      toast.success(`成功發送 ${result.successCount} 封促銷郵件`);
      
      if (result.failedCount > 0) {
        toast.warning(`${result.failedCount} 封郵件發送失敗`);
      }

      // Show detailed results
      if (result.details) {
        const successfulEmails = result.details.filter((r: EmailResult) => r.success);
        console.log("成功發送的郵件:", successfulEmails);
      }

      // Clear selections
      setSelectedUsers([]);
      setTitle("");
      setBody("");
      
    } catch (error) {
      toast.error(`發送促銷郵件失敗: ${error instanceof Error ? error.message : "未知錯誤"}`);
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchLower) ||
      (user.display_name?.toLowerCase().includes(searchLower) || false)
    );
  });


  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          <Gift className="inline-block mr-2 w-8 h-8" />
          促銷郵件群發系統
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          向使用者發送包含專屬優惠代碼的促銷郵件
        </p>
      </div>

      {/* 統計資訊 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">總使用者數</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">已選擇</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-600">{stats.selectedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">將生成優惠碼</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.selectedCount > 0 ? `${stats.selectedCount} 個` : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側：收件人選擇 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="inline-block mr-2 w-5 h-5" />
              選擇收件人
            </CardTitle>
            <CardDescription>選擇要發送促銷郵件的使用者</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 搜尋和篩選 */}
            <div className="space-y-4 mb-4">
              <Input
                placeholder="搜尋使用者（姓名或 Email）"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="篩選使用者" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有使用者</SelectItem>
                  <SelectItem value="active">活躍使用者</SelectItem>
                  <SelectItem value="paid">付費使用者</SelectItem>
                  <SelectItem value="free">免費使用者</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 全選按鈕 */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading}
              >
                {selectedUsers.length === filteredUsers.length ? "取消全選" : "全選"}
              </Button>
              <span className="text-sm text-gray-500">
                共 {filteredUsers.length} 位使用者
              </span>
            </div>

            {/* 使用者列表 */}
            <ScrollArea className="h-[400px] border rounded-md p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  沒有找到使用者
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                    >
                      <Checkbox
                        id={user.id}
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <label
                        htmlFor={user.id}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <div className="font-medium">
                          {user.display_name || user.email}
                        </div>
                        <div className="text-gray-500">{user.email}</div>
                      </label>
                      {user.subscription && (
                        <Badge
                          variant={
                            user.subscription.plan_type === "free"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {user.subscription.plan_type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 右側：郵件內容和優惠設定 */}
        <div className="space-y-6">
          {/* 郵件內容 */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Mail className="inline-block mr-2 w-5 h-5" />
                郵件內容
              </CardTitle>
              <CardDescription>設定促銷郵件的標題和內容</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">郵件標題</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="輸入促銷郵件標題"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">
                  郵件內容
                  <span className="text-sm text-gray-500 ml-2">
                    （支援用戶變數和 HTML）
                  </span>
                </Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="輸入郵件內容，支援以下變數：&#10;{{user.email}} - 使用者信箱&#10;{{user.display_name}} - 使用者姓名&#10;{{user.id}} - 使用者 ID&#10;{{user.created_at}} - 註冊日期&#10;{{user.avatar_url}} - 頭像網址&#10;{{promo_code}} - 優惠代碼（自動生成）"
                  rows={8}
                />
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>可用變數：</strong>
                    <ul className="mt-2 ml-4 list-disc text-sm">
                      <li><code>{'{{user.email}}'}</code> - 使用者信箱</li>
                      <li><code>{'{{user.display_name}}'}</code> - 使用者姓名</li>
                      <li><code>{'{{user.id}}'}</code> - 使用者 ID</li>
                      <li><code>{'{{user.created_at}}'}</code> - 註冊日期</li>
                      <li><code>{'{{promo_code}}'}</code> - 優惠代碼（自動生成）</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* 優惠代碼設定 */}
          <Card>
            <CardHeader>
              <CardTitle>
                <Gift className="inline-block mr-2 w-5 h-5" />
                優惠代碼設定
              </CardTitle>
              <CardDescription>設定優惠代碼的方案和使用條件</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>優惠方案</Label>
                <Select 
                  value={promoConfig.plan_id.toString()} 
                  onValueChange={(value) => 
                    setPromoConfig(prev => ({ ...prev, plan_id: parseInt(value) }))
                  }
                  disabled={plansLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={plansLoading ? "載入方案中..." : "選擇優惠方案"} />
                  </SelectTrigger>
                  <SelectContent>
                    {plansLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-500">載入方案中...</span>
                      </div>
                    ) : plans.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <span className="text-sm text-gray-500">沒有可用的方案</span>
                      </div>
                    ) : (
                      plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          <div>
                            <div className="font-medium">{plan.title || '未命名方案'}</div>
                            <div className="text-sm text-gray-500">
                              {plan.price ? `$${plan.price}` : '免費'} / {plan.type || '未知類型'} / {plan.daily_usage} 次/日
                            </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="single-use"
                  checked={promoConfig.single_use}
                  onCheckedChange={(checked) => 
                    setPromoConfig(prev => ({ ...prev, single_use: checked as boolean }))
                  }
                />
                <Label htmlFor="single-use" className="cursor-pointer">
                  限制單次使用
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expire-date">
                  <Calendar className="inline-block mr-1 w-4 h-4" />
                  到期日期（可選）
                </Label>
                <Input
                  id="expire-date"
                  type="date"
                  value={promoConfig.expire_date}
                  onChange={(e) => 
                    setPromoConfig(prev => ({ ...prev, expire_date: e.target.value }))
                  }
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-sm text-gray-500">
                  留空表示永不過期
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 操作按鈕 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!title || !body}
            >
              <Eye className="mr-2 w-4 h-4" />
              預覽郵件
            </Button>
            <Button
              onClick={handleSendEmails}
              disabled={
                sending ||
                selectedUsers.length === 0 ||
                !title ||
                !body ||
                !promoConfig.plan_id
              }
              className="flex-1"
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  發送中...
                </>
              ) : (
                <>
                  <Send className="mr-2 w-4 h-4" />
                  發送促銷郵件
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 預覽對話框 */}
      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>促銷郵件預覽</CardTitle>
                  <CardDescription>主旨: {title}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPreviewMode(false)}
                  className="ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>預覽說明：</strong>
                  <ul className="mt-2 ml-4 list-disc text-sm">
                    <li>預覽中的使用者資料和優惠代碼為範例</li>
                    <li>實際發送時，每位使用者都會收到唯一的優惠代碼</li>
                    <li>變數會自動替換為每位使用者的實際資料</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[500px] border-0"
                  title="Email Preview"
                />
              </div>
            </CardContent>
            <div className="flex-shrink-0 p-6 pt-0 flex justify-end space-x-2 border-t">
              <Button onClick={() => setPreviewMode(false)}>關閉預覽</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}