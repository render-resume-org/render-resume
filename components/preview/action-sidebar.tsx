"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { availableTemplates } from "@/lib/config/resume-templates";
import { PdfGenerator } from "@/lib/pdf-generator";
import type { OptimizationSuggestion } from "@/lib/types/resume";
import type { OptimizedResume } from "@/lib/types/resume";
import { cn } from "@/lib/utils";
import { Copy, Download, Edit, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ActionSidebarProps {
  currentTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  copySuccess: boolean;
  onCopy: () => void;
  selectedSuggestions: OptimizationSuggestion[];
  resumeData: OptimizedResume;
}

export function ActionSidebar({
  currentTemplateId,
  onTemplateChange,
  copySuccess,
  onCopy,
  selectedSuggestions,
  resumeData,
}: ActionSidebarProps) {
  const router = useRouter();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    
    try {
      await PdfGenerator.generate(resumeData, currentTemplateId, {
        filename: `履歷_${new Date().toISOString().slice(0, 10)}.pdf`,
      });
    } catch (error) {
      // 錯誤處理已在 PdfGenerator 中統一處理
      console.error('PDF 下載失敗:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
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
            onClick={() => router.push("/suggestions")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Edit className="w-4 h-4 mr-2" />
            返回建議
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <UserCircle className="w-4 h-4 mr-2" />
            返回首頁
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">已套用建議</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {selectedSuggestions.slice(0, 3).map((suggestion, index) => (
              <div key={index} className="text-sm">
                <Badge variant="secondary" className="text-xs mb-1">
                  {suggestion.category}
                </Badge>
                <p className="text-gray-600 dark:text-gray-300">
                  {suggestion.title}
                </p>
              </div>
            ))}
            {selectedSuggestions.length > 3 && (
              <p className="text-xs text-gray-500">
                和其他 {selectedSuggestions.length - 3} 個建議...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 