"use client";

import { SuggestionRecord } from "@/components/smart-chat";
import type { SuggestionTemplate } from "@/components/smart-chat/ai-suggestions-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatMessage } from "@/lib/mock-data";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Circle,
  Lightbulb,
  MessageSquare
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function SuggestionsPage() {
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const loadData = useCallback(() => {
    try {
      // 讀取聊天記錄
      const savedHistory = sessionStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }

      const savedSuggestionTemplates = sessionStorage.getItem('chatSuggestionTemplates');
      
      const allSuggestions: SuggestionRecord[] = [];
      
      
      // 添加追蹤問題建議
      if (savedSuggestionTemplates) {
        const suggestionTemplates: SuggestionTemplate[] = JSON.parse(savedSuggestionTemplates);
        const templateSuggestions = suggestionTemplates.map(t => {
          if (t.status === 'completed' && t.completedSuggestion) {
            return {
              id: t.id,
              title: t.completedSuggestion.title,
              description: t.completedSuggestion.description,
              category: t.completedSuggestion.category,
              timestamp: t.timestamp || new Date()
            };
          } else {
            return {
              id: t.id,
              title: t.title,
              description: t.description,
              category: t.category,
              timestamp: t.timestamp || new Date()
            };
          }
        });
        allSuggestions.push(...templateSuggestions);
        console.log(`載入了 ${templateSuggestions.length} 個追蹤問題建議`);
      }
      
      setSuggestions(allSuggestions);
      console.log(`總共載入了 ${allSuggestions.length} 個建議`);
      
    } catch (error) {
      console.error('載入建議失敗:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    // 清除之前的 optimizedResume，確保在選擇建議後會重新生成
    sessionStorage.removeItem('optimizedResume');
  }, [loadData]);

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(suggestionId)) {
        newSet.delete(suggestionId);
      } else {
        newSet.add(suggestionId);
      }
      return newSet;
    });
  };

  const selectAllSuggestions = () => {
    setSelectedSuggestions(new Set(suggestions.map(s => s.id)));
  };

  const clearAllSuggestions = () => {
    setSelectedSuggestions(new Set());
  };

  const handleNext = () => {
    // 保存選中的建議
    const selectedSuggestionData = suggestions.filter(s => selectedSuggestions.has(s.id));
    sessionStorage.setItem('selectedSuggestions', JSON.stringify(selectedSuggestionData));
    
    router.push('/preview');
  };

  const handlePrevious = () => {
    // 如果有聊天記錄或建議，返回智慧問答頁面
    if (chatHistory.length > 0 || suggestions.length > 0) {
      router.push('/smart-chat');
    } else {
      // 否則返回結果頁面
      router.push('/results');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
              <Lightbulb className="h-8 w-8 text-cyan-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 優化建議
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {suggestions.length > 0 
              ? `基於您的問答互動，AI 為您生成了 ${suggestions.length} 個個性化建議，選擇您想要的建議進入下一步。`
              : '未找到智慧問答建議，請先完成智慧問答或返回重新開始。'
            }
          </p>
        </div>

        {/* Status Card */}
        {suggestions.length > 0 && (
          <Card className="mb-8 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <MessageSquare className="h-5 w-5 mr-2" />
                智慧問答建議收集完成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 dark:text-green-300">
                {chatHistory.length > 0 
                  ? `通過 ${chatHistory.filter(m => m.type === 'user').length} 輪問答交流，收集到 ${suggestions.length} 個個性化建議。`
                  : `收集到 ${suggestions.length} 個來自問答過程的建議。`
                }
              </p>
            </CardContent>
          </Card>
        )}

        {suggestions.length > 0 ? (
          <>
            {/* Summary Stats */}
            <Card className="mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {suggestions.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        總建議數
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">
                        {selectedSuggestions.size}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        已選中
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllSuggestions}
                      disabled={selectedSuggestions.size === suggestions.length}
                    >
                      全選
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllSuggestions}
                      disabled={selectedSuggestions.size === 0}
                    >
                      清空
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggestions List */}
            <div className="space-y-4 mb-8">
              {suggestions.map((suggestion, index) => {
                const isSelected = selectedSuggestions.has(suggestion.id);
                return (
                  <Card 
                    key={suggestion.id}
                    className={`transition-all cursor-pointer hover:shadow-md ${
                      isSelected 
                        ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    onClick={() => toggleSuggestion(suggestion.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {isSelected ? (
                            <CheckCircle className="h-5 w-5 text-cyan-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                              {suggestion.title}
                            </h3>
                            <div className="flex-shrink-0 ml-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                建議 #{index + 1}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {suggestion.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              類別: {suggestion.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(suggestion.timestamp).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Call to Action */}
            <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-gray-900 dark:text-white">
                  準備好了嗎？
                </CardTitle>
                <CardDescription className="text-center">
                  已選中 {selectedSuggestions.size} 個建議，繼續預覽履歷或返回調整
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleNext}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    disabled={selectedSuggestions.size === 0}
                  >
                    <span>預覽履歷</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>返回問答</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  沒有找到建議
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  請先完成智慧問答來獲得個性化建議
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => router.push('/smart-chat')}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    開始智慧問答
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/results')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    返回結果頁面
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            disabled={suggestions.length === 0 || selectedSuggestions.size === 0}
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