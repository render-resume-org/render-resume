"use client";

// import { AnalysisScores } from "@/components/analysis-scores";
// import type { AnalysisScore } from '@/components/analysis/types';
import { UnifiedResultsDetailedSections } from '@/components/analysis/unified-results-detailed-sections';
import { ScoreSummaryCard } from '@/components/analysis/score-summary-card';
import ResumePreview from '@/components/preview/resume-preview';
import { Button } from "@/components/ui/button";
import { getTemplateById } from '@/lib/config/resume-templates';
import { mapUnifiedToOptimized } from '@/lib/mappers/unified-to-optimized';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { ArrowLeft } from "lucide-react";
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

  // Aggregated skills no longer used directly in this page (preview component renders sections)

  // const analysisScores: AnalysisScore[] = (analysisResult?.scores || []) as unknown as AnalysisScore[];
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

        {/* AI 評分結果卡片 */}
        <ScoreSummaryCard analysisResult={analysisResult} />

        {/*
        <section className="mb-10">
          <AnalysisScores scores={analysisScores} />
        </section>
        */}

        {/* Resume Preview (same component used in Preview page) */}
        {previewData && (
          <section className="mb-10">
            <div className="flex justify-center">
              <ResumePreview resumeData={previewData} template={template} editable={false} analysisResult={analysisResult} />
            </div>
          </section>
        )}

        {/* Highlights + Issues etc. */}
        <section>
          <UnifiedResultsDetailedSections analysisResult={analysisResult} hideResumeCard />
        </section>

        <div className="mt-12 flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/analyze')}
            className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    </div>
  );
} 