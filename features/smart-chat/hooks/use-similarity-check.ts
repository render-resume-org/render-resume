import { useCallback } from 'react';
import {
    calculateCosineSimilarity,
    calculateStringSimilarity,
    getSuggestionText,
    getTextVector,
    logExcerptVsTemplateContentSimilarity
} from "@/features/smart-chat/utils/similarity";
import { ChatMessage, SuggestionRecord } from '../types/resume-editor';
import { SuggestionTemplate } from "../components/ai-suggestions-sidebar";
import { SIMILARITY_THRESHOLDS } from '../lib/resume-editor-config';

export function useSimilarityCheck(
  suggestions: SuggestionRecord[],
  messages: ChatMessage[],
  visibleExcerptIds: string[],
  suggestionTemplates: SuggestionTemplate[]
) {
  // 1. 建議與建議相似度
  const isSimilarSuggestion = useCallback((newSuggestion: { title: string; description: string }): boolean => {
    const newText = getSuggestionText(newSuggestion);
    const newVector = getTextVector(newText);
    console.group(`[Suggestion Similarity] New: "${newSuggestion.title}"`);
    for (const existingSuggestion of suggestions) {
      const existingText = getSuggestionText(existingSuggestion);
      const existingVector = getTextVector(existingText);
      const similarity = calculateCosineSimilarity(newVector, existingVector);
      console.log(`vs Existing: "${existingSuggestion.title}"`);
      console.log(`  - New:        ${newText}`);
      console.log(`  - Existing:   ${existingText}`);
      console.log(`  - Similarity: ${(similarity * 100).toFixed(2)}%`);
      if (similarity >= SIMILARITY_THRESHOLDS.suggestionToSuggestion) {
        console.log(`🚫 [Suggestion Similarity] Blocking similar suggestion (${(similarity * 100).toFixed(1)}% similarity)`);
        console.groupEnd();
        return true;
      }
    }
    console.groupEnd();
    return false;
  }, [suggestions]);

  // 2. excerpt 與 excerpt 及 template 相似度
  const isExcerptSimilar = useCallback((newExcerpt: { title: string; content: string; source: string }): boolean => {
    const displayedExcerpts = messages
      .filter(msg => msg.excerpt && msg.excerptId && visibleExcerptIds.includes(msg.excerptId))
      .map(msg => msg.excerpt!);
    console.group(`[Excerpt Similarity] New: "${newExcerpt.title}"`);
    for (const existingExcerpt of displayedExcerpts) {
      const titleSimilarity = calculateStringSimilarity(newExcerpt.title, existingExcerpt.title);
      const newContentPreview = newExcerpt.content.substring(0, 50);
      const existingContentPreview = existingExcerpt.content.substring(0, 50);
      const contentSimilarity = calculateStringSimilarity(newContentPreview, existingContentPreview);
      console.log(`vs Existing: "${existingExcerpt.title}"`);
      console.log(`  - Title Similarity:   ${(titleSimilarity * 100).toFixed(2)}%`);
      console.log(`  - Content Similarity: ${(contentSimilarity * 100).toFixed(2)}%`);
      if (titleSimilarity >= SIMILARITY_THRESHOLDS.excerptTitle || contentSimilarity >= SIMILARITY_THRESHOLDS.excerptContent) {
        console.log(`🚫 [Excerpt Similarity] Blocking similar excerpt (Title: ${(titleSimilarity * 100).toFixed(1)}%, Content: ${(contentSimilarity * 100).toFixed(1)}%)`);
        console.groupEnd();
        return true;
      }
    }
    logExcerptVsTemplateContentSimilarity(newExcerpt, suggestionTemplates);
    console.groupEnd();
    return false;
  }, [messages, visibleExcerptIds, suggestionTemplates]);

  // 3. template 相似度
  const findMostSimilarTemplate = useCallback((text: string, templates: SuggestionTemplate[]) => {
    let maxSimilarity = 0;
    let mostSimilarTemplate: SuggestionTemplate | null = null;
    const textVector = getTextVector(text);
    console.group(`[Template Similarity] Compare: "${text}"`);
    console.log('Text:', text);
    for (const template of templates) {
      if (template.status === 'completed') continue;
      const templateText = `${template.title} ${template.description}`;
      const templateVector = getTextVector(templateText);
      const similarity = calculateCosineSimilarity(textVector, templateVector);
      console.log(`vs Template: "${template.title}"`);
      console.log(`  - TemplateText: ${templateText}`);
      console.log(`  - Similarity:   ${(similarity * 100).toFixed(2)}%`);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarTemplate = template;
      }
    }
    console.groupEnd();
    if (maxSimilarity >= SIMILARITY_THRESHOLDS.templateMatch) {
      console.log(`✅ [Template Match] Found similar template: "${mostSimilarTemplate?.title}" (${(maxSimilarity * 100).toFixed(1)}%)`);
      return mostSimilarTemplate;
    }
    console.log(`❌ [Template Match] No similar template found (max similarity: ${(maxSimilarity * 100).toFixed(1)}%)`);
    return null;
  }, []);

  return {
    isSimilarSuggestion,
    isExcerptSimilar,
    findMostSimilarTemplate
  };
}