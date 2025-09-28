import { useCallback, useState } from 'react';
import { ResumeAnalysisResult } from "@/features/resume/types/resume-analysis";
import type { UnifiedResumeAnalysisResult } from "@/features/resume/types/resume-unified";
import { SuggestionTemplate } from "../components/ai-suggestions-sidebar";
import { SuggestionRecord } from '../types/resume-editor';

export function useTemplateManager(
  analysisResult: ResumeAnalysisResult | UnifiedResumeAnalysisResult,
  generateUniqueId: (prefix: string) => string
) {
  const [suggestionTemplates, setSuggestionTemplates] = useState<SuggestionTemplate[]>([]);

  // 更新模板狀態
  const updateTemplateStatus = useCallback((
    templateId: string,
    status: SuggestionTemplate['status'],
    completedSuggestion?: SuggestionRecord
  ) => {
    setSuggestionTemplates(prev => prev.map(template =>
      template.id === templateId
        ? {
            ...template,
            status,
            completedSuggestion,
            timestamp: new Date() // 更新時間戳
          }
        : template
    ));
  }, []);

  // 從 issues 初始化建議模板
  const initializeSuggestionTemplates = useCallback(() => {
    const issues = (analysisResult as UnifiedResumeAnalysisResult | undefined)?.issues || [];

    if (issues.length > 0) {
      const templates: SuggestionTemplate[] = issues.map((issue) => ({
        id: generateUniqueId('template'),
        title: issue.title,
        description: issue.description,
        category: '需改進',
        status: 'pending' as const,
        originalFollowUp: issue.description,
        timestamp: new Date()
      }));

      setSuggestionTemplates(templates);
      console.log(`🎯 [Templates] Initialized ${templates.length} suggestion templates from issues`);
    }
  }, [analysisResult, generateUniqueId]);

  const removeTemplate = useCallback((templateId: string) => {
    setSuggestionTemplates(prev => prev.filter(t => t.id !== templateId));
  }, []);

  return {
    suggestionTemplates,
    setSuggestionTemplates,
    updateTemplateStatus,
    initializeSuggestionTemplates,
    removeTemplate
  };
}