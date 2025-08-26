"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { AnalysisIllustration } from "@/components/svg-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAnimatedScores } from "./hooks";
import { GRADE_MAPPING } from "./constants";
import { LetterGrade } from "./types";
import { getGradeColors, numberToGrade } from "./utils";
import { Award } from "lucide-react";

export function ResumeScore({ score }: { score: LetterGrade }) {
  const { user } = useAuth();

  // 使用自定義 Hooks
  const { animatedScore, isVisible } = useAnimatedScores(score);

  const gradeColors = getGradeColors();

  // GRADE_MAPPING 需要更新
  const getGradeLevel = (grade: LetterGrade) => GRADE_MAPPING[grade]?.level || "未知";
  
  // GradeComment 需要修改
  const getGradeComment = (grade: LetterGrade) => {
    const displayName = user?.user_metadata?.name ? user?.user_metadata.name + ' ' : '您';
    if (['A+', 'A', 'A-'].includes(grade)) return `${displayName}的履歷整體品質很不錯！`;   
    if (['B+', 'B', 'B-'].includes(grade)) return `${displayName}的履歷還有一些地方可以進一步優化`;
    if (['C+', 'C', 'C-'].includes(grade)) return `${displayName}的履歷需要進行較大程度的改進`;
    return `${displayName}的履歷品質嚴重不足，需要全面重新整理`;
  };

  return (
    <Card className={cn(
      "w-full lg:w-fit h-full flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-1000",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <Award className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          AI 評分
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          基於 AI 深度分析的綜合評估結果
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* 評分圈圈 - 保持置中 */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200 dark:text-gray-700"
                />
                <path
                  d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${animatedScore}, 100`}
                  strokeLinecap="round"
                  className={gradeColors.stroke}
                  style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${gradeColors.stroke.replace('text-', 'text-')} transition-all duration-300`}>
                  {numberToGrade(animatedScore)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {getGradeLevel(score)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 評語內容 - 置中 */}
        <div className="flex items-center justify-center">
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed transition-all duration-500 delay-1200 text-center">
            {getGradeComment(score)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 