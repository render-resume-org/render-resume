"use client";

import { ActionSidebar } from "@/components/preview/action-sidebar";
import ResumePreview from "@/components/preview/resume-preview";
import { Button } from "@/components/ui/button";
import { useResumeCopy, useResumeTemplate } from "@/hooks/use-resume-optimization";
import { getTemplateById } from "@/lib/config/resume-templates";
import { mapOptimizedToUnified } from "@/utils/optimized-to-unified";
import { mapUnifiedToOptimized } from "@/utils/unified-to-optimized";
import type { OptimizedResume } from "@/types/resume";
import type { UnifiedResume } from "@/types/resume-unified";
import { FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from "sonner";

export default function DownloadPage() {
  const router = useRouter();
  const [resumeData, setResumeData] = useState<OptimizedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentTemplateId, 
    updateTemplateId 
  } = useResumeTemplate();

  // 確保模板ID有預設值
  const templateId = currentTemplateId || 'standard';
  
  const { 
    copySuccess, 
    copyResumeText 
  } = useResumeCopy();

  // 載入履歷數據從 sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('resume');
    if (stored) {
      try {
        const parsed: UnifiedResume = JSON.parse(stored);
        setResumeData(mapUnifiedToOptimized(parsed));
      } catch (e) {
        console.error('Error parsing resume data:', e);
      }
    } else {
      router.push('/service-selection');
    }
    setIsLoading(false);
  }, [router]);

  // 更新履歷數據並同步到 sessionStorage
  const updateResumeData = useCallback((updatedResume: OptimizedResume) => {
    setResumeData(updatedResume);
    // 轉換回 UnifiedResume 格式並保存
    const updatedUnified = mapOptimizedToUnified(updatedResume);
    try {
      sessionStorage.setItem('resume', JSON.stringify(updatedUnified));
    } catch (e) {
      console.error('Error saving resume data:', e);
    }
  }, []);

  const handleCopyResumeText = async () => {
    if (!resumeData) return;

    try {
      await copyResumeText();
      toast.success("履歷文字已複製到剪貼簿！");
    } catch {
      toast.error("複製失敗，請手動選擇文字複製");
    }
  };

  const currentTemplate = getTemplateById(templateId);
  
  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            載入履歷中...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            請稍候
          </p>
        </div>
      </div>
    );
  }

  // 如果沒有履歷數據，顯示錯誤狀態
  if (!resumeData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 py-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            履歷數據未找到
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            請重新開始流程或回到智能對話頁面。
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/smart-chat')}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              回到智能對話
            </Button>
            <Button 
              onClick={() => router.push('/service-selection')}
              variant="outline"
              className="w-full"
            >
              重新開始
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8">
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">結果總覽</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">履歷生成結果</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">檢視您的履歷，選擇不同模板並下載最終版本</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
          {/* Sidebar - Controls */}
          <div className="lg:w-96">
            <ActionSidebar
              currentTemplateId={templateId}
              onTemplateChange={updateTemplateId}
              copySuccess={copySuccess}
              onCopy={handleCopyResumeText}
            />
          </div>

          {/* Main Content - Resume Preview */}
          <div className="lg:flex-1">
            <div className="flex justify-center">
              {/* A4 寬度 preview，高度根據內容自然延伸 */}
              <div className="w-full flex justify-center">
                <ResumePreview 
                  resumeData={resumeData} 
                  template={currentTemplate} 
                  onUpdateResume={updateResumeData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 