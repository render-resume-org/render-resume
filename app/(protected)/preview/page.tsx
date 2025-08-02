"use client";

import { ActionSidebar } from "@/components/preview/action-sidebar";
import ResumePreview from "@/components/preview/resume-preview";
import { Button } from "@/components/ui/button";
import { useResumeCopy, useResumeOptimization, useResumeTemplate } from "@/hooks/use-resume-optimization";
import { getTemplateById } from "@/lib/config/resume-templates";
import { FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function PreviewPage() {
  const router = useRouter();
  
  // 使用自定義 hooks
  const { 
    isGenerating, 
    resumeData, 
    updateResumeData 
  } = useResumeOptimization();
  
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
  
  // 如果正在生成履歷，顯示加載畫面
  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            AI 正在優化您的履歷...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            請稍候，這可能需要幾秒鐘時間
          </p>
        </div>
      </div>
    );
  }

  // 如果沒有履歷數據，顯示錯誤狀態
  if (!resumeData) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            履歷數據未找到
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            請返回上一步選擇優化建議，或重新開始流程。
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push('/suggestions')}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              返回建議選擇
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
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          {/* <div className="flex justify-center mb-4">
            <span className="text-5xl">✨</span>
          </div> */}
          {/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 優化履歷
          </h1> */}
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            基於 Remo 與您的對話優化的專業履歷，您可以進一步編輯和下載。
          </p>
        </div>

        <div className="flex md:flex-row flex-col justify-center items-center md:items-start gap-8">
          {/* Sidebar - Controls */}
          <ActionSidebar
            currentTemplateId={templateId}
            onTemplateChange={updateTemplateId}
            copySuccess={copySuccess}
            onCopy={handleCopyResumeText}
          />

          {/* Main Content - Resume Preview */}
          <div className="lg:col-span-3">
            <div className="flex justify-center">
              <ResumePreview 
                resumeData={resumeData} 
                template={currentTemplate} 
                onUpdateResume={updateResumeData}
              />
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => router.push('/dashboard')}
            size="lg"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
          >
            返回儀表板
          </Button>
        </div>
      </div>
    </div>
  );
} 