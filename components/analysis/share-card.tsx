"use client";

import { cn } from "@/lib/utils";
import { GRADE_MAPPING } from "./constants";
import { AnalysisScore, LetterGrade } from "./types";
import { getGradeColors } from "./utils";

interface ShareCardProps {
  scores: AnalysisScore[];
  overallGrade: LetterGrade;
}

export function ShareCard({ scores, overallGrade }: ShareCardProps) {
  const getGradeLevel = (grade: LetterGrade) => GRADE_MAPPING[grade]?.level || "未知";
  const getGradeEmoji = (grade: LetterGrade) => GRADE_MAPPING[grade]?.emoji || '💪';
  
  const getGradeComment = (grade: LetterGrade) => {
    if (['A+', 'A', 'A-'].includes(grade)) return `的履歷整體品質很不錯！`;   
    if (['B+', 'B', 'B-'].includes(grade)) return `的履歷還有一些地方可以進一步優化`;
    if (['C+', 'C', 'C-'].includes(grade)) return `的履歷需要進行較大程度的改進`;
    return `的履歷品質嚴重不足，需要全面重新整理`;
  };

  return (
    <div 
      className="absolute -top-[9999px] left-0 w-[400px] bg-white shadow-xl rounded-2xl overflow-hidden"
      style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: -1
      }}
    >
      {/* Header */}
      <div className="bg-cyan-600 text-white py-1 px-4">
        <div className="flex items-center justify-start space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-lg">✨</span>
          </div>
          <div className="text-left">
            <h1 className="text-lg text-white leading-tight">RenderResume</h1>
            <p className="text-cyan-100 text-xs leading-tight">懶得履歷．AI 履歷生成器</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Overall Grade Display */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">總體評級</h2>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-28 h-28 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white">
                  <div className={cn('w-24 h-24 rounded-full border-4 flex items-center justify-center',
                    ['A+', 'A', 'A-'].includes(overallGrade) && 'border-green-500 bg-green-50',
                    ['B+', 'B', 'B-'].includes(overallGrade) && 'border-orange-500 bg-orange-50',
                    ['C+', 'C', 'C-'].includes(overallGrade) && 'border-red-500 bg-red-50'
                  )}>  
                    <div className="text-center w-full -translate-y-2">
                      <div className={cn('text-2xl font-bold leading-none', {
                        'text-green-600': ['A+', 'A', 'A-'].includes(overallGrade),
                        'text-orange-600': ['B+', 'B', 'B-'].includes(overallGrade),
                        'text-red-600': ['C+', 'C', 'C-'].includes(overallGrade)
                      })}>
                        {overallGrade}
                      </div>
                      <div className={`text-xs font-medium leading-none mt-1 ${
                        ['A+', 'A', 'A-'].includes(overallGrade) ? 'text-green-600' :
                        ['B+', 'B', 'B-'].includes(overallGrade) ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {getGradeLevel(overallGrade)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs text-gray-500">{getGradeEmoji(overallGrade)} {getGradeComment(overallGrade)}</div>
            </div>
          </div>
        </div>

        {/* Detailed Scores */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            {scores.slice(0, 4).map((score, index) => {
              const colors = getGradeColors();
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                  <div className="text-xl mb-2">{score.icon}</div>
                  <div className="text-xs font-medium text-gray-700 mb-2 leading-tight">{score.category}</div>
                  <div className={`text-lg font-bold ${colors.stroke}`}>
                    {score.grade}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4 pb-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">你也想測試你的履歷嗎？快上 RenderResume 看看吧！</p>
          <div className="px-4 py-2 rounded-lg inline-block">
            <p className="font-semibold text-sm">www.render-resume.com</p>
          </div>
        </div>
      </div>
    </div>
  );
} 