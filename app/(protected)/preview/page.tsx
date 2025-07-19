"use client";

import { ActionSidebar } from "@/components/preview/action-sidebar";
import ResumePreview from "@/components/preview/resume-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getTemplateById } from "@/lib/config/resume-templates";
import { OptimizationSuggestion, OptimizedResume } from "@/lib/types/resume";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from "sonner";

export default function PreviewPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<OptimizedResume | null>(null);
  const [originalAnalysis, setOriginalAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('default');

  useEffect(() => {
    const loadData = async () => {
      const savedTemplateId = localStorage.getItem('selectedTemplateId') || 'default';
      setCurrentTemplateId(savedTemplateId);
      
      // 載入原始分析結果
      const analysisResult = sessionStorage.getItem('analysisResult');
      if (analysisResult) {
        try {
          const analysis: ResumeAnalysisResult = JSON.parse(analysisResult);
          setOriginalAnalysis(analysis);
        } catch (error) {
          console.error('Error parsing analysis result:', error);
        }
      }

      // 載入選中的建議
      const suggestions = localStorage.getItem('selectedSuggestions');
      if (suggestions) {
        try {
          const suggestionData: OptimizationSuggestion[] = JSON.parse(suggestions);
          setSelectedSuggestions(suggestionData);
        } catch (error) {
          console.error('Error parsing selected suggestions:', error);
        }
      }

      // 檢查是否已有優化過的履歷
      const optimizedResume = sessionStorage.getItem('optimizedResume');
      if (optimizedResume) {
        try {
          const resume: OptimizedResume = JSON.parse(optimizedResume);
          setResumeData(resume);
        } catch (error) {
          console.error('Error parsing optimized resume:', error);
        }
      }
    };

    loadData();
  }, []);

  const generateOptimizedResume = useCallback(async () => {
    if (!originalAnalysis || selectedSuggestions.length === 0) {
      console.error('Missing required data for optimization');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🚀 [Preview] Starting resume optimization');
      
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: originalAnalysis,
          selectedSuggestions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const optimizedResume = result.data.optimizedResume;
        setResumeData(optimizedResume);
        
        // 保存到 sessionStorage
        sessionStorage.setItem('optimizedResume', JSON.stringify(optimizedResume));
        
        console.log('✅ [Preview] Resume optimization completed');
      } else {
        console.error('❌ [Preview] Optimization failed:', result.error);
        alert('履歷優化失敗：' + result.error);
      }
    } catch (error) {
      console.error('❌ [Preview] Optimization error:', error);
      alert('履歷優化過程中發生錯誤');
    } finally {
      setIsGenerating(false);
    }
  }, [originalAnalysis, selectedSuggestions]);

  // 當原始分析和建議都準備好，且還沒有優化履歷時自動生成
  useEffect(() => {
    if (originalAnalysis && selectedSuggestions.length > 0 && !resumeData) {
      generateOptimizedResume();
    }
  }, [originalAnalysis, selectedSuggestions, resumeData, generateOptimizedResume]);
  
  const copyResumeText = useCallback(async () => {
    if (!resumeData) return;

    try {
      const resumeContent = document.getElementById('resume-content')?.innerText || '';
      await navigator.clipboard.writeText(resumeContent);
      setCopySuccess(true);
      toast.success("履歷文字已複製到剪貼簿！");
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error('複製失敗:', error);
      toast.error("複製失敗，請手動選擇文字複製");
    }
  }, [resumeData]);

  const handleTemplateChange = (templateId: string) => {
    setCurrentTemplateId(templateId);
    localStorage.setItem('selectedTemplateId', templateId);
  };

  const currentTemplate = getTemplateById(currentTemplateId);
  
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
          <div className="flex justify-center mb-4">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 優化履歷
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            基於 {selectedSuggestions.length} 個優化建議生成的專業履歷，您可以進一步編輯和下載。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Controls */}
          <ActionSidebar
            currentTemplateId={currentTemplateId}
            onTemplateChange={handleTemplateChange}
            copySuccess={copySuccess}
            onCopy={copyResumeText}
            selectedSuggestions={selectedSuggestions}
          />

          {/* Main Content - Resume Preview */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg p-0">
              <CardContent className="p-0">
                <ResumePreview 
                  resumeData={resumeData} 
                  template={currentTemplate} 
                  onUpdateResume={(updatedResume) => {
                    setResumeData(updatedResume);
                    sessionStorage.setItem('optimizedResume', JSON.stringify(updatedResume));
                  }}
                />
              </CardContent>
            </Card>
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