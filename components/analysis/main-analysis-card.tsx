"use client";

import { AnalysisIllustration } from "@/components/svg-icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GRADE_MAPPING } from "./constants";
import { LetterGrade, User } from "./types";
import { getGradeColors, numberToGrade } from "./utils";

interface MainAnalysisCardProps {
  overallGrade: LetterGrade;
  animatedOverallScore: number;
  user: User | null;
  isVisible: boolean;
}

export function MainAnalysisCard({ 
  overallGrade, 
  animatedOverallScore, 
  user,
  isVisible 
}: MainAnalysisCardProps) {
  const gradeColors = getGradeColors();
  const getGradeLevel = (grade: LetterGrade) => GRADE_MAPPING[grade]?.level || "未知";
  
  const getGradeComment = (grade: LetterGrade) => {
    const displayName = user?.user_metadata?.name ? user?.user_metadata.name + ' ' : '您';
    if (['A+', 'A', 'A-'].includes(grade)) return `${displayName}的履歷整體品質很不錯！`;   
    if (['B+', 'B', 'B-'].includes(grade)) return `${displayName}的履歷還有一些地方可以進一步優化`;
    if (['C+', 'C', 'C-'].includes(grade)) return `${displayName}的履歷需要進行較大程度的改進`;
    return `${displayName}的履歷品質嚴重不足，需要全面重新整理`;
  };

  return (
    <Card className={cn(
      "w-full md:w-fit px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-1000",
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    )}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
        </CardTitle>
        <CardDescription>
          基於 AI 深度分析的綜合評估結果
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative flex items-center justify-center w-40 h-40 mb-4 mx-auto">
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
                strokeDasharray={`${animatedOverallScore}, 100`}
                strokeLinecap="round"
                className={gradeColors.stroke}
                style={{ transition: 'stroke-dasharray 0.3s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${gradeColors.stroke.replace('text-', 'text-')} transition-all duration-300`}>
                {numberToGrade(animatedOverallScore)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getGradeLevel(overallGrade)}
              </span>
            </div>
          </div>

          {/* Inserted SVG illustration below the overall grade */}
          <div className="flex justify-center mt-6 mb-6">
            <AnalysisIllustration />
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto transition-all duration-500 delay-1200">
            {getGradeComment(overallGrade)}
          </p>
        </div>

          {/* 分享功能區 - 仿照 service-selection 風格 */}
          {/* <div className="order-2 md:order-2">
            <div className="h-full flex flex-col justify-center">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                  <Share2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  分享你的成果
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                  炫耀一下你的履歷評分，讓朋友們也來挑戰看看！
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleShareText}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已複製！
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      分享文字
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handlePreviewImage}
                  variant="outline"
                  disabled={isGeneratingImage}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30 flex items-center justify-center"
                >
                  {isGeneratingImage ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      生成預覽圖片
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div> */}
      </CardContent>
    </Card>
  );
} 