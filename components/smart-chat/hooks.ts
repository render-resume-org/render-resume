import {
    calculateCosineSimilarity,
    calculateStringSimilarity,
    getExcerptKey,
    getSuggestionText,
    getTextVector,
    logExcerptVsTemplateContentSimilarity
} from "@/lib/similarity";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useCallback, useEffect, useRef, useState } from 'react';
import { SuggestionTemplate } from "./ai-suggestions-sidebar";
import { ChatMessage, SuggestionRecord } from './types';
import { SIMILARITY_THRESHOLDS, getRandomCannedMessages } from './utils';

// 生成唯一 ID 的 hook
export function useUniqueId() {
  const messageCounterRef = useRef(0);
  
  const generateUniqueId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  }, []);

  return generateUniqueId;
}

// 相似度檢查的 hook
export function useSimilarityCheck(suggestions: SuggestionRecord[], messages: ChatMessage[], visibleExcerptIds: string[], suggestionTemplates: SuggestionTemplate[]) {
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

// Excerpt 處理的 hook
export function useExcerptProcessor(messages: ChatMessage[], visibleExcerptIds: string[], setVisibleExcerptIds: React.Dispatch<React.SetStateAction<string[]>>, generateUniqueId: (prefix: string) => string, isExcerptSimilar: (excerpt: { title: string; content: string; source: string }) => boolean) {
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

// 滾動處理的 hook
export function useScrollManager() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaRefMobile = useRef<HTMLDivElement>(null);
  const suggestionsScrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRefMobile = useRef<HTMLDivElement>(null);

  // 改進的自動滾動函數 - 專門針對 Radix UI ScrollArea
  const scrollToBottom = useCallback((scrollAreaRef: React.RefObject<HTMLDivElement | null>, messagesEndRef: React.RefObject<HTMLDivElement | null> | null, smooth: boolean = false) => {
    console.log('[ScrollToBottom] Attempting to scroll, refs:', {
      scrollAreaRef: !!scrollAreaRef.current,
      messagesEndRef: !!messagesEndRef?.current,
      smooth
    });

    if (!scrollAreaRef.current) {
      console.warn('[ScrollToBottom] No scrollAreaRef available');
      return;
    }

    // 查找 Radix UI ScrollArea 的 viewport
    const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
    
    if (!viewport) {
      console.warn('[ScrollToBottom] No viewport found in ScrollArea');
      return;
    }

    console.log('[ScrollToBottom] Found viewport:', viewport, 'scrollHeight:', viewport.scrollHeight, 'clientHeight:', viewport.clientHeight);

    // 方法1: 優先使用 messagesEndRef 的 scrollIntoView
    if (messagesEndRef?.current) {
      try {
        console.log('[ScrollToBottom] Trying scrollIntoView on messagesEndRef');
        messagesEndRef.current.scrollIntoView({ 
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end',
          inline: 'nearest'
        });
        console.log('[ScrollToBottom] scrollIntoView successful');
        return;
      } catch (error) {
        console.warn('[ScrollToBottom] scrollIntoView failed:', error);
      }
    }
    
    // 方法2: 直接設置 viewport 的 scrollTop
    try {
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      console.log('[ScrollToBottom] Setting scrollTop to:', maxScroll);
      
      if (smooth) {
        viewport.scrollTo({
          top: maxScroll,
          behavior: 'smooth'
        });
      } else {
        viewport.scrollTop = maxScroll;
      }
      
      console.log('[ScrollToBottom] Manual scroll completed, actual scrollTop:', viewport.scrollTop);
      
      // 使用 requestAnimationFrame 確保滾動
      requestAnimationFrame(() => {
        viewport.scrollTop = maxScroll;
        console.log('[ScrollToBottom] RAF scroll, final scrollTop:', viewport.scrollTop);
      });
      
    } catch (error) {
      console.warn('[ScrollToBottom] Manual scroll failed:', error);
    }
  }, []);

  // 智能滾動函數 - 根據當前螢幕尺寸選擇正確的容器
  const smartScrollToBottom = useCallback((smooth: boolean = false, suggestions: SuggestionRecord[] = []) => {
    // 檢查當前是否為手機版視窗
    const isMobile = window.innerWidth < 1024; // lg 斷點
    
    console.log(`[SmartScroll] Screen width: ${window.innerWidth}, isMobile: ${isMobile}, suggestions: ${suggestions.length}`);
    
    if (isMobile) {
      // 手機版滾動
      console.log('[SmartScroll] Using mobile scroll');
      scrollToBottom(scrollAreaRefMobile, messagesEndRefMobile, smooth);
    } else {
      // 桌面版滾動
      console.log('[SmartScroll] Using desktop scroll');
      scrollToBottom(scrollAreaRef, messagesEndRef, smooth);
      
      // 桌面版額外確保 - 建議面板可能影響布局
      if (suggestions.length > 0) {
        console.log('[SmartScroll] Desktop with suggestions - additional scroll attempts');
        setTimeout(() => {
          scrollToBottom(scrollAreaRef, messagesEndRef, false);
        }, 100);
      }
    }
  }, [scrollToBottom]);

  return {
    scrollAreaRef,
    scrollAreaRefMobile,
    suggestionsScrollAreaRef,
    messagesEndRef,
    messagesEndRefMobile,
    scrollToBottom,
    smartScrollToBottom
  };
}

// 模板管理的 hook
export function useTemplateManager(analysisResult: ResumeAnalysisResult, generateUniqueId: (prefix: string) => string) {
  const [suggestionTemplates, setSuggestionTemplates] = useState<SuggestionTemplate[]>([]);

  // 更新模板狀態
  const updateTemplateStatus = useCallback((templateId: string, status: SuggestionTemplate['status'], completedSuggestion?: SuggestionRecord) => {
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
    const issues = analysisResult?.issues || [];
    
    if (issues.length > 0) {
      const templates: SuggestionTemplate[] = issues.map((issue) => ({
        id: generateUniqueId('template'),
        title: issue.title,
        description: issue.description,
        category: '履歷優化',
        status: 'pending' as const,
        originalFollowUp: `${issue.description} 建議改進：${issue.suggested_change}`,
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

// 輸入處理的 hook
export function useInputManager() {
  const [currentInput, setCurrentInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefMobile = useRef<HTMLTextAreaElement>(null);

  // 自動調整 textarea 高度的函數
  const adjustTextareaHeight = useCallback((value: string) => {
    // 手機版不自動調整高度
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const textareas = [textareaRef.current, textareaRefMobile.current].filter(Boolean);
    textareas.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        const lineHeight = 24;
        const lines = value.split('\n').length;
        const contentHeight = Math.max(40, lines * lineHeight);
        const maxHeight = 120;
        textarea.style.height = Math.min(contentHeight, maxHeight) + 'px';
      }
    });
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    adjustTextareaHeight(value);
  }, [setCurrentInput, adjustTextareaHeight]);

  const resetTextareaHeight = useCallback(() => {
    [textareaRef.current, textareaRefMobile.current].forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
      }
    });
  }, []);

  return {
    currentInput,
    setCurrentInput,
    textareaRef,
    textareaRefMobile,
    adjustTextareaHeight,
    handleTextareaChange,
    resetTextareaHeight
  };
}

// 罐頭訊息的 hook
export function useCannedMessages() {
  const [cannedOptions, setCannedOptions] = useState<string[]>([]);

  const initializeCannedMessages = useCallback(() => {
    setCannedOptions(getRandomCannedMessages());
  }, []);

  const updateCannedOptions = useCallback((quickResponses?: string[], hasSuggestion: boolean = false) => {
    if (quickResponses && Array.isArray(quickResponses)) {
      if (hasSuggestion) {
        // 有 suggestion 時，不顯示「下一題！」
        setCannedOptions(['好呀！', ...quickResponses]);
      } else {
        // 沒有 suggestion 時，顯示「下一題！」在最前面
        setCannedOptions(['下一題！', ...quickResponses]);
      }
    } else {
      setCannedOptions(getRandomCannedMessages());
    }
  }, []);

  return {
    cannedOptions,
    setCannedOptions,
    initializeCannedMessages,
    updateCannedOptions
  };
}

// 調試的 hook
export function useDebugHelpers(scrollAreaRef: React.RefObject<HTMLDivElement>, scrollAreaRefMobile: React.RefObject<HTMLDivElement>, messagesEndRef: React.RefObject<HTMLDivElement>, messagesEndRefMobile: React.RefObject<HTMLDivElement>, messages: ChatMessage[], suggestions: SuggestionRecord[]) {
  // 調試函數：檢查滾動容器的狀態
  const debugScrollState = useCallback(() => {
    const isMobile = window.innerWidth < 1024;
    const currentRef = isMobile ? scrollAreaRefMobile : scrollAreaRef;
    const currentEndRef = isMobile ? messagesEndRefMobile : messagesEndRef;
    
    console.log('=== SCROLL DEBUG ===');
    console.log('Screen width:', window.innerWidth, 'isMobile:', isMobile);
    console.log('ScrollArea ref exists:', !!currentRef.current);
    console.log('MessagesEnd ref exists:', !!currentEndRef.current);
    
    if (currentRef.current) {
      const viewport = currentRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;
      console.log('Viewport found:', !!viewport);
      
      if (viewport) {
        console.log('Viewport scrollHeight:', viewport.scrollHeight);
        console.log('Viewport clientHeight:', viewport.clientHeight);
        console.log('Viewport scrollTop:', viewport.scrollTop);
        console.log('Max scroll:', viewport.scrollHeight - viewport.clientHeight);
        console.log('Is at bottom:', viewport.scrollTop >= (viewport.scrollHeight - viewport.clientHeight - 10));
      }
    }
    
    if (currentEndRef.current) {
      const rect = currentEndRef.current.getBoundingClientRect();
      console.log('MessagesEnd position:', rect);
    }
    
    console.log('Messages count:', messages.length);
    console.log('Suggestions count:', suggestions.length);
    console.log('===================');
  }, [scrollAreaRef, scrollAreaRefMobile, messagesEndRef, messagesEndRefMobile, messages.length, suggestions.length]);

  // 暴露調試函數到 window 對象（僅開發環境）
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as { 
        debugScrollState?: () => void;
        testSimilarity?: (text1: string, text2: string) => void;
      }).debugScrollState = debugScrollState;
      
      (window as { 
        debugScrollState?: () => void;
        testSimilarity?: (text1: string, text2: string) => void;
      }).testSimilarity = (text1: string, text2: string) => {
        const vec1 = getTextVector(text1);
        const vec2 = getTextVector(text2);
        const similarity = calculateCosineSimilarity(vec1, vec2);
        console.log(`📊 Similarity between "${text1}" and "${text2}": ${(similarity * 100).toFixed(1)}%`);
        return similarity;
      };
      
      console.log('💡 Debug functions available:');
      console.log('  - window.debugScrollState()');
      console.log('  - window.testSimilarity("text1", "text2")');
    }
  }, [debugScrollState]);

  return {
    debugScrollState
  };
} 