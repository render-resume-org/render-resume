"use client";

import SmartChat from "@/components/smart-chat";
import PreviewActionPanel from "@/components/smart-chat/preview-action-panel";
import ResumeEditorPreview from "@/components/smart-chat/resume-editor-preview";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useResumeTemplate } from "@/hooks/use-resume-optimization";
import { getTemplateById } from "@/lib/config/resume-templates";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
      {/* Main content area: seamless, no padding/margins */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Left: Chat */}
          <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="h-full">
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
          <ResizablePanel defaultSize={60} minSize={40} className="h-full">
            <div className="h-full relative">
              <div className="absolute inset-0 overflow-y-auto">
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
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Bottom navigation bar - keep minimal visual weight */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/results')}
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一步</span>
          </Button>
          <Button
            onClick={() => router.push('/download')}
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
          >
            <span>下一步</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
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