"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisScore } from "./types";

interface ActionSectionProps {
  hasLowGrades: boolean;
  lowGrades: AnalysisScore[];
  isVisible: boolean;
  onStartChat: () => void;
}

export function ActionSection({ 
  hasLowGrades, 
  lowGrades, 
  isVisible,
  onStartChat
}: ActionSectionProps) {
  return (
    <Card className={`bg-white dark:bg-gray-900 border border-orange-200 dark:border-orange-700 shadow transition-all duration-700 delay-2000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-center text-orange-700 dark:text-orange-200 text-lg font-semibold">下一步</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300">
          {hasLowGrades 
            ? `發現 ${lowGrades.length} 個項目評分低於 B+，建議通過 AI 問答來完善這些內容`
            : '您的履歷表現已經很優秀，還是可以和 AI 聊聊，獲得更多專屬優化建議！'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Button 
            onClick={onStartChat}
            className="bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold shadow transition-all px-6 py-2"
          >
            <span className="text-lg mr-2">🤖</span>
            開始 AI 問答優化
          </Button>
        </div>

        {hasLowGrades && (
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800">
            <h4 className="text-sm font-medium text-orange-700 dark:text-orange-200 mb-2 flex items-center">
              <span className="mr-2">⚠️</span>
              建議優化的項目
            </h4>
            <div className="space-y-2">
              {lowGrades.map((score: AnalysisScore, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border border-orange-50 dark:border-orange-700">
                  <span className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                    {score.category}
                  </span>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {score.grade}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 