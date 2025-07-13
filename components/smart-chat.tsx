"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  calculateCosineSimilarity,
  calculateStringSimilarity,
  getExcerptKey,
  getSuggestionText,
  getTextVector,
  logExcerptVsTemplateContentSimilarity
} from "@/lib/similarity";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from 'react';
import AISuggestionsSidebar, { SuggestionTemplate } from "./smart-chat/ai-suggestions-sidebar";
import CannedMessages from "./smart-chat/canned-messages";
import ChatInput from "./smart-chat/chat-input";
import ChatLimitAlert from "./smart-chat/chat-limit-alert";
import ChatMessageCard from "./smart-chat/chat-message-card";
import LoadingMessage from "./smart-chat/loading-message";
import SuggestionList from "./smart-chat/suggestion-list";
import UserAvatar from "./smart-chat/user-avatar";

// 相似度閾值設定（集中管理，方便調整與維護）
const SIMILARITY_THRESHOLDS = {
  suggestionToSuggestion: 0.90, // 建議與建議
  excerptTitle: 0.80,           // excerpt 與 excerpt 標題
  excerptContent: 0.90,         // excerpt 與 excerpt 內容
  templateMatch: 0.03,          // excerpt/template 與模板的相似度
};

// =====================
// 型別定義
// =====================

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
  };
  quickResponses?: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string; // e.g., "工作經驗", "專案經驗", "技能"
  };
  excerptId?: string; // 用於追蹤 excerpt 的唯一 ID
}

export interface SuggestionRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: Date;
}

// =====================
// 罐頭訊息
// =====================

const CANNED_MESSAGES = [
  "你先問我！",
  '下一題！',
  "我的專案經驗夠吸引人嗎？",
  "我的技能描述可以怎麼改善？",
  "工作經驗的描述有什麼問題？",
  "如何讓我的成就更突出？",
  "履歷格式有什麼建議？",
  "我缺少哪些關鍵資訊？",
  "如何量化我的工作成果？",
  "我的履歷適合哪些職位？",
  "如何突出我的領導能力？",
  "我的教育背景需要補強嗎？"
];

function getRandomCannedMessages(): string[] {
  const fixedFirst = CANNED_MESSAGES[0]; // "你先問我！"
  const others = CANNED_MESSAGES.slice(2);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return [fixedFirst, ...shuffled.slice(0, 3)];
}

// =====================
// Helper Functions
// =====================

// 向量化與相似度


// =====================
// Main Component
// =====================

interface SmartChatProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[]) => void;
  onSkip: (suggestions: SuggestionRecord[]) => void;
}

