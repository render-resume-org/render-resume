import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare } from "lucide-react";
import type { UnifiedResumeAnalysisResult } from "@/lib/types/resume-unified";

interface ScoreSummaryCardProps {
  analysisResult: UnifiedResumeAnalysisResult;
}

export function ScoreSummaryCard({ analysisResult }: ScoreSummaryCardProps) {
  const { scores, comment } = analysisResult;

  // 根據評分等級設定顏色
  const getScoreColor = (score: string) => {
    if (score.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (score.startsWith('B')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (score.startsWith('C')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (score.startsWith('D')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <Card className="mb-8 border-cyan-200 dark:border-cyan-800 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
          <Star className="h-5 w-5 mr-2 text-cyan-600 dark:text-cyan-400" />
          AI 評分結果
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 評分顯示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              整體評分：
            </span>
            <Badge 
              className={`text-lg font-bold px-4 py-2 ${getScoreColor(scores)}`}
            >
              {scores}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              評分等級
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              A+ 優秀 | A 良好 | B 一般 | C 需改進 | D/F 不及格
            </div>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t border-cyan-200 dark:border-cyan-800" />

        {/* 評論顯示 */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              AI 專業點評
            </span>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
              {comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
