import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useCallback, useEffect, useState } from 'react';
import { SuggestionTemplate } from "./ai-suggestions-sidebar";
import {
    useCannedMessages,
    useDebugHelpers,
    useExcerptProcessor,
    useInputManager,
    useScrollManager,
    useSimilarityCheck,
    useTemplateManager,
    useUniqueId
} from './hooks';
import { ChatMessage, SuggestionRecord } from './types';

interface UseChatLogicProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[]) => void;
  onSkip: (suggestions: SuggestionRecord[]) => void;
}

export function useChatLogic({ analysisResult, onComplete, onSkip }: UseChatLogicProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [visibleExcerptIds, setVisibleExcerptIds] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false);

  // 使用各種 hooks
  const generateUniqueId = useUniqueId();
  const { 
    suggestionTemplates, 
    setSuggestionTemplates, 
    updateTemplateStatus, 
    initializeSuggestionTemplates,
    removeTemplate 
  } = useTemplateManager(analysisResult, generateUniqueId);
  
  const { isSimilarSuggestion, isExcerptSimilar, findMostSimilarTemplate } = useSimilarityCheck(
    suggestions,
    messages,
    visibleExcerptIds,
    suggestionTemplates
  );
  
  const { processExcerpt, shouldShowExcerpt } = useExcerptProcessor(
    messages,
    visibleExcerptIds,
    setVisibleExcerptIds,
    generateUniqueId,
    isExcerptSimilar
  );
  
  const {
    scrollAreaRef,
    scrollAreaRefMobile,
    suggestionsScrollAreaRef,
    messagesEndRef,
    messagesEndRefMobile,
    scrollToBottom,
    smartScrollToBottom
  } = useScrollManager();
  
  const {
    currentInput,
    setCurrentInput,
    textareaRef,
    textareaRefMobile,
    adjustTextareaHeight,
    handleTextareaChange,
    resetTextareaHeight
  } = useInputManager();
  
  const {
    cannedOptions,
    setCannedOptions,
    initializeCannedMessages,
    updateCannedOptions
  } = useCannedMessages();
  
  const { debugScrollState } = useDebugHelpers(
    scrollAreaRef,
    scrollAreaRefMobile,
    messagesEndRef,
    messagesEndRefMobile,
    messages,
    suggestions
  );

  // 初始化聊天
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
    initializeCannedMessages();
  }, [generateUniqueId, analysisResult, initializeSuggestionTemplates, initializeCannedMessages]);

  // 發送訊息的主要邏輯
  const handleSendMessage = useCallback(async (messageText?: string) => {
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
      smartScrollToBottom(false, suggestions);
    }, 50);

    // 重置 textarea 高度
    resetTextareaHeight();

    try {
      // 準備發送給 API 的訊息（確保 timestamp 為 string，且只含純資料）
      const apiMessages = [...messages, userMessage].map(msg => ({
        type: msg.type,
        content: msg.content,
        timestamp: typeof msg.timestamp === 'string' ? msg.timestamp : (msg.timestamp?.toISOString?.() || ''),
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

      // 檢查 excerpt 是否與模板相似，如果是則標記為進行中
      let matchedTemplate: SuggestionTemplate | null = null;
      if (excerpt) {
        const excerptText = `${excerpt.title} ${excerpt.content}`;
        matchedTemplate = findMostSimilarTemplate(excerptText, suggestionTemplates) as SuggestionTemplate | null;
        console.log('🔍 [Template] Matched template:', matchedTemplate);
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
      updateCannedOptions(quickResponses, !!suggestion);

      // 處理建議並檢查是否與模板相關
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
          
          if (relatedTemplate && (relatedTemplate.status === 'in_progress' || relatedTemplate.status === 'completed')) {
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
          
          // 滾動處理
          console.log('[Suggestion Added] Starting scroll sequence');
          
          requestAnimationFrame(() => {
            smartScrollToBottom(false, suggestions);
          });
          
          setTimeout(() => {
            console.log('[Suggestion Added] Mid-animation scroll');
            smartScrollToBottom(false, suggestions);
          }, 200);
          
          setTimeout(() => {
            console.log('[Suggestion Added] Post-animation scroll');
            smartScrollToBottom(false, suggestions);
          }, 400);
          
          if (window.innerWidth >= 1024) {
            setTimeout(() => {
              console.log('[Desktop] Layout adjustment scroll');
              smartScrollToBottom(false, suggestions);
            }, 600);
          }
        }
      } else {
        console.log('ℹ️ [Suggestion] No suggestion provided by AI');
      }
          
      // 確保滾動到底部（在狀態更新後）
      requestAnimationFrame(() => {
        smartScrollToBottom(false, suggestions);
        
        // 額外確保滾動
        setTimeout(() => {
          smartScrollToBottom(false, suggestions);
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
        smartScrollToBottom(false, suggestions);
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    currentInput, 
    isLoading, 
    messageCount, 
    generateUniqueId, 
    messages, 
    suggestions, 
    smartScrollToBottom, 
    resetTextareaHeight, 
    analysisResult, 
    findMostSimilarTemplate, 
    suggestionTemplates, 
    updateTemplateStatus, 
    processExcerpt, 
    updateCannedOptions, 
    isSimilarSuggestion, 
    setSuggestions
  ]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleCannedMessage = useCallback((message: string) => {
    handleSendMessage(message);
    // 多次延遲 scroll，確保訊息渲染後手機/桌面都能正確滾動
    setTimeout(() => smartScrollToBottom(false, suggestions), 100);
    setTimeout(() => smartScrollToBottom(false, suggestions), 300);
    setTimeout(() => smartScrollToBottom(false, suggestions), 600);
  }, [handleSendMessage, smartScrollToBottom, suggestions]);

  const handleComplete = useCallback(() => {
    onComplete(messages, suggestions);
  }, [messages, suggestions, onComplete]);

  const removeSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  const quoteSuggestion = useCallback((suggestion: SuggestionRecord) => {
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
  }, [setCurrentInput, adjustTextareaHeight, textareaRef, textareaRefMobile]);

  const quoteTemplate = useCallback((template: SuggestionTemplate) => {
    let quoteMessage = '';
    if (template.status === 'completed' && template.completedSuggestion) {
      quoteMessage = `關於「${template.completedSuggestion.title}」這個建議，我想進一步了解：\n\n原建議：${template.completedSuggestion.description}\n\n我想問：`;
    } else {
      quoteMessage = `關於「${template.title}」這個問題：\n\n${template.description}\n\n我想進一步討論：`;
    }
    setCurrentInput(quoteMessage);
    adjustTextareaHeight(quoteMessage);
    // focus input (手機/電腦都適用)
    setTimeout(() => {
      const desktopTextarea = textareaRef.current;
      const mobileTextarea = textareaRefMobile.current;
      let target: HTMLTextAreaElement | null = null;
      if (desktopTextarea && window.getComputedStyle(desktopTextarea.closest('.hidden') || desktopTextarea).display !== 'none') {
        target = desktopTextarea;
      } else if (mobileTextarea) {
        target = mobileTextarea;
      }
      if (target) {
        target.focus();
        target.setSelectionRange(quoteMessage.length, quoteMessage.length);
      }
    }, 0);
  }, [setCurrentInput, adjustTextareaHeight, textareaRef, textareaRefMobile]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // 初始化
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

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
  }, [isLoading, messageCount, textareaRef, textareaRefMobile]);

  // 處理螢幕尺寸變化
  useEffect(() => {
    const handleResize = () => {
      // 延遲滾動以確保布局完成
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [smartScrollToBottom, suggestions]);

  // 訊息更新時滾動
  useEffect(() => {
    // 使用 requestAnimationFrame 確保在 DOM 更新後滾動
    requestAnimationFrame(() => {
      smartScrollToBottom(false, suggestions);
      
      // 額外的延遲確保動畫完成
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 100);
      
      // 最後確保滾動
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 300);
    });
  }, [messages, smartScrollToBottom, suggestions]);

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
        smartScrollToBottom(false, suggestions);
      });
      
      // 建議面板動畫期間確保滾動
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 200);
      
      // 建議面板動畫完成後最終確保
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 500);
    }
  }, [suggestions, scrollToBottom, smartScrollToBottom, suggestionsScrollAreaRef]);

  // 當載入狀態改變時，確保滾動到底部（顯示載入動畫）
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        smartScrollToBottom(false, suggestions);
      }, 100);
    }
  }, [isLoading, smartScrollToBottom, suggestions]);

  return {
    // 狀態
    messages,
    suggestions,
    suggestionTemplates,
    isLoading,
    messageCount,
    cannedOptions,
    currentInput,
    isSidebarCollapsed,
    showSuggestionsDrawer,
    setShowSuggestionsDrawer,
    
    // Refs
    scrollAreaRef,
    scrollAreaRefMobile,
    suggestionsScrollAreaRef,
    messagesEndRef,
    messagesEndRefMobile,
    textareaRef,
    textareaRefMobile,
    
    // 函數
    handleSendMessage,
    handleKeyPress,
    handleTextareaChange,
    handleCannedMessage,
    handleComplete,
    handleToggleSidebar,
    removeSuggestion,
    removeTemplate,
    quoteSuggestion,
    quoteTemplate,
    shouldShowExcerpt,
    onSkip
  };
} 