export default function SmartChat({ analysisResult, onComplete, onSkip }: SmartChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);
  const [suggestionTemplates, setSuggestionTemplates] = useState<SuggestionTemplate[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [cannedOptions, setCannedOptions] = useState<string[]>([]);
  const [visibleExcerptIds, setVisibleExcerptIds] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaRefMobile = useRef<HTMLDivElement>(null);
  const suggestionsScrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefMobile = useRef<HTMLTextAreaElement>(null);
  const messageCounterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRefMobile = useRef<HTMLDivElement>(null);

  const generateUniqueId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  }, []);

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
    for (const template of templates) {
      if (template.status === 'completed') continue;
      const templateText = `${template.title} ${template.description} ${template.originalFollowUp || ''}`;
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

  // 處理 excerpt 並決定是否應該顯示，返回 excerptId
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
  }, [messages, visibleExcerptIds, getExcerptKey, generateUniqueId, isExcerptSimilar]);

  // 檢查 excerpt 是否應該顯示
  const shouldShowExcerpt = useCallback((excerptId?: string) => {
    return excerptId ? visibleExcerptIds.includes(excerptId) : false;
  }, [visibleExcerptIds]);



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
  }, [debugScrollState, getTextVector, calculateCosineSimilarity]);

  // 新增：更新模板狀態
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

  // 新增：從 follow-ups 初始化建議模板
  const initializeSuggestionTemplates = useCallback(() => {
    const followUps = analysisResult?.missing_content?.follow_ups || [];
    
    if (followUps.length > 0) {
      const templates: SuggestionTemplate[] = followUps.map((followUp) => ({
        id: generateUniqueId('template'),
        title: followUp.title,
        description: followUp.question,
        category: '深度追問',
        status: 'pending' as const,
        originalFollowUp: followUp.question,
        timestamp: new Date()
      }));
      
      setSuggestionTemplates(templates);
      console.log(`🎯 [Templates] Initialized ${templates.length} suggestion templates from follow-ups`);
    }
  }, [analysisResult, generateUniqueId]);



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
  const smartScrollToBottom = useCallback((smooth: boolean = false) => {
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
  }, [scrollToBottom, suggestions.length]);

  // 當載入完成時自動 focus 到輸入框
  useEffect(() => {
    if (!isLoading && messageCount > 1) {
      // 使用 requestAnimationFrame 確保在下一個渲染循環中 focus
      requestAnimationFrame(() => {
        setTimeout(() => {
          // 檢查哪個 textarea 是可見的並 focus
          const desktopTextarea = textareaRef.current;
          const mobileTextarea = textareaRefMobile.current;
          
          let targetTextarea = null;
          
          // 檢查大螢幕版本是否可見
          if (desktopTextarea && window.getComputedStyle(desktopTextarea.closest('.hidden') || desktopTextarea).display !== 'none') {
            targetTextarea = desktopTextarea;
          }
          // 檢查小螢幕版本是否可見
          else if (mobileTextarea && window.getComputedStyle(mobileTextarea.closest('.lg\\:hidden') || mobileTextarea).display !== 'none') {
            targetTextarea = mobileTextarea;
          }
          
          if (targetTextarea && 
              !targetTextarea.disabled && 
              messageCount < 30 &&
              document.activeElement !== targetTextarea) {
            console.log('Auto focusing to textarea:', targetTextarea === desktopTextarea ? 'desktop' : 'mobile');
            targetTextarea.focus();
          }
        }, 100);
      });
    }
  }, [isLoading, messageCount]);

  const initializeChat = useCallback(() => {
    // 初始化建議模板
    initializeSuggestionTemplates();
    
    // 取得 follow-up 問題數量
    const followUpCount = analysisResult?.missing_content?.follow_ups?.length || 0;

    const welcomeMessage: ChatMessage = {
      id: generateUniqueId('ai-welcome'),
      type: 'ai',
      content: `嗨，我是你的 AI 履歷優化顧問 Remo！

我已經仔細分析了你的履歷，並準備了 ${followUpCount > 0 ? `${followUpCount} 個深度追問問題` : '幾個專業問題'}來幫你挖掘更多亮點！

你可以主動提問，或讓我基於你的履歷背景主動詢問。我會協助你深入了解專案細節、挖掘遺漏的成就，並提供具體可執行的優化建議。

選擇一個開始的方式，或直接在下方輸入你的問題：`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setMessageCount(1);
    
    // 生成隨機罐頭選項
    setCannedOptions(getRandomCannedMessages());
  }, [generateUniqueId, analysisResult, initializeSuggestionTemplates]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // 處理螢幕尺寸變化
  useEffect(() => {
    const handleResize = () => {
      // 延遲滾動以確保布局完成
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [smartScrollToBottom]);

  useEffect(() => {
    // 使用 requestAnimationFrame 確保在 DOM 更新後滾動
    requestAnimationFrame(() => {
      smartScrollToBottom(false);
      
      // 額外的延遲確保動畫完成
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 100);
      
      // 最後確保滾動
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 300);
    });
  }, [messages, smartScrollToBottom]);

  // 當有新建議時，自動滾動建議面板到底部，並確保主聊天區域也滾動
  useEffect(() => {
    if (suggestions.length > 0) {
      console.log('[Suggestions Effect] New suggestions count:', suggestions.length);
      
      // 滾動建議面板到底部
      requestAnimationFrame(() => {
        scrollToBottom(suggestionsScrollAreaRef, null, true);
      });
      
      // 同時確保主聊天區域滾動到底部（新建議可能影響布局）
      requestAnimationFrame(() => {
        smartScrollToBottom(false);
      });
      
      // 建議面板動畫期間確保滾動
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 200);
      
      // 建議面板動畫完成後最終確保
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 500);
    }
  }, [suggestions, scrollToBottom, smartScrollToBottom]);

  // 當載入狀態改變時，確保滾動到底部（顯示載入動畫）
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        smartScrollToBottom(false);
      }, 100);
    }
  }, [isLoading, smartScrollToBottom]);

  // 新增：自動調整 textarea 高度的函數
  const adjustTextareaHeight = useCallback((value: string) => {
    const textareas = [textareaRef.current, textareaRefMobile.current].filter(Boolean);
    
    textareas.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        
        // 計算內容高度
        const lineHeight = 24; // 假設行高為 24px
        const lines = value.split('\n').length;
        const contentHeight = Math.max(40, lines * lineHeight); // 最小 40px
        const maxHeight = 120;
        
        textarea.style.height = Math.min(contentHeight, maxHeight) + 'px';
      }
    });
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || currentInput.trim();
    if (!textToSend || isLoading || messageCount >= 30) return;

    const userMessage: ChatMessage = {
      id: generateUniqueId('user'),
      type: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);
    setMessageCount(prev => prev + 1);

    // 立即滾動到底部顯示用戶訊息
    setTimeout(() => {
      smartScrollToBottom(false);
    }, 50);

    // 重置 textarea 高度
    [textareaRef.current, textareaRefMobile.current].forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
      }
    });

    try {
      // 準備發送給 API 的訊息
      const apiMessages = [...messages, userMessage].map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: msg.timestamp
      }));

      const response = await fetch('/api/smart-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          analysisResult,
          suggestions: suggestions.map(s => ({
            title: s.title,
            description: s.description,
            category: s.category
          }))
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '請求失敗');
      }

      const { message, suggestion, quickResponses, excerpt } = result.data;

      // 新增：檢查 excerpt 是否與模板相似，如果是則標記為進行中
      let matchedTemplate: SuggestionTemplate | null = null;
      if (excerpt) {
        const excerptText = `${excerpt.title} ${excerpt.content}`;
        matchedTemplate = findMostSimilarTemplate(excerptText, suggestionTemplates) as SuggestionTemplate | null;
        
        if (matchedTemplate && matchedTemplate.status === 'pending') {
          console.log(`🔄 [Template] Marking template "${matchedTemplate.title}" as in_progress due to excerpt match`);
          updateTemplateStatus(matchedTemplate.id, 'in_progress');
        }
      }

      // 處理 excerpt，決定是否顯示並生成 ID
      let excerptId: string | undefined;
      if (excerpt) {
        excerptId = processExcerpt(excerpt) || undefined;
      }

      // 添加 AI 回應
      const aiMessage: ChatMessage = {
        id: generateUniqueId('ai'),
        type: 'ai',
        content: message,
        timestamp: new Date(),
        suggestion,
        quickResponses,
        excerpt,
        excerptId
      };

      setMessages(prev => [...prev, aiMessage]);
      setMessageCount(prev => prev + 1);

      // 更新快速回復選項
      if (quickResponses && Array.isArray(quickResponses)) {
        if (suggestion) {
          // 有 suggestion 時，不顯示「下一題！」
          setCannedOptions(['好呀！', ...quickResponses]);
        } else {
          // 沒有 suggestion 時，顯示「下一題！」在最前面
          setCannedOptions(['下一題！', ...quickResponses]);
        }
      } else {
        setCannedOptions(getRandomCannedMessages());
      }

      // 新增：處理建議並檢查是否與模板相關
      if (suggestion) {
        // 檢查是否與現有建議相似度過高
        if (isSimilarSuggestion(suggestion)) {
          console.log(`🚫 [Suggestion Blocked] Similar suggestion detected, not adding: "${suggestion.title}"`);
        } else {
          // 檢查建議是否與某個模板相關
          const suggestionText = `${suggestion.title} ${suggestion.description}`;
          let relatedTemplate: SuggestionTemplate | null = matchedTemplate; // 優先使用 excerpt 匹配的模板
          
          if (!relatedTemplate) {
            relatedTemplate = findMostSimilarTemplate(suggestionText, suggestionTemplates) as SuggestionTemplate | null;
          }
          
          if (relatedTemplate && relatedTemplate.status === 'in_progress') {
            // 建議與模板相關，更新模板為已完成
            console.log(`✅ [Template] Completing template "${relatedTemplate.title}" with suggestion: "${suggestion.title}"`);
            
            const suggestionRecord: SuggestionRecord = {
              id: generateUniqueId('suggestion'),
              title: suggestion.title,
              description: suggestion.description,
              category: suggestion.category,
              timestamp: new Date()
            };
            
            updateTemplateStatus(relatedTemplate.id, 'completed', suggestionRecord);
          } else {
            // 建議與模板無關，加入額外建議列表
            console.log(`✅ [Suggestion Added] New additional suggestion: "${suggestion.title}"`);
            const suggestionRecord: SuggestionRecord = {
              id: generateUniqueId('suggestion'),
              title: suggestion.title,
              description: suggestion.description,
              category: suggestion.category,
              timestamp: new Date()
            };
            setSuggestions(prev => [...prev, suggestionRecord]);
          }
          
          // 滾動處理邏輯保持不變
          console.log('[Suggestion Added] Starting scroll sequence');
          
          requestAnimationFrame(() => {
            smartScrollToBottom(false);
          });
          
          setTimeout(() => {
            console.log('[Suggestion Added] Mid-animation scroll');
            smartScrollToBottom(false);
          }, 200);
          
          setTimeout(() => {
            console.log('[Suggestion Added] Post-animation scroll');
            smartScrollToBottom(false);
          }, 400);
          
          if (window.innerWidth >= 1024) {
            setTimeout(() => {
              console.log('[Desktop] Layout adjustment scroll');
              smartScrollToBottom(false);
            }, 600);
          }
        }
      } else {
        console.log('ℹ️ [Suggestion] No suggestion provided by AI');
      }
          
      // 確保滾動到底部（在狀態更新後）
      requestAnimationFrame(() => {
        smartScrollToBottom(false);
        
        // 額外確保滾動
        setTimeout(() => {
          smartScrollToBottom(false);
        }, 100);
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: generateUniqueId('ai-error'),
        type: 'ai',
        content: '抱歉，發生了一些問題。請稍後再試。',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setMessageCount(prev => prev + 1);
      
      // 確保滾動到底部（錯誤訊息後）
      requestAnimationFrame(() => {
        smartScrollToBottom(false);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    adjustTextareaHeight(value);
  };

  const handleComplete = () => {
    onComplete(messages, suggestions);
  };

  const removeSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const quoteSuggestion = (suggestion: SuggestionRecord) => {
    const quoteMessage = `關於「${suggestion.title}」這個建議，我想進一步了解：

原建議：${suggestion.description}

我想問：`;
    setCurrentInput(quoteMessage);
    
    // 自動調整高度
    adjustTextareaHeight(quoteMessage);
    
    // Focus 到當前可見的 textarea
    const desktopTextarea = textareaRef.current;
    const mobileTextarea = textareaRefMobile.current;
    
    let targetTextarea = null;
    
    // 檢查大螢幕版本是否可見
    if (desktopTextarea && window.getComputedStyle(desktopTextarea.closest('.hidden') || desktopTextarea).display !== 'none') {
      targetTextarea = desktopTextarea;
    }
    // 檢查小螢幕版本是否可見
    else if (mobileTextarea) {
      targetTextarea = mobileTextarea;
    }
    
    if (targetTextarea) {
      targetTextarea.focus();
      // 將光標移到最後
      setTimeout(() => {
        if (targetTextarea) {
          targetTextarea.setSelectionRange(quoteMessage.length, quoteMessage.length);
        }
      }, 0);
    }
  };



  // 消息動畫變體
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  // 載入動畫變體
  const loadingVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const handleCannedMessage = (message: string) => {
    handleSendMessage(message);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  const removeTemplate = (templateId: string) => {
    setSuggestionTemplates(prev => prev.filter(t => t.id !== templateId));
  };

  const quoteTemplate = (template: SuggestionTemplate) => {
    let quoteMessage = '';
    
    if (template.status === 'completed' && template.completedSuggestion) {
      quoteMessage = `關於「${template.completedSuggestion.title}」這個建議，我想進一步了解：

原建議：${template.completedSuggestion.description}

我想問：`;
    } else {
      quoteMessage = `關於「${template.title}」這個問題：

${template.description}

我想進一步討論：`;
    }
    
    setCurrentInput(quoteMessage);
    
    // 自動調整高度
    adjustTextareaHeight(quoteMessage);
    
    // Focus 到當前可見的 textarea
    const desktopTextarea = textareaRef.current;
    const mobileTextarea = textareaRefMobile.current;
    
    let targetTextarea = null;
    
    if (desktopTextarea && window.getComputedStyle(desktopTextarea.closest('.hidden') || desktopTextarea).display !== 'none') {
      targetTextarea = desktopTextarea;
    } else if (mobileTextarea) {
      targetTextarea = mobileTextarea;
    }
    
    if (targetTextarea) {
      targetTextarea.focus();
      setTimeout(() => {
        if (targetTextarea) {
          targetTextarea.setSelectionRange(quoteMessage.length, quoteMessage.length);
        }
      }, 0);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Full screen container with responsive max-width */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[95vw] lg:max-w-[75vw] h-[80vh]">
          {/* 大螢幕：左右兩欄布局 */}
          <div className="hidden lg:flex items-start gap-6 h-full">
            {/* 左側建議面板 */}
            <AISuggestionsSidebar
              suggestions={suggestions}
              suggestionTemplates={suggestionTemplates}
              onQuote={quoteSuggestion}
              onQuoteTemplate={(item) => {
                if ('status' in item) quoteTemplate(item);
              }}
              onRemove={removeSuggestion}
              onRemoveTemplate={removeTemplate}
              onComplete={handleComplete}
              messageCount={messageCount}
              suggestionsScrollAreaRef={suggestionsScrollAreaRef}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={handleToggleSidebar}
            />

            {/* 右側聊天區域 */}
            <div className="flex-1 h-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">AI 智慧問答</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {messageCount}/30 則對話
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => onSkip(suggestions)} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        跳過問答
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    自由詢問履歷相關問題，AI 助理 Remo 會記錄並提供具體建議
                  </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            variants={messageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                          >
                            <ChatMessageCard message={message} shouldShowExcerpt={shouldShowExcerpt} />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {isLoading && <LoadingMessage />}
                    </div>
                    
                    {/* 隱藏的底部標記元素，用於滾動定位 */}
                    <div ref={messagesEndRef} className="h-0" />
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  {/* 罐頭訊息選項 */}
                  <AnimatePresence mode="popLayout">
                    {cannedOptions.length > 0 && (
                      <CannedMessages cannedOptions={cannedOptions} onCannedMessage={handleCannedMessage} />
                    )}
                  </AnimatePresence>

                  {/* 對話限制提醒 */}
                  <AnimatePresence>
                    {messageCount >= 25 && <ChatLimitAlert messageCount={messageCount} />}
                  </AnimatePresence>

                  {/* 輸入框 */}
                  <ChatInput
                    value={currentInput}
                    onChange={handleTextareaChange}
                    onKeyPress={handleKeyPress}
                    onSend={handleSendMessage}
                    textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                    disabled={isLoading || messageCount >= 30}
                    messageCount={messageCount}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 小螢幕：單欄布局 */}
          <div className="lg:hidden h-full flex flex-col space-y-4">
            {/* 聊天區域 */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center">
                    <span className="text-xl sm:text-2xl mr-2">🤖</span>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">AI 智慧問答</h2>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:space-x-4 gap-2">
                    <div className="text-sm text-gray-500">
                      {messageCount}/30 則對話
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => onSkip(suggestions)} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                      跳過問答
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  自由詢問履歷相關問題，AI 會記錄並提供具體建議
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollAreaRefMobile}>
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          variants={messageVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className={cn(`w-full flex`, message.type === 'user' ? 'justify-end' : 'justify-start')}
                        >
                          <div className={cn("flex items-start space-x-2 max-w-[90%]", message.type === 'user' ? 'flex-row-reverse space-x-reverse' : '')}>
                            {message.type === 'user' ? (
                              <UserAvatar user={user} />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🤖</span>
                              </div>
                            )}
                            <div className="w-fit max-w-full space-y-2">
                              {/* 履歷摘錄卡片 */}
                              {message.excerpt && message.type === 'ai' && shouldShowExcerpt(message.excerptId) && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 max-w-sm">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                                      {message.excerpt.source}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                                    {message.excerpt.title}
                                  </h4>
                                  <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap break-words leading-relaxed">
                                    {message.excerpt.content}
                                  </p>
                                </div>
                              )}
                              
                              {/* 主要消息內容 */}
                              <div
                                className={cn(`rounded-lg px-4 py-3`, message.type === 'user'
                                    ? 'bg-cyan-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                )}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString('zh-TW', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {isLoading && (
                      <motion.div
                        variants={loadingVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-start"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <span className="text-lg">🤖</span>
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
                            <div className="flex space-x-1">
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                              />
                              <motion.div 
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* 隱藏的底部標記元素，用於滾動定位（手機版專用） */}
                  <div ref={messagesEndRefMobile} className="h-0" />
                </ScrollArea>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                {/* 罐頭訊息選項 */}
                <AnimatePresence mode="popLayout">
                  {cannedOptions.length > 0 && (
                    <CannedMessages cannedOptions={cannedOptions} onCannedMessage={handleCannedMessage} />
                  )}
                </AnimatePresence>

                {/* 對話限制提醒 */}
                <AnimatePresence>
                  {messageCount >= 25 && <ChatLimitAlert messageCount={messageCount} />}
                </AnimatePresence>

                {/* 輸入框 */}
                <ChatInput
                  value={currentInput}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  onSend={handleSendMessage}
                  textareaRef={textareaRefMobile as React.RefObject<HTMLTextAreaElement>}
                  disabled={isLoading || messageCount >= 30}
                  messageCount={messageCount}
                />
              </div>
            </div>

            {/* 建議面板（小螢幕時放在下方） */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <SuggestionList
                  suggestions={suggestions}
                  onQuote={quoteSuggestion}
                  onRemove={removeSuggestion}
                  onComplete={handleComplete}
                  messageCount={messageCount}
                  suggestionsScrollAreaRef={suggestionsScrollAreaRef as React.RefObject<HTMLDivElement>}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
} 