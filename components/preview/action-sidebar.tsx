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
import type { OptimizationSuggestion } from "@/lib/types/resume";
import { cn } from "@/lib/utils";
import { Copy, Edit, Printer, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionSidebarProps {
  currentTemplateId: string;
  onTemplateChange: (templateId: string) => void;
  copySuccess: boolean;
  onCopy: () => void;
  selectedSuggestions: OptimizationSuggestion[];
}

export function ActionSidebar({
  currentTemplateId,
  onTemplateChange,
  copySuccess,
  onCopy,
  selectedSuggestions,
}: ActionSidebarProps) {
  const router = useRouter();

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">選擇模板</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentTemplateId} onValueChange={onTemplateChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇一個模板" />
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
            onClick={() => window.print()}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            列印/下載 PDF
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