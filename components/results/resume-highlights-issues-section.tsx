// Removed card components in redesign
import type { UnifiedResumeAnalysisResult } from "@/lib/types/resume-unified";
import { AlertTriangle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  analysisResult: UnifiedResumeAnalysisResult;
}

export function ResumeHighlightsIssuesSection({ analysisResult }: Props) {
  const { highlights, issues } = analysisResult;

  return (
    <div className="space-y-8">
      {/* Highlights Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            履歷亮點
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
            基於 AI 深度分析的亮點歸納
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {highlights?.length ? (
            highlights.map((h, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 bg-yellow-500 rounded-full flex-shrink-0 min-h-[60px]"></div>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-foreground text-base">{h.title}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{h.description}</p>
                  {h.excerpt && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded mt-3">
                      {h.excerpt}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">尚無履歷亮點</div>
          )}
        </CardContent>
      </Card>

      {/* Issues Card */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            履歷問題
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
            基於 AI 深度分析的問題歸納
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {issues?.length ? (
            issues.map((it, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1 bg-red-500 rounded-full flex-shrink-0 min-h-[60px]"></div>
                <div className="flex-1 space-y-2">
                  <div className="font-semibold text-foreground text-base">{it.title}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{it.description}</p>
                  {it.excerpt && (
                    <div className="text-xs text-gray-600 dark:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded mt-3">
                      {it.excerpt}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-300">尚無履歷問題</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}