// Removed card components in redesign
import type { UnifiedResumeAnalysisResult } from "@/lib/types/resume-unified";
import { AlertTriangle, Lightbulb } from "lucide-react";

interface Props {
  analysisResult: UnifiedResumeAnalysisResult;
  allSkills?: string[];
  hideResumeCard?: boolean;
}

export function UnifiedResultsDetailedSections({ analysisResult, hideResumeCard = false }: Props) {
  const { highlights, issues } = analysisResult;

  return (
    <div className="space-y-8">
      {hideResumeCard ? null : null}

      {/* Highlights - redesigned */}
      <section>
        <div className="mb-3">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            <Lightbulb className="h-4 w-4 mr-1" /> 亮點 Highlights
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights?.length ? (
            highlights.map((h, i) => (
              <div key={i} className="rounded-lg border border-yellow-200 dark:border-yellow-900 bg-white dark:bg-gray-900 p-4 shadow-sm">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{h.title}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">{h.description}</p>
                {h.excerpt && (
                  <blockquote className="text-xs text-gray-600 dark:text-gray-400 bg-yellow-50 dark:bg-yellow-900/20 border-l-2 border-yellow-400 pl-2 py-1 rounded">
                    {h.excerpt}
                  </blockquote>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">尚無亮點</div>
          )}
        </div>
      </section>

      {/* Issues - redesigned */}
      <section>
        <div className="mb-3">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <AlertTriangle className="h-4 w-4 mr-1" /> 改進建議 Issues
          </div>
        </div>
        <div className="space-y-4">
          {issues?.length ? (
            issues.map((it, i) => (
              <div key={i} className="rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 p-4 shadow-sm">
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{it.title}</div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{it.description}</p>
                <div className="text-sm text-gray-800 dark:text-gray-200"><span className="font-medium">建議：</span>{it.suggested_change}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="font-medium">缺失：</span>{it.missing_information}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="font-medium">影響：</span>{it.impact}</div>
                {it.excerpt && (
                  <blockquote className="text-xs text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-400 pl-2 py-1 rounded mt-2">
                    {it.excerpt}
                  </blockquote>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500">尚無需改進之處</div>
          )}
        </div>
      </section>
    </div>
  );
}