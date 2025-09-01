"use client";

import SmartChat from "@/components/smart-chat";
import ResumeEditorPreview from "@/components/smart-chat/resume-editor-preview";
import { Button } from "@/components/ui/button";
import { useResumeTemplate } from "@/hooks/use-resume-optimization";
import { getTemplateById } from "@/lib/config/resume-templates";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function SmartChatPage() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
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
    <div className="h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Two-pane layout: Chat on left, Resume editor on right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 min-h-0">
          {/* Left pane: Smart chat */}
          <div className="h-full min-h-0 flex items-center justify-center">
            <SmartChat
              analysisResult={analysisResult}
              onComplete={handleComplete}
              onSkip={handleSkip}
            />
          </div>

          {/* Right pane: Resume editor preview - Scrollable */}
          <div className="h-full overflow-y-auto pl-2 min-h-0">
            <ResumeEditorPreview
              template={currentTemplate}
              className="h-full"
            />
          </div>
        </div>

        {/* Completion state */}
        {isCompleted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                優化完成！
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                您的履歷已經過 AI 優化，可以查看結果或繼續編輯。
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => router.push('/results')}>
                  查看結果
                </Button>
                <Button variant="outline" onClick={() => setIsCompleted(false)}>
                  繼續編輯
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/results')}
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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
    </div>
  );
} 