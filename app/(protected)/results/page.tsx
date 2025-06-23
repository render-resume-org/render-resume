"use client";

import { AnalysisScores } from "@/components/analysis-scores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisScore, LetterGrade, ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import {
  ArrowLeft,
  Award,
  BarChart3,
  Briefcase,
  Code,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Share2,
  User
} from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalysisReport, setShowAnalysisReport] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    // 從 sessionStorage 讀取分析結果
    const storedResult = sessionStorage.getItem('analysisResult');
    
    if (storedResult) {
      try {
        const result: ResumeAnalysisResult = JSON.parse(storedResult);
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error parsing analysis result:', error);
      }
    } else {
      // 如果沒有結果，返回上傳頁面
      router.push('/upload');
    }
    
    setIsLoading(false);
  }, [router]);

  // Helper function to extract all skills
  const allSkills = React.useMemo(() => {
    if (!analysisResult) return [];
    const skills: string[] = analysisResult.expertise;
    analysisResult.projects.forEach(p => {
      if (p.technologies) skills.push(...p.technologies);
    });
    analysisResult.work_experiences.forEach(w => {
      if (w.technologies) skills.push(...w.technologies);
    });
    return [...new Set(skills)];
  }, [analysisResult]);

  // 生成預設評分（如果API沒有回傳scores）
  const analysisScores: AnalysisScore[] = React.useMemo(() => {
    if (!analysisResult) return [];
    
    // 如果API有回傳scores，直接使用
    if (analysisResult.scores && analysisResult.scores.length > 0) {
      return analysisResult.scores;
    }
    
    // Helper function to convert numerical score to letter grade
    const numberToGrade = (score: number): LetterGrade => {
      if (score >= 95) return 'A+';
      if (score >= 90) return 'A';
      if (score >= 85) return 'A-';
      if (score >= 80) return 'B+';
      if (score >= 75) return 'B';
      if (score >= 70) return 'B-';
      if (score >= 60) return 'C+';
      if (score >= 50) return 'C';
      if (score >= 40) return 'C-';
      return 'F';
    };
    
    // 如果沒有scores，基於現有數據生成評分
    const scores: AnalysisScore[] = [
      {
        category: "技術深度與廣度",
        grade: numberToGrade(60 + Math.min(40, allSkills.length * 2)),
        description: "技術技能的深度與廣度評估",
        comment: `【推理過程】觀察候選人的技術技能清單，發現包含${allSkills.length}項技術技能，涵蓋前端、後端、數據庫等多個領域。STAR分析：S-技術環境多樣化，T-掌握多項核心技術，A-在項目中實際應用，R-展示了技術的廣度。對照標準：技能數量${allSkills.length >= 15 ? '超過15項，符合A等級' : allSkills.length >= 10 ? '達到10-14項，符合B等級' : '少於10項，需要加強'}。權衡判斷：技術廣度${allSkills.length >= 10 ? '良好' : '有待提升'}，但需要更多深度展示。【最終評分】${numberToGrade(60 + Math.min(40, allSkills.length * 2))} - 技能覆蓋度${allSkills.length >= 15 ? '優秀' : allSkills.length >= 10 ? '良好' : '需要加強'}，包含${allSkills.length}項技術技能。【改進建議】${allSkills.length < 10 ? '建議增加更多相關技術技能，可以按熟練程度分類展示，加入技術認證或項目中的具體應用案例' : '技能覆蓋全面，建議突出核心專長，按熟練程度分級展示，加入最新學習的前沿技術'}。`,
        icon: "🛠️",
        suggestions: allSkills.length < 10 ? ["建議增加更多相關技術技能", "可以按熟練程度分類展示"] : ["技能覆蓋全面，建議突出核心專長"]
      },
      {
        category: "項目複雜度與影響力",
        grade: numberToGrade(50 + analysisResult.projects.length * 15),
        description: "項目經驗的複雜度與影響力",
        comment: `【推理過程】分析候選人的項目經驗，共發現${analysisResult.projects.length}個項目。評估項目的技術複雜度、業務影響力和個人貢獻度。若項目數量≥3個且包含完整的技術棧描述，則認為經驗豐富；若<3個則需要加強。當前狀態：項目數量為${analysisResult.projects.length}個，${analysisResult.projects.length >= 3 ? '達到豐富標準' : '未達到最低要求'}。【最終評分】${numberToGrade(50 + analysisResult.projects.length * 15)} - 項目經驗${analysisResult.projects.length >= 3 ? '豐富，展現良好的實戰能力' : '有待加強，需要更多實際項目經驗'}。【改進建議】${analysisResult.projects.length < 3 ? '強烈建議增加更多項目經驗，詳述每個項目的技術挑戰和解決方案，量化項目成果和業務影響' : '項目經驗豐富，建議加入更多量化數據，如用戶增長、性能提升、成本節約等具體指標'}。`,
        icon: "🚀",
        suggestions: analysisResult.projects.length < 3 ? ["建議增加更多項目經驗", "詳述技術挑戰和解決方案"] : ["項目經驗豐富，建議加入量化數據"]
      },
      {
        category: "專業經驗完整度",
        grade: numberToGrade(55 + analysisResult.work_experiences.length * 20),
        description: "工作經驗的完整性與相關性",
        comment: `工作經驗${analysisResult.work_experiences.length >= 2 ? '完整' : '需要補強'}，共${analysisResult.work_experiences.length}段經歷`,
        icon: "💼",
        suggestions: analysisResult.work_experiences.length < 2 ? ["建議補充更多工作經驗", "突出核心職責"] : ["經驗豐富，建議量化工作成果"]
      },
      {
        category: "教育背景與專業匹配度",
        grade: numberToGrade(50 + analysisResult.education_background.length * 25),
        description: "學歷與專業領域的相關性",
        comment: `教育背景${analysisResult.education_background.length >= 1 ? '完整' : '需要補充'}，共${analysisResult.education_background.length}個學歷`,
        icon: "🎓",
        suggestions: analysisResult.education_background.length < 1 ? ["建議補充教育背景", "加入相關課程和成就"] : ["教育背景良好，建議突出相關課程"]
      },
      {
        category: "成就與驗證",
        grade: numberToGrade(40 + analysisResult.achievements.length * 10),
        description: "具體成就與第三方驗證",
        comment: `成就展示${analysisResult.achievements.length >= 5 ? '充分' : '有待加強'}，共${analysisResult.achievements.length}項成就`,
        icon: "🏆",
        suggestions: analysisResult.achievements.length < 5 ? ["建議增加量化成果", "加入客戶推薦或認證"] : ["成就豐富，建議突出核心亮點"]
      },
      {
        category: "整體專業形象",
        grade: numberToGrade(65 + (analysisResult.projects.length + analysisResult.work_experiences.length + analysisResult.education_background.length) * 3),
        description: "履歷整體專業形象與表達",
        comment: "履歷結構清晰，專業形象良好",
        icon: "👤",
        suggestions: ["建議加強個人品牌描述", "可以考慮加入職涯目標"]
      }
    ];
    
    return scores;
  }, [analysisResult, allSkills]);

  const handleExportJSON = () => {
    if (!analysisResult) return;
    
    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'resume-analysis-result.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    if (!analysisResult) return;
    
    const shareText = `我的履歷分析結果
    
項目數量: ${analysisResult.projects.length}
技能數量: ${analysisResult.expertise.length}
工作經驗: ${analysisResult.work_experiences.length}段
成就數量: ${analysisResult.achievements.length}項

使用 AI 履歷分析工具生成`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: '履歷分析結果',
          text: shareText,
        });
      } catch (error) {
        console.log('分享失敗:', error);
      }
    } else {
      // 複製到剪貼板
      navigator.clipboard.writeText(shareText).then(() => {
        alert('結果已複製到剪貼板！');
      });
    }
  };

  const handleNewAnalysis = () => {
    // 清除 sessionStorage
    sessionStorage.removeItem('uploadedFiles');
    sessionStorage.removeItem('additionalText');
    sessionStorage.removeItem('analysisResult');
    
    router.push('/upload');
  };

  const handleViewAnalysisReport = () => {
    setIsLoadingAnalysis(true);
    setTimeout(() => {
      setShowAnalysisReport(true);
      setIsLoadingAnalysis(false);
      // 自動滾動到頁面頂部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleBackToResults = () => {
    setShowAnalysisReport(false);
    // 自動滾動到頁面頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToSmartChat = () => {
    // 確保分析結果已保存到 sessionStorage
    if (analysisResult) {
      sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
    }
    router.push('/smart-chat');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">載入結果中...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">找不到分析結果</p>
          <Button onClick={() => router.push('/upload')}>
            重新開始
          </Button>
        </div>
      </div>
    );
  }

  // 顯示分析載入畫面
  if (isLoadingAnalysis) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-200 border-t-cyan-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-cyan-600 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            正在生成分析報告
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            AI 正在深度分析您的履歷內容...
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 顯示分析報告（第二步）
  if (showAnalysisReport) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* 分析評分組件 */}
          <div className="mb-12">
            <AnalysisScores scores={analysisScores} />
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Button 
              variant="outline" 
              onClick={handleBackToResults}
              className="flex items-center order-1 md:order-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回辨識結果
            </Button>
            
            <div className="flex flex-col md:flex-row gap-4 order-2 md:order-none">
              {/* 檢查是否有 follow_ups 問題來決定是否顯示 Smart Chat 按鈕 */}
              {analysisResult?.missing_content?.follow_ups && analysisResult.missing_content.follow_ups.length > 0 ? (
                <Button 
                  onClick={handleGoToSmartChat}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center"
                >
                  <span className="text-lg mr-2">🤖</span>
                  AI 智慧問答
                </Button>
              ) : (
                <Button 
                  onClick={() => router.push('/suggestions')}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center"
                >
                  <span className="text-lg mr-2">✨</span>
                  查看優化建議
                </Button>
              )}
              <Button 
                onClick={handleNewAnalysis}
                variant="outline"
              >
                開始新的分析
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 顯示辨識結果（第一步）
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Analysis Results Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            履歷內容辨識結果
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI 從您的履歷中提取和分析的詳細內容資訊
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col flex-wrap justify-center gap-4 mb-8">
          <Button
            onClick={handleViewAnalysisReport}
            className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center px-6 py-3 text-lg"
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            查看分析評分報告
          </Button>
          <div className="flex flex-wrap justify-center gap-4 mb-2">

          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="flex items-center"
            >
            <Download className="h-4 w-4 mr-2" />
            匯出 JSON
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex items-center"
            >
            <Share2 className="h-4 w-4 mr-2" />
            分享結果
          </Button>
          <Button
            onClick={handleNewAnalysis}
            variant="outline"
            className="flex items-center"
            >
            <FileText className="h-4 w-4 mr-2" />
            新增分析
          </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {analysisResult.education_background.length}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">個學歷</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                {analysisResult.work_experiences.length}
              </h3>
              <p className="text-sm text-purple-600 dark:text-purple-300">段經歷</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">
                {analysisResult.projects.length}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">個項目</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {analysisResult.achievements.length}
              </h3>
              <p className="text-sm text-orange-600 dark:text-orange-300">項成就</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800">
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 text-cyan-600 dark:text-cyan-400 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">
                {allSkills.length}
              </h3>
              <p className="text-sm text-cyan-600 dark:text-cyan-300">項技能</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="space-y-8">
          {/* Education Background Section - 第一個 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-600" />
                教育背景
              </CardTitle>
              <CardDescription>{analysisResult.education_summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.education_background.length > 0 ? (
                <div className="space-y-6">
                  {analysisResult.education_background.map((edu, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {edu.degree} - {edu.major}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {edu.institution}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                          {edu.duration}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.courses && edu.courses.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">相關課程：</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {edu.courses.map((course, courseIndex) => (
                              <span
                                key={courseIndex}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                              >
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {edu.achievements && edu.achievements.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">學術成就：</span>
                          <ul className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                            {edu.achievements.map((achievement, achIndex) => (
                              <li key={achIndex} className="flex items-start mt-1">
                                <span className="text-blue-500 mr-2">•</span>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <GraduationCap className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到教育背景</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    AI無法從您的履歷中識別出教育背景資訊
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Experience Section - 第二個 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <User className="h-6 w-6 mr-2 text-purple-600" />
                工作經驗
              </CardTitle>
              <CardDescription>{analysisResult.work_experiences_summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.work_experiences.length > 0 ? (
                <div className="space-y-6">
                  {analysisResult.work_experiences.map((exp, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {exp.position}
                          </h4>
                          <p className="text-purple-600 dark:text-purple-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {exp.description}
                      </p>
                      {/* 新增技術棧與貢獻區塊 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {exp.technologies && exp.technologies.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">技術棧：</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exp.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded text-xs"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {exp.contribution && (
                          <div>
                            <span className="font-medium text-gray-600 dark:text-gray-400">主要貢獻：</span>
                            <p className="text-gray-800 dark:text-gray-200 mt-1">{exp.contribution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <User className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到工作經驗</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    AI無法從您的履歷中識別出工作經歷描述
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Section - 第三個 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Briefcase className="h-6 w-6 mr-2 text-green-600" />
                項目分析
              </CardTitle>
              <CardDescription>{analysisResult.projects_summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.projects.length > 0 ? (
                <div className="grid gap-6">
                  {analysisResult.projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h4>
                        {project.duration && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded">
                            {project.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {project.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">技術棧</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.technologies && project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">角色</span>
                          <p className="text-gray-800 dark:text-gray-200 mt-1">{project.role}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600 dark:text-gray-400">主要貢獻</span>
                          <p className="text-gray-800 dark:text-gray-200 mt-1">{project.contribution}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Briefcase className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到項目信息</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    AI無法從您的履歷中識別出項目經驗，請檢查履歷內容是否包含項目描述
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements Section - 第四個 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="h-6 w-6 mr-2 text-orange-600" />
                成就與亮點
              </CardTitle>
              <CardDescription>{analysisResult.achievements_summary}</CardDescription>
            </CardHeader>
            <CardContent>
              {analysisResult.achievements.length > 0 ? (
                <div className="grid gap-3">
                  {analysisResult.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 flex-1">
                        {achievement}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Award className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到成就信息</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    AI無法從您的履歷中識別出成就亮點，請檢查履歷內容是否包含量化的工作成果
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills Section - 第五個 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Code className="h-6 w-6 mr-2 text-green-600" />
                技能分析
              </CardTitle>
              <CardDescription>
                {analysisResult.expertise_summary || "從項目技術棧和專業技能中提取的綜合技能清單"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allSkills.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {allSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-400 dark:text-gray-500 mb-2">
                    <Code className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">未提取到技能信息</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    AI無法從您的履歷中識別出技能專長，請檢查履歷內容是否包含技能描述
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Actions */}
        <div className="md:flex-row flex-col gap-4 flex justify-between items-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => router.push('/analyze')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分析
          </Button>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleViewAnalysisReport}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              查看分析評分
            </Button>
            
            {/* 智慧導航：如果有 follow_ups 問題，顯示 Smart Chat 按鈕；否則直接顯示建議按鈕 */}
            {analysisResult?.missing_content?.follow_ups && analysisResult.missing_content.follow_ups.length > 0 ? (
              <Button 
                onClick={handleGoToSmartChat}
                variant="outline"
                className="flex items-center border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
              >
                <span className="text-lg mr-2">🤖</span>
                AI 智慧問答
              </Button>
            ) : (
              <Button 
                onClick={() => router.push('/suggestions')}
                variant="outline"
                className="flex items-center border-cyan-500 text-cyan-600 hover:bg-cyan-50 dark:border-cyan-400 dark:text-cyan-400 dark:hover:bg-cyan-950/30"
              >
                <span className="text-lg mr-2">✨</span>
                優化建議
              </Button>
            )}
            
            <Button 
              onClick={handleNewAnalysis}
              variant="outline"
            >
              開始新的分析
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 