"use client";

import SmartChat, { ChatMessage, ChatState } from "@/components/smart-chat";
import { Button } from "@/components/ui/button";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

  const handleChatComplete = (history: ChatMessage[], chatStates: ChatState[]) => {
    setIsCompleted(true);
    
    // 將聊天記錄和問答狀態存儲到 localStorage 以便在建議頁面使用
    localStorage.setItem('chatHistory', JSON.stringify(history));
    localStorage.setItem('chatStates', JSON.stringify(chatStates));
    
    // 延遲跳轉，讓用戶看到完成狀態
    setTimeout(() => {
      router.push('/suggestions');
    }, 2000);
  };

  const handleSkipToSuggestions = () => {
    router.push('/suggestions');
  };

  const handlePrevious = () => {
    router.push('/results');
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

  // 沒有分析結果或沒有問題時的狀態
  if (!analysisResult || !analysisResult.missing_content?.follow_ups?.length) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            您的履歷已經很完整了！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            AI 分析顯示您的履歷內容已經相當完善，無需額外的問答優化。
          </p>
          <Button
            onClick={handleSkipToSuggestions}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            查看優化建議
          </Button>
        </div>
      </div>
    );
  }

  // 問答完成狀態
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <span className="text-6xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            問答優化完成！
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            感謝您的詳細回答，正在為您生成個性化建議...
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-cyan-200 rounded-full w-64 mx-auto">
              <div className="h-2 bg-cyan-600 rounded-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">🤖</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 智慧問答
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            通過簡單的問答互動，幫助您補齊履歷中的關鍵信息，讓 AI 為您生成更精準的優化建議。
          </p>
        </div>

        {/* 智慧問答組件 */}
        <SmartChat 
          analysisResult={analysisResult}
          onComplete={handleChatComplete}
          onSkip={handleSkipToSuggestions}
        />

        {/* Navigation */}
        <div className="flex justify-between mt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回分析結果</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSkipToSuggestions}
            className="flex items-center space-x-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
          >
            <span>跳過問答</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 