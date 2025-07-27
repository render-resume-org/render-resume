"use client";

import SmartChat, { ChatMessage, SuggestionRecord } from "@/components/smart-chat";
import type { SuggestionTemplate } from "@/components/smart-chat/ai-suggestions-sidebar";
import { Button } from "@/components/ui/button";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SmartChatPage() {
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const loadAnalysisResult = useCallback(async () => {
    setIsLoading(true);
    try {
      // 從 sessionStorage 讀取分析結果
      const savedResult = sessionStorage.getItem('analysisResult');
      if (savedResult) {
        const result = JSON.parse(savedResult) as ResumeAnalysisResult;
        setAnalysisResult(result);
      } else {
        // 如果沒有分析結果，跳轉回分析頁面
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Failed to load analysis result:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadAnalysisResult();
  }, [loadAnalysisResult]);

  // 修正：如果 analysisResult 存在但 sessionStorage 沒有，補存一次
  useEffect(() => {
    if (analysisResult && !sessionStorage.getItem('analysisResult')) {
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  const handleChatComplete = (history: ChatMessage[], suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => {
    setIsCompleted(true);
    // 使用 sessionStorage 並分離存儲建議類型
    sessionStorage.setItem('chatHistory', JSON.stringify(history));
    sessionStorage.setItem('chatSuggestions', JSON.stringify(suggestions));
    sessionStorage.setItem('chatSuggestionTemplates', JSON.stringify(suggestionTemplates));
    router.push('/suggestions');
  };

  // 目前並沒有實作呼叫這個 function 的邏輯 e.g. skip button
  const handleSkipToSuggestions = (suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => {
    // 保存跳過時已收集的建議
    if (suggestions.length > 0 || suggestionTemplates.length > 0) {
      sessionStorage.setItem('chatSuggestions', JSON.stringify(suggestions));
      sessionStorage.setItem('chatSuggestionTemplates', JSON.stringify(suggestionTemplates));
      console.log(`跳過問答時保存了 ${suggestions.length} 個額外建議和 ${suggestionTemplates.length} 個追蹤問題`);
    } else {
      sessionStorage.removeItem('chatSuggestions');
      sessionStorage.removeItem('chatSuggestionTemplates');
    }
    
    // 清空聊天記錄（跳過時不保存對話記錄）
    sessionStorage.removeItem('chatHistory');
    
    router.push('/suggestions');
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            正在準備 AI 問答...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            正在載入您的分析結果
          </p>
        </div>
      </div>
    );
  }

  // 沒有分析結果時的狀態
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            找不到分析結果
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            請先進行履歷分析再使用智慧問答功能。
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            返回首頁
          </Button>
        </div>
      </div>
    );
  }

  // 問答完成狀態
  if (isCompleted) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-4xl">✅</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            智慧問答完成！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            感謝您的參與，正在為您準備個性化的履歷優化建議...
          </p>
          <div className="flex justify-center">
            <div className="animate-pulse">
              <div className="h-2 bg-cyan-200 dark:bg-cyan-800 rounded-full w-64">
                <div className="h-2 bg-cyan-600 rounded-full w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <SmartChat 
          analysisResult={analysisResult}
          onComplete={handleChatComplete}
          onSkip={handleSkipToSuggestions}
        />
      </div>
    </div>
  );
} 