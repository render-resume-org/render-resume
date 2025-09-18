import type { UnifiedIssue } from '@/types/resume-unified';
import type { SuggestionTemplate } from './ai-suggestions-sidebar';

export function issuesToTemplates(issues: UnifiedIssue[], genId: (p: string) => string): SuggestionTemplate[] {
  return (issues || []).map((issue) => ({
    id: genId('template'),
    title: issue.title,
    description: issue.description,
    category: '需改進',
    status: 'pending',
    originalFollowUp: issue.description,
    timestamp: new Date()
  }));
}