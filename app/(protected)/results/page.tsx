"use client";

import { ResultsDetailedSections } from "@/components/analysis";
import { AnalysisScores } from "@/components/analysis-scores";
import { Button } from "@/components/ui/button";
import type { AnalysisScore, LetterGrade, ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import {
  ArrowLeft
} from "lucide-react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function ResultsPage() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      router.push('/service-selection');
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
          <Button onClick={() => router.push('/service-selection')}>
            重新開始
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <div className="bg-cyan-100 dark:bg-cyan-900/30 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-cyan-600 dark:text-cyan-400" /> */}
            {/* </div> */}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            履歷分析結果
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            AI 深度分析您的履歷內容，提供專業評分與改進建議
          </p>
        </div>

        {/* Analysis Scores Section */}
        <div className="mb-12">
          <AnalysisScores scores={analysisScores} />
        </div>

        {/* Detailed Results */}
        <ResultsDetailedSections analysisResult={analysisResult} allSkills={allSkills} />

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => router.push('/analyze')}
            className="flex items-center order-1 md:order-none"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回分析
          </Button>
          
          <div className="flex flex-col md:flex-row gap-4 order-2 md:order-none">
            
            {/* Smart Chat or Suggestions Button */}
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
          </div>
        </div>
      </div>
    </div>
  );
} 