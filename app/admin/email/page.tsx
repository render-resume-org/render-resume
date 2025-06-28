"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mail, Users, Send, Eye, AlertCircle } from "lucide-react";

interface User {
  id: string;
  display_name: string | null;
  email: string;
  subscription?: {
    plan_type: string;
    is_active: boolean;
  };
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
}

// 預設的郵件模板
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "announcement",
    name: "系統公告",
    subject: "📢 Render Resume 系統公告",
    description: "用於發送系統更新、新功能通知等公告"
  },
  {
    id: "feature_update",
    name: "功能更新",
    subject: "🚀 Render Resume 新功能上線！",
    description: "通知用戶新功能發布和產品更新"
  },
  {
    id: "promotion",
    name: "優惠活動",
    subject: "🎉 限時優惠！升級您的 Render Resume 方案",
    description: "推廣付費方案和特別優惠"
  },
  {
    id: "newsletter",
    name: "電子報",
    subject: "📰 Render Resume 月刊 - 履歷技巧與職涯洞察",
    description: "定期發送履歷撰寫技巧和職涯建議"
  },
  {
    id: "custom",
    name: "自訂郵件",
    subject: "",
    description: "自行撰寫郵件內容"
  }
];

export default function EmailPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("announcement");
  const [customSubject, setCustomSubject] = useState("");
  const [customContent, setCustomContent] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [showRealtimePreview, setShowRealtimePreview] = useState(false);
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

  // 載入使用者列表
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 更新統計數據
  useEffect(() => {
    setStats({
      totalUsers: users.length,
      selectedCount: selectedUsers.length
    });
  }, [users, selectedUsers]);

  // 即時預覽效果
  useEffect(() => {
    if (showRealtimePreview && customSubject) {
      const timer = setTimeout(async () => {
        try {
          const response = await fetch("/api/admin/email/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateId: selectedTemplate,
              subject: customSubject,
              content: customContent,
              sampleUser: users[0] || { email: "user@example.com", display_name: "測試用戶" }
            })
          });

          if (response.ok) {
            const { html } = await response.json();
            setPreviewHtml(html);
          }
        } catch (error) {
          console.error("即時預覽失敗:", error);
        }
      }, 500); // 延遲 500ms 避免頻繁更新
      return () => clearTimeout(timer);
    }
  }, [customSubject, customContent, selectedTemplate, showRealtimePreview, users]);

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

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      if (template.id === "custom") {
        setCustomSubject("");
        setCustomContent("");
      } else {
        setCustomSubject(template.subject);
        // 保留現有內容，讓使用者可以自訂
      }
    }
  };

  const handlePreview = async () => {
    try {
      const response = await fetch("/api/admin/email/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate,
          subject: customSubject,
          content: customContent,
          sampleUser: users[0] || { email: "user@example.com", display_name: "測試用戶" }
        })
      });

      if (!response.ok) throw new Error("預覽失敗");
      
      const { html } = await response.json();
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

    if (!customSubject) {
      toast.error("請輸入郵件主旨");
      return;
    }

    // 自訂模板必須有內容
    if (selectedTemplate === "custom" && !customContent) {
      toast.error("自訂郵件必須輸入內容");
      return;
    }

    const confirmed = window.confirm(
      `確定要發送郵件給 ${selectedUsers.length} 位使用者嗎？`
    );

    if (!confirmed) return;

    setSending(true);
    try {
      const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
      
      const response = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: selectedUserData,
          templateId: selectedTemplate,
          subject: customSubject,
          content: customContent
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "發送失敗");
      }

      toast.success(`成功發送 ${result.successCount} 封郵件`);
      
      if (result.failedCount > 0) {
        toast.warning(`${result.failedCount} 封郵件發送失敗`);
      }

      // 清空選擇
      setSelectedUsers([]);
      
    } catch (error) {
      toast.error(`發送郵件失敗: ${error instanceof Error ? error.message : "未知錯誤"}`);
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

  const currentTemplate = EMAIL_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          <Mail className="inline-block mr-2 w-8 h-8" />
          郵件群發系統
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          向使用者發送系統郵件、公告和行銷內容
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
            <CardTitle className="text-sm font-medium">預計發送</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.selectedCount > 0 ? `${stats.selectedCount} 封` : "-"}
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
            <CardDescription>選擇要發送郵件的使用者</CardDescription>
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

        {/* 右側：郵件內容 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Mail className="inline-block mr-2 w-5 h-5" />
              郵件內容
            </CardTitle>
            <CardDescription>選擇模板或自訂郵件內容</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 模板選擇 */}
            <div className="space-y-2">
              <Label>郵件模板</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇郵件模板" />
                </SelectTrigger>
                <SelectContent>
                  {EMAIL_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-500">
                          {template.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 郵件主旨 */}
            <div className="space-y-2">
              <Label htmlFor="subject">郵件主旨</Label>
              <Input
                id="subject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="輸入郵件主旨"
              />
            </div>

            {/* 郵件內容 */}
            <div className="space-y-2">
              <Label htmlFor="content">
                郵件內容
                {selectedTemplate !== "custom" && (
                  <span className="text-sm text-gray-500 ml-2">
                    （可自訂模板內容）
                  </span>
                )}
              </Label>
              <Textarea
                id="content"
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                placeholder={
                  selectedTemplate === "custom" 
                    ? "輸入郵件內容（支援 HTML）" 
                    : "輸入自訂內容來替換預設模板內容（支援 HTML），留空使用預設內容"
                }
                rows={10}
              />
              <p className="text-sm text-gray-500 mt-2">
                提示：系統會自動在郵件開頭加上「親愛的 [收件人姓名]，您好！」
                <br />
                姓名會根據每位使用者的 Display Name 自動調整（若無則使用 Email 帳號名稱）
              </p>
            </div>

            {/* 即時預覽開關 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="realtime-preview"
                checked={showRealtimePreview}
                onCheckedChange={(checked) => setShowRealtimePreview(checked as boolean)}
              />
              <Label htmlFor="realtime-preview" className="cursor-pointer">
                啟用即時預覽
              </Label>
            </div>

            {/* 模板說明 */}
            {selectedTemplate !== "custom" && currentTemplate && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{currentTemplate.name}</strong>: {currentTemplate.description}
                </AlertDescription>
              </Alert>
            )}

            {/* 操作按鈕 */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!customSubject || (selectedTemplate === "custom" && !customContent)}
              >
                <Eye className="mr-2 w-4 h-4" />
                預覽郵件
              </Button>
              <Button
                onClick={handleSendEmails}
                disabled={
                  sending ||
                  selectedUsers.length === 0 ||
                  !customSubject ||
                  (selectedTemplate === "custom" && !customContent)
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
                    發送郵件
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 即時預覽面板 */}
      {showRealtimePreview && previewHtml && (
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Eye className="inline-block mr-2 w-5 h-5" />
                郵件預覽
              </CardTitle>
              <CardDescription>主旨: {customSubject}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>預覽說明：</strong>
                  <ul className="mt-2 ml-4 list-disc text-sm">
                    <li>預覽中的收件人名稱為範例（{users[0]?.display_name || users[0]?.email?.split('@')[0] || "測試用戶"}）</li>
                    <li>實際發送時，系統會自動替換為每位收件人的名稱</li>
                    <li>名稱優先使用 Display Name，若無則使用 Email 帳號名稱</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[600px] border-0"
                  title="Email Preview"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 預覽對話框（手動預覽時使用） */}
      {previewMode && !showRealtimePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>郵件預覽</CardTitle>
              <CardDescription>主旨: {customSubject}</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>預覽說明：</strong>
                  <ul className="mt-2 ml-4 list-disc text-sm">
                    <li>預覽中的收件人名稱為範例（{users[0]?.display_name || users[0]?.email?.split('@')[0] || "測試用戶"}）</li>
                    <li>實際發送時，系統會自動替換為每位收件人的名稱</li>
                    <li>名稱優先使用 Display Name，若無則使用 Email 帳號名稱</li>
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
            <div className="p-6 pt-0">
              <Button onClick={() => setPreviewMode(false)}>關閉預覽</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}