"use client";

import { ResumeGrade, ResumeComment, ResumeHighlightsIssuesSection } from "@/features/resume/components";
import ResumePreview from '@/features/resume/components/resume-preview';
import { NavigationButton } from "@/components/common/navigation-button";
import { getTemplateById } from '@/features/resume/lib/resume-templates';
import { mapUnifiedToOptimized } from '@/utils/unified-to-optimized';
import type { UnifiedResumeAnalysisResult } from '@/features/resume/types/resume-unified';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<UnifiedResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (stored) {
      try {
        const result: UnifiedResumeAnalysisResult = JSON.parse(stored);
        setAnalysisResult(result);
      } catch (e) {
        console.error('Error parsing analysis result:', e);
      }
    } else {
      router.push('/service-selection');
    }
    setIsLoading(false);
  }, [router]);

  const previewData = analysisResult ? mapUnifiedToOptimized(analysisResult.resume) : null;
  const template = getTemplateById('standard');

  if (isLoading || !analysisResult) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">分析總覽</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">履歷分析結果</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">AI 深度分析您的履歷內容，提供專業評分與改進建議</p>
        </header>
        
        {/* Resume grade and comment */}
        <section className="mb-10 flex flex-col lg:flex-row gap-6 lg:items-stretch">
          <div className="lg:w-fit">
            <ResumeGrade grade={analysisResult.grade} />
          </div>
          <div className="lg:flex-1">
            <ResumeComment 
              comment={analysisResult.comment} 
              highlightsCount={analysisResult.highlights?.length || 0}
              issuesCount={analysisResult.issues?.length || 0}
            />
          </div>
        </section>

        {/* Resume Preview */}
        {previewData && (
          <section className="mb-10 flex flex-col lg:flex-row gap-6 lg:items-start">
            <div 
              className="lg:w-3/5"
              style={{ 
                transform: 'scale(0.8)', 
                transformOrigin: 'top left'
              }}
            >
              <ResumePreview resumeData={previewData} template={template} editable={false} analysisResult={analysisResult} />
            </div>
            <div className="lg:w-2/5">
              <ResumeHighlightsIssuesSection analysisResult={analysisResult} />
            </div>
          </section>
        )}

        {/* Navigation */}
        <nav className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <NavigationButton direction="left" route="/analyze" text="返回重新分析" />
          <NavigationButton direction="right" route="/smart-chat" text="開始優化履歷" />
        </nav>
      </div>
    </div>
  );
} 