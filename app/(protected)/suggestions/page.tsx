"use client";

// 關鍵！禁用靜態生成，因為包含 Supabase 相關組件
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "@/lib/mock-data";
import {
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Lightbulb,
    Star,
    TrendingUp
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface Suggestion {
  id: string;
  category: 'improvement' | 'strength' | 'optimization';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  implemented: boolean;
  details?: string[];
}

export default function SuggestionsPage() {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [implementedCount, setImplementedCount] = useState(0);

  const loadChatHistory = () => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadSuggestions = useCallback(async () => {
    const mockSuggestions: Suggestion[] = [
      {
        id: '1',
        category: 'improvement',
        title: '增加量化成果',
        description: '在項目描述中加入具體的數字和成果，讓雇主更容易了解您的貢獻。',
        impact: 'high',
        implemented: false,
        details: [
          '將「優化了系統性能」改為「優化系統性能，減少載入時間40%」',
          '將「管理團隊」改為「領導5人開發團隊，按時交付項目」',
          '將「提升用戶體驗」改為「重新設計UI，用戶滿意度提升至4.8星」'
        ]
      },
      {
        id: '2',
        category: 'strength',
        title: '技能組合完整',
        description: '您的技能組合涵蓋前端、後端和設計，是全端開發的強項。',
        impact: 'high',
        implemented: true,
        details: [
          '前端: React, TypeScript, CSS',
          '後端: Node.js, Python, PostgreSQL',
          '設計: Figma, UI/UX 原則',
          '工具: Git, Docker, AWS'
        ]
      },
      {
        id: '3',
        category: 'optimization',
        title: '調整段落結構',
        description: '重新組織履歷段落，將最重要的信息放在前面。',
        impact: 'medium',
        implemented: false,
        details: [
          '將技能摘要移到頂部',
          '突出顯示最近的工作經驗',
          '合併相似的項目經驗',
          '簡化教育背景描述'
        ]
      },
      {
        id: '4',
        category: 'improvement',
        title: '增加關鍵字',
        description: '根據目標職位添加行業關鍵字，提高ATS系統匹配度。',
        impact: 'high',
        implemented: false,
        details: [
          '加入「敏捷開發」、「Scrum」等方法論',
          '包含「響應式設計」、「跨瀏覽器兼容」',
          '提及「API集成」、「微服務架構」',
          '強調「用戶中心設計」、「可用性測試」'
        ]
      },
      {
        id: '5',
        category: 'optimization',
        title: '優化視覺設計',
        description: '調整履歷的視覺元素，讓版面更清晰易讀。',
        impact: 'medium',
        implemented: false,
        details: [
          '增加適當的空白間距',
          '使用一致的字體大小和顏色',
          '添加區塊分隔線',
          '優化項目符號樣式'
        ]
      },
      {
        id: '6',
        category: 'strength',
        title: '項目經驗豐富',
        description: '您有多樣化的項目經驗，從電商到移動應用都有涉及。',
        impact: 'high',
        implemented: true,
        details: [
          '電商平台開發經驗',
          '移動應用設計與開發',
          '企業級系統優化',
          '跨平台技術應用'
        ]
      }
    ];

    setIsLoading(true);
    // 模擬AI分析過程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSuggestions(mockSuggestions);
    setImplementedCount(mockSuggestions.filter(s => s.implemented).length);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSuggestions();
    loadChatHistory();
  }, [loadSuggestions]);

  const toggleImplementation = (id: string) => {
    setSuggestions(prev => {
      const updated = prev.map(suggestion => 
        suggestion.id === id 
          ? { ...suggestion, implemented: !suggestion.implemented }
          : suggestion
      );
      
      // Update implemented count based on the new state
      const newCount = updated.filter(s => s.implemented).length;
      setImplementedCount(newCount);
      
      return updated;
    });
  };

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case 'improvement':
        return AlertTriangle;
      case 'strength':
        return Star;
      case 'optimization':
        return TrendingUp;
      default:
        return Lightbulb;
    }
  };

  const getSuggestionColor = (category: string) => {
    switch (category) {
      case 'improvement':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'strength':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'optimization':
        return 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200'
    };
    return colors[impact as keyof typeof colors];
  };

  const handleNext = () => {
    router.push('/preview');
  };

  const handlePrevious = () => {
    if (chatHistory.length > 0) {
      router.push('/smart-chat');
    } else {
      router.push('/results');
    }
  };

  // 載入中狀態
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            正在生成個人化建議...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            AI 正在根據您的履歷分析結果，為您量身定制優化建議
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">💡</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 優化建議
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {chatHistory.length > 0 
              ? '基於您的資料、問答回應和行業標準，AI為您生成了個性化的履歷優化建議。'
              : '基於您的資料和行業標準，AI為您生成了個性化的履歷優化建議。'
            }
          </p>
        </div>

       

        {/* Chat Summary */}
        {chatHistory.length > 0 && (
          <Card className="mb-8 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <span className="text-2xl mr-2">✅</span>
                問答優化完成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                通過 {chatHistory.filter(m => m.type === 'user').length} 輪問答交流，我們收集了豐富的履歷補充信息。
                以下建議已經結合您的回答進行了個性化調整。
              </p>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="mb-8 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="flex items-center text-cyan-700 dark:text-cyan-400">
              <span className="text-2xl mr-2">✨</span>
              分析總結
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {suggestions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  總建議數
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {implementedCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  已優化項目
                </div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((implementedCount / suggestions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  完成度
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => {
            const IconComponent = getSuggestionIcon(suggestion.category);
            return (
              <Card 
                key={suggestion.id} 
                className={`transition-all hover:shadow-md border-gray-200 dark:border-gray-700 ${suggestion.implemented ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800'}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${getSuggestionColor(suggestion.category)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {suggestion.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getImpactBadge(suggestion.impact)}`}>
                              {suggestion.impact === 'high' ? '高影響' : 
                               suggestion.impact === 'medium' ? '中影響' : '低影響'}
                            </span>
                            <Button
                              variant={suggestion.implemented ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleImplementation(suggestion.id)}
                              className={suggestion.implemented ? "bg-green-600 hover:bg-green-700 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"}
                            >
                              {suggestion.implemented ? (
                                <>
                                  <span className="text-sm mr-1">✅</span>
                                  已採用
                                </>
                              ) : (
                                '採用建議'
                              )}
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {suggestion.description}
                        </p>
                        {suggestion.details && (
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              具體建議：
                            </p>
                            <div className="space-y-1">
                              {suggestion.details.map((detail, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <div className="w-1 h-1 bg-cyan-600 rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {detail}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="mt-8 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-white">
              準備好了嗎？
            </CardTitle>
            <CardDescription className="text-center">
              根據上述建議優化您的履歷，或者直接預覽當前版本
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <span className="text-lg mr-2">📄</span>
                應用所有建議
              </Button>
              <Button variant="outline" onClick={handleNext} className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                預覽履歷
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="flex items-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>上一步</span>
          </Button>
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <span>預覽履歷</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 