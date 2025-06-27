"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Database,
  Globe,
  Mail,
  Palette,
  RefreshCw,
  Save,
  Settings,
  Shield
} from "lucide-react";
import { useState } from "react";

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    maintenanceMode: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    requireEmailVerification: boolean;
    enableTwoFactor: boolean;
  };
  features: {
    enableRegistration: boolean;
    enableGoogleAuth: boolean;
    enableGitHubAuth: boolean;
    maxTemplatesPerUser: number;
    maxExportsPerDay: number;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "RenderResume",
      siteDescription: "專業履歷生成平台",
      contactEmail: "support@renderresume.com",
      maintenanceMode: false,
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: "587",
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@renderresume.com",
      fromName: "RenderResume",
    },
    security: {
      maxLoginAttempts: 5,
      sessionTimeout: 24,
      requireEmailVerification: true,
      enableTwoFactor: false,
    },
    features: {
      enableRegistration: true,
      enableGoogleAuth: true,
      enableGitHubAuth: true,
      maxTemplatesPerUser: 10,
      maxExportsPerDay: 20,
    },
  });

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setSaving(true);
    // 這裡應該調用 API 保存設定
    setTimeout(() => {
      setSaving(false);
      // 顯示成功消息
    }, 1000);
  };

  const updateSettings = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">系統設定</h1>
          <p className="text-gray-600">配置系統參數和功能設定</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          儲存設定
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            一般設定
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            郵件設定
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            安全設定
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            功能設定
          </TabsTrigger>
        </TabsList>

        {/* 一般設定 */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                網站基本資訊
              </CardTitle>
              <CardDescription>
                配置網站的基本資訊和顯示設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">網站名稱</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">聯絡信箱</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSettings('general', 'contactEmail', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">網站描述</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>維護模式</Label>
                  <p className="text-sm text-gray-500">
                    啟用後，網站將顯示維護頁面
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.general.maintenanceMode && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      維護中
                    </Badge>
                  )}
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(checked) => updateSettings('general', 'maintenanceMode', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 郵件設定 */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                SMTP 配置
              </CardTitle>
              <CardDescription>
                配置系統郵件發送設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpHost">SMTP 主機</Label>
                  <Input
                    id="smtpHost"
                    value={settings.email.smtpHost}
                    onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPort">SMTP 端口</Label>
                  <Input
                    id="smtpPort"
                    value={settings.email.smtpPort}
                    onChange={(e) => updateSettings('email', 'smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtpUsername">SMTP 用戶名</Label>
                  <Input
                    id="smtpUsername"
                    value={settings.email.smtpUsername}
                    onChange={(e) => updateSettings('email', 'smtpUsername', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="smtpPassword">SMTP 密碼</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.email.smtpPassword}
                    onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromEmail">發送者信箱</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">發送者名稱</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                  />
                </div>
              </div>
              <div className="pt-4">
                <Button variant="outline">
                  測試郵件發送
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全設定 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                安全策略
              </CardTitle>
              <CardDescription>
                配置用戶認證和安全相關設定
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxLoginAttempts">最大登入嘗試次數</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">會話超時 (小時)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>要求信箱驗證</Label>
                    <p className="text-sm text-gray-500">
                      新用戶註冊後需要驗證信箱才能使用
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateSettings('security', 'requireEmailVerification', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>啟用雙因子認證</Label>
                    <p className="text-sm text-gray-500">
                      為管理員帳戶啟用雙因子認證
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => updateSettings('security', 'enableTwoFactor', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 功能設定 */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                功能控制
              </CardTitle>
              <CardDescription>
                控制系統功能的啟用狀態和限制
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>開放註冊</Label>
                    <p className="text-sm text-gray-500">
                      允許新用戶註冊帳戶
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.enableRegistration}
                    onCheckedChange={(checked) => updateSettings('features', 'enableRegistration', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Google 登入</Label>
                    <p className="text-sm text-gray-500">
                      啟用 Google OAuth 登入
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.enableGoogleAuth}
                    onCheckedChange={(checked) => updateSettings('features', 'enableGoogleAuth', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>GitHub 登入</Label>
                    <p className="text-sm text-gray-500">
                      啟用 GitHub OAuth 登入
                    </p>
                  </div>
                  <Switch
                    checked={settings.features.enableGitHubAuth}
                    onCheckedChange={(checked) => updateSettings('features', 'enableGitHubAuth', checked)}
                  />
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxTemplatesPerUser">每用戶最大模板數</Label>
                  <Input
                    id="maxTemplatesPerUser"
                    type="number"
                    value={settings.features.maxTemplatesPerUser}
                    onChange={(e) => updateSettings('features', 'maxTemplatesPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxExportsPerDay">每日最大導出次數</Label>
                  <Input
                    id="maxExportsPerDay"
                    type="number"
                    value={settings.features.maxExportsPerDay}
                    onChange={(e) => updateSettings('features', 'maxExportsPerDay', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 