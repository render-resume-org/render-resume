import { OptimizationSuggestion, OptimizedResume } from '@/lib/types/resume';
import type { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { useCallback, useEffect, useState } from 'react';

/**
 * 履歷優化相關狀態管理的自定義 Hook
 */
export function useResumeOptimization() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<OptimizedResume | null>(null);
  const [originalAnalysis, setOriginalAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState<OptimizationSuggestion[]>([]);

  // 從儲存中載入數據
  const loadStoredData = useCallback(() => {
    const analysisResult = sessionStorage.getItem('analysisResult');
    const selectedSuggestions = sessionStorage.getItem('selectedSuggestions');
    const optimizedResume = sessionStorage.getItem('optimizedResume');
    
    if (analysisResult) {
      setOriginalAnalysis(JSON.parse(analysisResult));
    }
    
    if (selectedSuggestions) {
      setSelectedSuggestions(JSON.parse(selectedSuggestions));
    }
    
    if (optimizedResume) {
      setResumeData(JSON.parse(optimizedResume));
    }
  }, []);

  // 生成優化履歷
  const generateOptimizedResume = useCallback(async (
    analysis?: ResumeAnalysisResult,
    suggestions?: OptimizationSuggestion[]
  ) => {
    const targetAnalysis = analysis || originalAnalysis;
    const targetSuggestions = suggestions || selectedSuggestions;

    if (!targetAnalysis || targetSuggestions.length === 0) {
      console.error('Missing required data for optimization');
      throw new Error('缺少必要的分析結果或建議');
    }

    setIsGenerating(true);
    try {
      console.log('🚀 [Resume Optimization] Starting resume optimization');
      
      const response = await fetch('/api/optimize-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisResult: targetAnalysis,
          selectedSuggestions: targetSuggestions,
        }),
      });

      const result = await response.json();

      if (result.success) {
        const optimizedResume = result.data.optimizedResume;
        setResumeData(optimizedResume);
        
        // 保存到 sessionStorage
        sessionStorage.setItem('optimizedResume', JSON.stringify(optimizedResume));
        
        console.log('✅ [Resume Optimization] Resume optimization completed');
        return optimizedResume;
      } else {
        console.error('❌ [Resume Optimization] Optimization failed:', result.error);
        throw new Error(result.error || '履歷優化失敗');
      }
    } catch (error) {
      console.error('❌ [Resume Optimization] Optimization error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [originalAnalysis, selectedSuggestions]);

  // 更新履歷數據
  const updateResumeData = useCallback((updatedResume: OptimizedResume) => {
    setResumeData(updatedResume);
    sessionStorage.setItem('optimizedResume', JSON.stringify(updatedResume));
  }, []);

  // 檢查是否可以自動生成履歷
  const canAutoGenerate = useCallback(() => {
    return originalAnalysis && selectedSuggestions.length > 0 && !resumeData;
  }, [originalAnalysis, selectedSuggestions, resumeData]);

  // 自動生成履歷（如果條件滿足）
  useEffect(() => {
    if (canAutoGenerate()) {
      generateOptimizedResume();
    }
  }, [canAutoGenerate, generateOptimizedResume]);

  // 初始化時載入數據
  useEffect(() => {
    loadStoredData();
  }, [loadStoredData]);

  return {
    // 狀態
    isGenerating,
    resumeData,
    originalAnalysis,
    selectedSuggestions,
    
    // 方法
    generateOptimizedResume,
    updateResumeData,
    loadStoredData,
    canAutoGenerate,
    
    // 設置方法（用於手動設置狀態）
    setOriginalAnalysis,
    setSelectedSuggestions,
  };
}

/**
 * 履歷模板相關狀態管理的自定義 Hook
 */
export function useResumeTemplate() {
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('standard');

  // 載入儲存的模板ID
  useEffect(() => {
    const savedTemplateId = localStorage.getItem('selectedTemplateId');
    if (savedTemplateId) {
      setCurrentTemplateId(savedTemplateId);
    }
  }, []);

  // 更新模板ID
  const updateTemplateId = useCallback((templateId: string) => {
    setCurrentTemplateId(templateId);
    localStorage.setItem('selectedTemplateId', templateId);
  }, []);

  return {
    currentTemplateId,
    updateTemplateId,
  };
}

/**
 * 複製履歷文字功能的自定義 Hook
 */
export function useResumeCopy() {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyResumeText = useCallback(async (elementId: string = 'resume-content') => {
    try {
      const resumeContent = document.getElementById(elementId)?.innerText || '';
      await navigator.clipboard.writeText(resumeContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
      return true;
    } catch (error) {
      console.error('複製失敗:', error);
      throw new Error('複製失敗，請手動選擇文字複製');
    }
  }, []);

  return {
    copySuccess,
    copyResumeText,
  };
}