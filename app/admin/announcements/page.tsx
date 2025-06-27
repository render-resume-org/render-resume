"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Info,
  Loader2,
  Plus,
  RefreshCw,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as Announcement['type'],
    is_active: true
  });

  // 加載公告數據
  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/announcements');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '獲取公告失敗');
      }
      
      setAnnouncements(data.announcements);
    } catch (error) {
      console.error('Load announcements error:', error);
      toast.error(error instanceof Error ? error.message : '獲取公告失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // 創建公告
  const handleCreateAnnouncement = async () => {
    try {
      setActionLoading('create');
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '創建公告失敗');
      }

      setAnnouncements(prev => [data.announcement, ...prev]);
      setIsCreateModalOpen(false);
      setFormData({ title: "", content: "", type: "info", is_active: true });
      toast.success('公告創建成功');
    } catch (error) {
      console.error('Create announcement error:', error);
      toast.error(error instanceof Error ? error.message : '創建公告失敗');
    } finally {
      setActionLoading(null);
    }
  };

  // 更新公告
  const handleEditAnnouncement = async () => {
    if (!editingAnnouncement) return;

    try {
      setActionLoading('edit');
      const response = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAnnouncement.id,
          ...formData,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新公告失敗');
      }

      setAnnouncements(prev =>
        prev.map(ann =>
          ann.id === editingAnnouncement.id ? data.announcement : ann
        )
      );
      setEditingAnnouncement(null);
      setFormData({ title: "", content: "", type: "info", is_active: true });
      toast.success('公告更新成功');
    } catch (error) {
      console.error('Edit announcement error:', error);
      toast.error(error instanceof Error ? error.message : '更新公告失敗');
    } finally {
      setActionLoading(null);
    }
  };

  // 刪除公告
  const handleDeleteAnnouncement = async (id: string) => {
    try {
      setActionLoading(`delete-${id}`);
      const response = await fetch(`/api/admin/announcements?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '刪除公告失敗');
      }

      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      toast.success('公告刪除成功');
    } catch (error) {
      console.error('Delete announcement error:', error);
      toast.error(error instanceof Error ? error.message : '刪除公告失敗');
    } finally {
      setActionLoading(null);
    }
  };

  // 切換公告狀態
  const toggleAnnouncementStatus = async (announcement: Announcement) => {
    try {
      setActionLoading(`toggle-${announcement.id}`);
      const response = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          type: announcement.type,
          is_active: !announcement.is_active,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '更新公告狀態失敗');
      }

      setAnnouncements(prev =>
        prev.map(ann =>
          ann.id === announcement.id ? data.announcement : ann
        )
      );
      toast.success('公告狀態更新成功');
    } catch (error) {
      console.error('Toggle announcement error:', error);
      toast.error(error instanceof Error ? error.message : '更新公告狀態失敗');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      is_active: announcement.is_active
    });
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: "", content: "", type: "info", is_active: true });
  };

  const getTypeIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'success':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-TW');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">公告管理</h1>
            <p className="text-gray-600">管理系統公告和重要通知</p>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>公告列表</CardTitle>
            <CardDescription>管理所有系統公告</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-96" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 頁面標題和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">公告管理</h1>
          <p className="text-gray-600">管理系統公告和重要通知</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadAnnouncements} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            重新整理
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                新增公告
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>新增系統公告</DialogTitle>
                <DialogDescription>
                  建立一個新的系統公告，將會顯示給所有用戶。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">公告標題</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="輸入公告標題"
                  />
                </div>
                <div>
                  <Label htmlFor="content">公告內容</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="輸入公告內容"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="type">公告類型</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: Announcement['type']) => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">一般資訊</SelectItem>
                      <SelectItem value="warning">警告通知</SelectItem>
                      <SelectItem value="success">成功消息</SelectItem>
                      <SelectItem value="error">錯誤警告</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active">立即發布</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeModal}>
                  取消
                </Button>
                <Button 
                  onClick={handleCreateAnnouncement}
                  disabled={!formData.title || !formData.content || actionLoading === 'create'}
                >
                  {actionLoading === 'create' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      創建中...
                    </>
                  ) : (
                    '建立公告'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              總公告數
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{announcements.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              已發布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {announcements.filter(a => a.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <EyeOff className="h-4 w-4" />
              草稿
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {announcements.filter(a => !a.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              重要通知
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {announcements.filter(a => a.type === 'warning' && a.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 公告列表 */}
      <Card>
        <CardHeader>
          <CardTitle>公告列表</CardTitle>
          <CardDescription>管理所有系統公告</CardDescription>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暫無公告數據，請創建第一個公告
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>標題</TableHead>
                  <TableHead>類型</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>作者</TableHead>
                  <TableHead>建立時間</TableHead>
                  <TableHead>更新時間</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {announcement.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(announcement.type)} className="flex items-center gap-1 w-fit">
                        {getTypeIcon(announcement.type)}
                        {announcement.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={announcement.is_active ? "default" : "secondary"}>
                        {announcement.is_active ? "已發布" : "草稿"}
                      </Badge>
                    </TableCell>
                    <TableCell>{announcement.author}</TableCell>
                    <TableCell>{formatDate(announcement.created_at)}</TableCell>
                    <TableCell>{formatDate(announcement.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnnouncementStatus(announcement)}
                          disabled={actionLoading === `toggle-${announcement.id}`}
                        >
                          {actionLoading === `toggle-${announcement.id}` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : announcement.is_active ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Dialog open={editingAnnouncement?.id === announcement.id} onOpenChange={(open) => {
                          if (!open) closeModal();
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(announcement)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>編輯公告</DialogTitle>
                              <DialogDescription>
                                修改公告內容和設定。
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="edit-title">公告標題</Label>
                                <Input
                                  id="edit-title"
                                  value={formData.title}
                                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="輸入公告標題"
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-content">公告內容</Label>
                                <Textarea
                                  id="edit-content"
                                  value={formData.content}
                                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                  placeholder="輸入公告內容"
                                  rows={4}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-type">公告類型</Label>
                                <Select 
                                  value={formData.type} 
                                  onValueChange={(value: Announcement['type']) => 
                                    setFormData(prev => ({ ...prev, type: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="info">一般資訊</SelectItem>
                                    <SelectItem value="warning">警告通知</SelectItem>
                                    <SelectItem value="success">成功消息</SelectItem>
                                    <SelectItem value="error">錯誤警告</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-is_active"
                                  checked={formData.is_active}
                                  onCheckedChange={(checked) => 
                                    setFormData(prev => ({ ...prev, is_active: checked }))
                                  }
                                />
                                <Label htmlFor="edit-is_active">立即發布</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={closeModal}>
                                取消
                              </Button>
                              <Button 
                                onClick={handleEditAnnouncement}
                                disabled={!formData.title || !formData.content || actionLoading === 'edit'}
                              >
                                {actionLoading === 'edit' ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    更新中...
                                  </>
                                ) : (
                                  '更新公告'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700"
                              disabled={actionLoading === `delete-${announcement.id}`}
                            >
                              {actionLoading === `delete-${announcement.id}` ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確認刪除公告</AlertDialogTitle>
                              <AlertDialogDescription>
                                您確定要刪除公告「{announcement.title}」嗎？此操作無法復原。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 