"use client";

import SmartChat from "@/features/smart-chat/components/smart-chat";
import PreviewActionPanel from "@/features/smart-chat/components/smart-chat/preview-action-panel";
import ResumeEditorPreview from "@/features/smart-chat/components/smart-chat/resume-editor-preview";
import { NavigationButton } from "@/components/common/navigation-button";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useResumeTemplate } from "@/hooks/use-resume-optimization";
import { getTemplateById } from "@/lib/config/resume-templates";
import { ResumeAnalysisResult } from "@/types/resume-analysis";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SmartChatPage() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const router = useRouter();
  
  // Hook: resume template for left-side preview
  const { currentTemplateId } = useResumeTemplate();
  const currentTemplate = getTemplateById(currentTemplateId);

  // Load analysis result from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analysisResult');
      if (stored) {
        const parsed = JSON.parse(stored) as ResumeAnalysisResult;
        setAnalysisResult(parsed);
      }
    } catch (error) {
      console.error('Failed to load analysis result:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle completion
  const handleComplete = useCallback(() => {
    setIsCompleted(true);
  }, []);

  // Handle skip
  const handleSkip = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // Listen for preview state changes from the resume editor
  useEffect(() => {
    const handlePreviewStateChange = (event: CustomEvent) => {
      setIsPreviewing(event.detail.isPreviewing);
    };

    document.addEventListener('resume-preview-state-change', handlePreviewStateChange as EventListener);
    return () => {
      document.removeEventListener('resume-preview-state-change', handlePreviewStateChange as EventListener);
    };
  }, []);

  // Handle preview actions
  const handleAcceptPreview = useCallback(() => {
    document.dispatchEvent(new CustomEvent('resume-preview-accept'));
  }, []);

  const handleRejectPreview = useCallback(() => {
    document.dispatchEvent(new CustomEvent('resume-preview-reject'));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
        <span className="ml-2 text-sm text-gray-600">載入中...</span>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">尚未有分析結果</p>
          <Button onClick={() => router.push('/service-selection')}>
            開始分析履歷
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - var(--app-header-height, 56px))' }}>
      {/* Main content area: seamless, no padding/margins */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Chat */}
          <ResizablePanel defaultSize={50} minSize={25} maxSize={60} className="h-full">
            <div className="h-full w-full">
              <SmartChat
                analysisResult={analysisResult}
                onComplete={handleComplete}
                onSkip={handleSkip}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-200 dark:bg-gray-800" />

          {/* Right: Resume editor */}
          <ResizablePanel defaultSize={50} minSize={40} className="h-full">
            <div className="h-full relative">
              <div className="absolute inset-0 overflow-auto">
                <ResumeEditorPreview
                  template={currentTemplate}
                  className="h-full"
                />
              </div>
              {isPreviewing && (
                <PreviewActionPanel
                  onAccept={handleAcceptPreview}
                  onReject={handleRejectPreview}
                />
              )}
              {/* Right-panel navigation */}
              <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
                <div className="pointer-events-auto">
                  <NavigationButton direction="left" route="/results" text="返回分析結果" />
                </div>
                <div className="pointer-events-auto">
                  <NavigationButton direction="right" route="/download" text="完成履歷編輯" />
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      

      {isCompleted && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              優化完成！
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              您的履歷已經過 AI 優化，可以查看結果或繼續編輯。
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/results')}>查看結果</Button>
              <Button variant="outline" onClick={() => setIsCompleted(false)}>繼續編輯</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 