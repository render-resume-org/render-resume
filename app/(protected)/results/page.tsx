"use client";

import { AnalysisScores } from "@/components/analysis-scores";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { UnifiedResultsDetailedSections } from '@/components/analysis/unified-results-detailed-sections';
import type { AnalysisScore } from '@/components/analysis/types';

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

  const allSkills = useMemo(() => {
    if (!analysisResult) return [] as string[];
    const s1 = analysisResult.resume.skills?.flatMap(s => s.items || []) || [];
    const s2 = analysisResult.resume.projects?.flatMap(p => p.technologies || []) || [];
    return Array.from(new Set([...s1, ...s2]));
  }, [analysisResult]);

  const analysisScores: AnalysisScore[] = (analysisResult?.scores || []) as unknown as AnalysisScore[];

  if (isLoading) {
    return null;
  }

  if (!analysisResult) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">履歷分析結果</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">AI 深度分析您的履歷內容，提供專業評分與改進建議</p>
        </div>

        <div className="mb-12">
          <AnalysisScores scores={analysisScores} />
        </div>

        <UnifiedResultsDetailedSections analysisResult={analysisResult} allSkills={allSkills} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => router.push('/analyze')}
            className="flex items-center order-1 md:order-none"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    </div>
  );
} 