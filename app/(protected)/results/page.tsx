"use client";

import { ResumeScore, ResumeComment } from "@/components/analysis";
import { UnifiedResultsDetailedSections } from '@/components/analysis/unified-results-detailed-sections';
import ResumePreview from '@/components/preview/resume-preview';
import { Button } from "@/components/ui/button";
import { getTemplateById } from '@/lib/config/resume-templates';
import { mapUnifiedToOptimized } from '@/lib/mappers/unified-to-optimized';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { ArrowLeft, ArrowRight } from "lucide-react";
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
        <div className="mb-8">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">結果總覽</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">履歷分析結果</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">AI 深度分析您的履歷內容，提供專業評分與改進建議</p>
        </div>
        
        <section className="mb-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
            <div className="lg:w-fit">
              <ResumeScore score={analysisResult.scores} />
            </div>
            <div className="lg:flex-1">
              <ResumeComment comment={analysisResult.comment} />
            </div>
          </div>
        </section>

        {/* Resume Preview (same component used in Preview page) */}
        {previewData && (
          <section className="mb-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
              <div className="lg:flex-1">
                <ResumePreview resumeData={previewData} template={template} editable={false} analysisResult={analysisResult} />
              </div>
              <div className="lg:w-96">
                <UnifiedResultsDetailedSections analysisResult={analysisResult} hideResumeCard />
              </div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Button
            variant="outline"
            onClick={() => router.push('/analyze')}
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一步</span>
          </Button>
          <Button
            onClick={() => router.push('/smart-chat')}
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