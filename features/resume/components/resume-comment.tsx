"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareTextIcon, Lightbulb, AlertTriangle } from "lucide-react";

interface ResumeCommentProps {
  comment: string;
  highlightsCount: number;
  issuesCount: number;
}

export function ResumeComment({ comment, highlightsCount, issuesCount }: ResumeCommentProps) {
  return (
    <Card className="w-full h-full flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
          <MessageSquareTextIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          AI 評語
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
          基於 AI 深度分析的推理過程與評斷依據
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div>
          {/* 評語內容 */}
          <div>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {comment}
            </p>
          </div>
          
          {/* 統計信息 */}
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              偵測到 {highlightsCount} 個履歷亮點
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              偵測到 {issuesCount} 個履歷問題
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
