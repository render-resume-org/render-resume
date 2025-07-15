import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useCallback, useEffect, useState } from 'react';
import { SuggestionTemplate } from "./ai-suggestions-sidebar";
import {
    useCannedMessages,
    useInputManager,
    useScrollManager,
    useSimilarityCheck,
    useTemplateManager
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
  const [visibleExcerptIds] = useState<string[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false);
  // 移除 shouldBlockNextSuggestion 相關 state

  const generateUniqueId = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const {
    suggestionTemplates,
    setSuggestionTemplates,
    initializeSuggestionTemplates,
    removeTemplate,
    updateTemplateStatus
  } = useTemplateManager(analysisResult, generateUniqueId);

  const { isSimilarSuggestion, findMostSimilarTemplate } = useSimilarityCheck(
    suggestions,
    messages,
    visibleExcerptIds,
    suggestionTemplates
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
    handleTextareaChange
  } = useInputManager();

  const {
    cannedOptions,
    initializeCannedMessages,
    updateCannedOptions
  } = useCannedMessages();

  // 簡化的 shouldShowExcerpt 邏輯（後端已處理主要邏輯）
  const shouldShowExcerpt = useCallback((message: ChatMessage) => {
    return !!message.excerpt;
  }, []);

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
    setMessageCount(prev => prev + 1);
    setCurrentInput('');
    setIsLoading(true);

    // 確保用戶訊息顯示後滾動
    setTimeout(() => {
      smartScrollToBottom(false, suggestions);
    }, 50);

    try {
      const response = await fetch('/api/smart-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          analysisResult,
          suggestions: [
            ...suggestions
          ],
          templates: suggestionTemplates
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '請求失敗');
      }

      const result = await response.json();
      const { messages: aiMessages, cannedOptions, templates: newTemplates } = result.data as { messages: ChatMessage[], cannedOptions: string[], templates: SuggestionTemplate[] };

      // 直接使用後端處理過的訊息
      setMessages(prev => [...prev, ...aiMessages]);
      setMessageCount(prev => prev + aiMessages.length);
      // 如果本次有 suggestion，cannedOptions 第一個改為「好呀」
      if (aiMessages.some((m) => m.suggestion)) {
        updateCannedOptions(["好呀", ...cannedOptions.slice(1)], false);
      } else {
        updateCannedOptions(cannedOptions, false);
      }
      setSuggestionTemplates(newTemplates);
      
      // 處理 suggestion（只有當訊息包含 suggestion 時）
      for (const aiMessage of aiMessages) {
        if (aiMessage.suggestion) {
          // 檢查是否與現有建議相似度過高
          if (isSimilarSuggestion(aiMessage.suggestion)) {
            console.log(`🚫 [Suggestion Blocked] Similar suggestion detected, not adding: "${aiMessage.suggestion.title}"`);
          } else {
            // 檢查建議是否與某個模板相關
            const suggestionText = `${aiMessage.suggestion.title} ${aiMessage.suggestion.description}`;
            let relatedTemplate: SuggestionTemplate | null = null;
            
            // 這裡可能需要根據 excerpt 匹配模板的邏輯
            if (!relatedTemplate) {
              relatedTemplate = findMostSimilarTemplate(suggestionText, suggestionTemplates) as SuggestionTemplate | null;
            }
            
            if (relatedTemplate && (relatedTemplate.status === 'in_progress' || relatedTemplate.status === 'completed')) {
              // 建議與模板相關，更新模板為已完成
              console.log(`✅ [Template] Completing template "${relatedTemplate.title}" with suggestion: "${aiMessage.suggestion.title}"`);
              
              const suggestionRecord: SuggestionRecord = {
                id: generateUniqueId('suggestion'),
                title: aiMessage.suggestion.title,
                description: aiMessage.suggestion.description,
                category: aiMessage.suggestion.category,
                timestamp: new Date()
              };
              
              updateTemplateStatus(relatedTemplate.id, 'completed', suggestionRecord);
            } else {
              // 建議與模板無關，加入額外建議列表
              console.log(`✅ [Suggestion Added] New additional suggestion: "${aiMessage.suggestion.title}"`);
              const suggestionRecord: SuggestionRecord = {
                id: generateUniqueId('suggestion'),
                title: aiMessage.suggestion.title,
                description: aiMessage.suggestion.description,
                category: aiMessage.suggestion.category,
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
        }
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
    } finally {
      setIsLoading(false);
    }
  }, [currentInput, isLoading, messageCount, messages, analysisResult, suggestions, smartScrollToBottom, updateCannedOptions, isSimilarSuggestion, suggestionTemplates, findMostSimilarTemplate, updateTemplateStatus, setSuggestionTemplates]);

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
    // 將所有模板也當作 suggestion 傳遞到下一步，completed 用 completedSuggestion
    const allSuggestions = [
      ...suggestions,
      ...suggestionTemplates.map(t => {
        if (t.status === 'completed' && t.completedSuggestion) {
          return {
            id: t.id,
            title: t.completedSuggestion.title,
            description: t.completedSuggestion.description,
            category: t.completedSuggestion.category,
            timestamp: t.timestamp || new Date()
          };
        } else {
          return {
            id: t.id,
            title: t.title,
            description: t.description,
            category: t.category,
            timestamp: t.timestamp || new Date()
          };
        }
      })
    ];
    onComplete(messages, allSuggestions);
  }, [messages, suggestions, suggestionTemplates, onComplete]);

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