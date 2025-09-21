import { useCallback } from 'react';
import { getExcerptKey } from "@/features/smart-chat/utils/similarity";
import { ChatMessage } from '../types/resume-editor';

export function useExcerptProcessor(
  messages: ChatMessage[],
  visibleExcerptIds: string[],
  setVisibleExcerptIds: React.Dispatch<React.SetStateAction<string[]>>,
  generateUniqueId: (prefix: string) => string,
  isExcerptSimilar: (excerpt: { title: string; content: string; source: string }) => boolean
) {
  const processExcerpt = useCallback((excerpt: { title: string; content: string; source: string }) => {
    const excerptKey = getExcerptKey(excerpt);

    // 檢查是否已經有相同內容的 excerpt 在顯示列表中
    const existingMessages = messages.filter(msg =>
      msg.excerpt &&
      getExcerptKey(msg.excerpt) === excerptKey &&
      msg.excerptId &&
      visibleExcerptIds.includes(msg.excerptId)
    );

    if (existingMessages.length > 0) {
      // 已經有相同的 excerpt 在顯示，返回 null 表示不顯示
      console.log(`🚫 [Excerpt Blocked] Exact duplicate detected: "${excerpt.title}"`);
      return null;
    }

    // 檢查相似度
    if (isExcerptSimilar(excerpt)) {
      console.log(`🚫 [Excerpt Blocked] Similar excerpt detected, not displaying: "${excerpt.title}"`);
      return null;
    }

    // 第一次出現且無高相似度，生成新的 ID 並加入顯示列表
    console.log(`✅ [Excerpt Added] New unique excerpt: "${excerpt.title}"`);
    const newExcerptId = generateUniqueId('excerpt');
    setVisibleExcerptIds(prev => [...prev, newExcerptId]);
    return newExcerptId;
  }, [messages, visibleExcerptIds, setVisibleExcerptIds, generateUniqueId, isExcerptSimilar]);

  const shouldShowExcerpt = useCallback((excerptId?: string) => {
    return excerptId ? visibleExcerptIds.includes(excerptId) : false;
  }, [visibleExcerptIds]);

  return {
    processExcerpt,
    shouldShowExcerpt
  };
}