"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeDocuments } from "@/lib/api/resume-analysis";
import type { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import {
    ArrowRight,
    Award,
    Bot,
    Briefcase,
    Code,
    FileText,
    GraduationCap
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface StoredFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string; // base64
  preview?: string;
}

export default function AnalyzePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<StoredFile[]>([]);
  const [additionalText, setAdditionalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [analysisElapsedTime, setAnalysisElapsedTime] = useState(0);

  const steps: { id: string; title: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'content',
      title: '內容識別',
      description: 'AI正在讀取和理解您的作品內容...',
      icon: FileText,
    },
    {
      id: 'skills',
      title: '技能提取',
      description: '分析技術棧和專業技能...',
      icon: Code,
    },
    {
      id: 'achievements',
      title: '成就識別',
      description: '識別項目成果和個人成就...',
      icon: Award,
    },
    {
      id: 'experience',
      title: '經歷整理',
      description: '組織工作經驗和項目經歷...',
      icon: Briefcase,
    },
    {
      id: 'profile',
      title: '學習經歷',
      description: '提取學習經歷和學習成果...',
      icon: GraduationCap,
    },
    {
      id: 'recommendation',
      title: '評分與建議',
      description: '評分您的履歷，並提供建議...',
      icon: Bot,
    }
  ];

  // Helper function to generate user-friendly error messages
  const getErrorMessage = (error: string): string => {
    const lowerError = error.toLowerCase();
    
    if (lowerError.includes('vision') || lowerError.includes('image') || lowerError.includes('photo')) {
      return `照片識別失敗：上傳的照片可能沒有足夠的文字內容可供AI識別。請確認照片中包含清晰的履歷文字內容，並且解析度足夠高。建議使用PDF或文字文件格式以獲得更好的識別效果。`;
    }
    
    if (lowerError.includes('resolution') || lowerError.includes('quality')) {
      return `圖片品質問題：上傳的圖片解析度過低或品質不佳，AI無法正確識別內容。請嘗試使用更高解析度的圖片，或直接上傳PDF/文字格式的履歷文件。`;
    }
    
    if (lowerError.includes('content') || lowerError.includes('text') || lowerError.includes('extract')) {
      return `內容提取失敗：AI無法從上傳的文件中提取有效內容。可能原因包括：文件格式不支援、內容過於模糊、或文件損壞。建議重新上傳清晰的履歷文件。`;
    }
    
    if (lowerError.includes('format') || lowerError.includes('type')) {
      return `文件格式錯誤：上傳的文件格式可能不受支援。建議使用PDF、Word文檔、或高解析度的圖片格式（PNG、JPG）。`;
    }
    
    if (lowerError.includes('size') || lowerError.includes('large')) {
      return `文件大小問題：上傳的文件過大或過小。請確認文件大小在合理範圍內，並包含完整的履歷內容。`;
    }
    
    if (lowerError.includes('network') || lowerError.includes('timeout') || lowerError.includes('connection')) {
      return `網路連線問題：分析過程中發生網路錯誤。請檢查網路連線狀態並重試。`;
    }
    
    // Default error message
    return `分析失敗：${error}。可能原因包括：文件內容無法識別、圖片解析度過低、文件格式不支援等。請檢查上傳的文件是否包含清晰的履歷內容，並考慮使用PDF或文字格式重新上傳。`;
  };

  const startAnalysis = useCallback(async (files: StoredFile[], additionalText: string) => {
    console.log('🚀 [Analyze Page] Starting analysis with:', {
      filesCount: files.length,
      fileNames: files.map(f => f.name),
      additionalTextLength: additionalText.length
    });
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStartTime(Date.now());
    setAnalysisElapsedTime(0);
    
    try {
      console.log('🔄 [Analyze Page] Converting base64 back to File objects');
      // 將 base64 轉換回 File 對象
      const fileObjects = files.map(storedFile => {
        console.log(`📄 [Analyze Page] Converting file: ${storedFile.name}`);
        const base64Data = storedFile.content.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        const file = new File([byteArray], storedFile.name, {
          type: storedFile.type,
          lastModified: storedFile.lastModified
        });
        
        console.log(`✅ [Analyze Page] File converted: ${file.name} (${file.size} bytes)`);
        return file;
      });

      console.log('⏱️ [Analyze Page] Starting step animation');
      // 開始步驟動畫
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            console.log(`📈 [Analyze Page] Step progress: ${prev + 1}/${steps.length}`);
            return prev + 1;
          } else {
            clearInterval(stepInterval);
            return prev;
          }
        });
      }, 4500);

      console.log('🤖 [Analyze Page] Calling analyzeDocuments API');
      // 執行實際的文檔分析
      const response = await analyzeDocuments({
        files: fileObjects,
        additionalText: additionalText || undefined,
        useVision: true
      });

      console.log('📋 [Analyze Page] API response received:', {
        success: response.success,
        hasData: !!response.data,
        error: response.error
      });

      clearInterval(stepInterval);
      
      if (response.success && response.data) {
        console.log('✅ [Analyze Page] Analysis successful');
        console.log('📊 [Analyze Page] Result keys:', Object.keys(response.data));
        setAnalysisResult(response.data);
        setCurrentStep(steps.length - 1);
        setAnalysisComplete(true);
      } else {
        console.error('❌ [Analyze Page] Analysis failed:', response.error);
        const userFriendlyError = getErrorMessage(response.error || '分析失敗');
        throw new Error(userFriendlyError);
      }
    } catch (error) {
      console.error('❌ [Analyze Page] Analysis error:', error);
      if (error instanceof Error) {
        console.error('❌ [Analyze Page] Error message:', error.message);
        console.error('❌ [Analyze Page] Error stack:', error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : '分析過程中發生錯誤';
      setError(getErrorMessage(errorMessage));
    } finally {
      setIsAnalyzing(false);
      setAnalysisStartTime(null);
      console.log('🏁 [Analyze Page] Analysis process completed');
    }
  }, [steps.length]);

  // Timer effect to update elapsed time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isAnalyzing && analysisStartTime) {
      intervalId = setInterval(() => {
        setAnalysisElapsedTime(Math.floor((Date.now() - analysisStartTime) / 1000));
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isAnalyzing, analysisStartTime]);

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log('🔍 [Analyze Page] Component mounted, checking for stored files');
    const storedFilesData = sessionStorage.getItem('uploadedFiles');
    const storedAdditionalText = sessionStorage.getItem('additionalText');
    
    if (storedFilesData) {
      console.log('📦 [Analyze Page] Found stored files data');
      try {
        const files: StoredFile[] = JSON.parse(storedFilesData);
        console.log('📄 [Analyze Page] Parsed files:', {
          count: files.length,
          names: files.map(f => f.name),
          sizes: files.map(f => f.size)
        });
        
        setUploadedFiles(files);
        setAdditionalText(storedAdditionalText || '');
        
        // 自動開始分析
        startAnalysis(files, storedAdditionalText || '');
      } catch (error) {
        console.error('Error parsing stored files:', error);
        setError('讀取上傳文件時發生錯誤');
      }
    } else {
      // 如果沒有文件，返回上傳頁面
      router.push('/upload');
    }
  }, [router, startAnalysis]);

  const handleViewResults = () => {
    // 將分析結果存儲到 sessionStorage
    if (analysisResult) {
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      router.push('/results');
    }
  };

  const handleRetry = () => {
    if (uploadedFiles.length > 0) {
      setCurrentStep(0);
      setAnalysisComplete(false);
      setError(null);
      setAnalysisResult(null);
      startAnalysis(uploadedFiles, additionalText);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">🧠</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            AI 智能解析中
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI正在深度分析您的作品內容，識別技能、成就和經驗。
          </p>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              通常平均分析時長是 45 秒左右，請耐心稍候，可以離開此頁面，但不可關閉
            </p>
            {isAnalyzing && (
              <div className="flex items-center justify-center space-x-2 text-lg font-mono">
                <span className="text-gray-700 dark:text-gray-300">分析時間：</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {formatTime(analysisElapsedTime)}
                </span>
              </div>
            )}
          </div>
          {uploadedFiles.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              正在處理 {uploadedFiles.length} 個文件
            </p>
          )}
        </div>

        {/* Analysis Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, stepIndex) => {
            const Icon = step.icon;
            const isProcessing = stepIndex === currentStep && !analysisComplete && !error;
            const isCompleted = stepIndex < currentStep || analysisComplete;
            
            return (
              <Card key={stepIndex} className={`transition-all duration-300 border-gray-200 dark:border-gray-700 ${
                isProcessing ? 'ring-2 ring-cyan-500 bg-cyan-50 dark:bg-cyan-950/30' :
                isCompleted ? 'bg-green-50 dark:bg-green-950/30' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      isProcessing ? 'bg-cyan-100 dark:bg-cyan-900/50' :
                      isCompleted ? 'bg-green-100 dark:bg-green-900/50' : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        isProcessing ? 'text-cyan-600 dark:text-cyan-400' :
                        isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {isProcessing && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-600"></div>
                      )}
                      {isCompleted && (
                        <div className="text-green-600 dark:text-green-400">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Error Display - Positioned after analysis steps, same as success summary */}
        {error && !isAnalyzing && (
          <Card className="mb-8 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700 dark:text-red-400">
                <span className="text-2xl mr-2">⚠️</span>
                分析失敗
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-300">
                AI分析過程中遇到問題，請查看詳細原因並重試
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                <p className="text-red-800 dark:text-red-200 mb-4 leading-relaxed">
                  {error}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRetry}
                    disabled={isAnalyzing}
                    className="bg-red-600 hover:bg-red-700 text-white flex-1"
                  >
                    重新分析
                  </Button>
                  <Button
                    onClick={() => router.push('/upload')}
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950/30 flex-1"
                  >
                    重新上傳文件
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Complete Summary */}
        {analysisComplete && analysisResult && !error && (
          <Card className="mb-8 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-400">
                <span className="text-2xl mr-2">✨</span>
                分析完成！
              </CardTitle>
              <CardDescription>
                AI已成功分析您的作品，識別出以下關鍵信息：
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">技能專長</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    識別了 {analysisResult.expertise.length} 項技術技能和軟技能
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">項目經驗</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    整理了 {analysisResult.projects.length} 個主要項目的詳細信息
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">成就亮點</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    提取了 {analysisResult.achievements.length} 項量化的工作成果
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">工作經驗</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    分析了 {analysisResult.work_experiences.length} 段工作經歷
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/upload')}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            返回上傳
          </Button>
          
          <Button 
            onClick={handleViewResults}
            disabled={!analysisComplete || !analysisResult}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            查看詳細結果
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 