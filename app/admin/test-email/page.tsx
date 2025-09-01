"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TestResult {
  type: 'html' | 'text' | 'json' | 'react' | 'test' | 'error';
  content: string;
}

export default function TestEmailPage() {
  const [email, setEmail] = useState("test@example.com");
  const [userName, setUserName] = useState("測試用戶");
  const [redeemCode, setRedeemCode] = useState("REDEEMCODE");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [previewType, setPreviewType] = useState<'html' | 'text' | 'json' | 'react'>('html');
  const [emailType, setEmailType] = useState<'waitlist' | 'beta-release'>('waitlist');

  const handlePreview = async () => {
    setLoading(true);
    try {
      // 如果是 React 預覽，使用專門的 API
      if (previewType === 'react') {
        const apiEndpoint = '/api/test-email-react-preview';
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            emailType,
            email,
            userName,
            redeemCode: emailType === 'beta-release' ? redeemCode : undefined,
          }),
        });
        
        const data = await response.json();
        if (data.html) {
          setResult({ type: 'react', content: data.html });
        } else {
          setResult({ type: 'error', content: data.error || 'React 預覽生成失敗' });
        }
      } else {
        // 原有的預覽邏輯
        const apiEndpoint = emailType === 'waitlist' ? '/api/test-waitlist-email' : '/api/test-beta-release-email';
        const params = new URLSearchParams({
          email: email,
          userName: userName,
          format: previewType
        });
        
        if (emailType === 'beta-release') {
          params.append('redeemCode', redeemCode);
        }
        
        const response = await fetch(`${apiEndpoint}?${params}`);
        
        if (previewType === 'json') {
          const data = await response.json();
          setResult({ type: 'json', content: JSON.stringify(data, null, 2) });
        } else {
          const content = await response.text();
          setResult({ type: previewType, content });
        }
      }
    } catch (error) {
      setResult({ type: 'error', content: `錯誤: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async (sendActualEmail = false) => {
    setLoading(true);
    try {
      const apiEndpoint = emailType === 'waitlist' ? '/api/test-waitlist-email' : '/api/test-beta-release-email';
      const requestBody: {
        email: string;
        userName: string;
        sendActualEmail: boolean;
        redeemCode?: string;
      } = {
        email,
        userName,
        sendActualEmail,
      };
      
      if (emailType === 'beta-release') {
        requestBody.redeemCode = redeemCode;
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      setResult({ type: 'test', content: JSON.stringify(data, null, 2) });
    } catch (error) {
      setResult({ type: 'error', content: `錯誤: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📧 郵件模板測試
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          測試和預覽不同類型的郵件模板
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <Card>
          <CardHeader>
            <CardTitle>🎛️ 測試控制面板</CardTitle>
            <CardDescription>
              配置測試參數並預覽郵件模板
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>郵件類型</Label>
              <div className="flex gap-2">
                <Button
                  variant={emailType === 'waitlist' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEmailType('waitlist')}
                >
                  Waitlist 歡迎信
                </Button>
                <Button
                  variant={emailType === 'beta-release' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEmailType('beta-release')}
                >
                  Beta 發布通知
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">用戶名稱</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="測試用戶"
              />
            </div>

            {emailType === 'beta-release' && (
              <div className="space-y-2">
                <Label htmlFor="redeemCode">兌換碼</Label>
                <Input
                  id="redeemCode"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  placeholder="REDEEMCODE"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>預覽格式</Label>
              <div className="flex gap-2 flex-wrap">
                {(['html', 'text', 'json', 'react'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={previewType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewType(type)}
                  >
                    {type.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                onClick={handlePreview}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                {loading ? "載入中..." : "🔍 預覽模板"}
              </Button>

              <Button
                onClick={() => handleTest(false)}
                disabled={loading}
                className="w-full"
                variant="secondary"
              >
                {loading ? "測試中..." : "🧪 測試模板"}
              </Button>

              <Button
                onClick={() => handleTest(true)}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-700"
              >
                {loading ? "發送中..." : "📤 發送測試郵件"}
              </Button>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
              <p>• <strong>預覽模板</strong>：僅顯示模板內容</p>
              <p>• <strong>測試模板</strong>：檢查模板生成是否正常</p>
              <p>• <strong>發送測試郵件</strong>：實際發送郵件到指定地址</p>
            </div>
          </CardContent>
        </Card>

        {/* 結果顯示 */}
        <Card>
          <CardHeader>
            <CardTitle>📋 結果顯示</CardTitle>
            <CardDescription>
              郵件模板預覽和測試結果
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    類型: {result.type}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResult(null)}
                  >
                    清除
                  </Button>
                </div>
                
                {result.type === 'html' || result.type === 'react' ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 text-xs text-gray-600 dark:text-gray-400 border-b">
                      {result.type === 'react' ? '⚛️ React 組件渲染' : '📄 HTML 模板'}
                    </div>
                    <iframe
                      srcDoc={result.content}
                      className="w-full h-96 border-0"
                      title="Email Preview"
                    />
                  </div>
                ) : (
                  <Textarea
                    value={result.content}
                    readOnly
                    className="min-h-96 font-mono text-sm"
                  />
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>選擇一個操作來查看結果</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 說明文檔 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>📖 使用說明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <h3>功能說明</h3>
            <ul>
              <li><strong>HTML 預覽</strong>：顯示完整的 HTML 郵件樣式</li>
              <li><strong>TEXT 預覽</strong>：顯示純文字版本的郵件內容</li>
              <li><strong>JSON 預覽</strong>：顯示郵件模板的結構化數據</li>
              <li><strong>React 預覽</strong>：顯示 React 組件渲染的郵件樣式（與實際發送一致）</li>
            </ul>
            
            <h3>API 端點</h3>
            <ul>
              <li><code>GET /api/test-waitlist-email</code>：預覽 Waitlist 歡迎郵件</li>
              <li><code>POST /api/test-waitlist-email</code>：測試 Waitlist 歡迎郵件</li>
              <li><code>GET /api/test-beta-release-email</code>：預覽 Beta 發布通知</li>
              <li><code>POST /api/test-beta-release-email</code>：測試 Beta 發布通知</li>
            </ul>
            
            <h3>郵件類型說明</h3>
            <ul>
              <li><strong>Waitlist 歡迎信</strong>：用戶加入等候名單時發送的歡迎郵件</li>
              <li><strong>Beta 發布通知</strong>：Beta 版本發布時向等候名單用戶發送的通知郵件，包含專屬兌換碼</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 