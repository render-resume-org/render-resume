"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { availableTemplates } from "@/features/resume/lib/resume-templates";
import { PdfGenerator } from "@/services/pdf-generator";
import { cn } from "@/utils";
import { Copy, Download, Edit, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionSidebarProps {
  currentTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  copySuccess: boolean;
  onCopy: () => void;
}

export function ActionSidebar({
  currentTemplateId,
  onTemplateChange,
  copySuccess,
  onCopy,
}: ActionSidebarProps) {
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    
    try {
      await PdfGenerator.generate({
        filename: `我的履歷.pdf`,
      });
    } catch (error) {
      // 錯誤處理已在 PdfGenerator 中統一處理
      console.error('PDF 下載失敗:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">選擇模板</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentTemplateId} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="選擇一個模板" defaultValue="standard" />
            </SelectTrigger>
            <SelectContent>
              {availableTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">快速操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                下載 PDF
              </>
            )}
          </Button>

          <Button
            onClick={onCopy}
            variant={copySuccess ? "default" : "outline"}
            className={cn(
              "w-full",
              copySuccess
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
            disabled={copySuccess}
          >
            <Copy className="w-4 h-4 mr-2" />
            {copySuccess ? "已複製！" : "複製履歷文字"}
          </Button>

          <Button
            onClick={() => router.push("/smart-chat")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Edit className="w-4 h-4 mr-2" />
            返回編輯器
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <UserCircle className="w-4 h-4 mr-2" />
            返回儀表板
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 