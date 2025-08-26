"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareTextIcon } from "lucide-react";

interface ResumeCommentProps {
  comment: string;
}

export function ResumeComment({ comment }: ResumeCommentProps) {
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
        {/* 評語 */}
        <div className="py-4">
          <div className="relative">
            {/* 左邊的藍色垂直線 */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-full"></div>
            <div className="pl-6">
              {/* 評語內容 */}
              <div>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {comment}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
