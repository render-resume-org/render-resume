import { useFileUpload } from "@/components/hooks/use-file-upload";
import { logSmartChatAttachment } from "@/lib/actions/activity";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import type { UploadedFile } from '@/lib/upload-utils';
import { computeResumeDiffSummary } from '@/lib/utils/json-diff';
import { useCallback, useEffect, useState } from 'react';
import { SuggestionTemplate } from "./ai-suggestions-sidebar";
import {
  useCannedMessages,
  useInputManager,
  useScrollManager,
  useTemplateManager
} from './hooks';
import { ChatMessage, SuggestionRecord } from './types';
import { CHAT_MESSAGE_LIMIT } from "./utils";

interface UseChatLogicProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
  onSkip: (suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
}

export function useChatLogic({ analysisResult, onComplete, onSkip }: UseChatLogicProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showSuggestionsDrawer, setShowSuggestionsDrawer] = useState(false);
  // Snapshot of resume before current message (initialized at chat start)
  const [resumeSnapshotBefore, setResumeSnapshotBefore] = useState<unknown | null>(null);
  // 移除 shouldBlockNextSuggestion 相關 state

  const generateUniqueId = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const {
    suggestionTemplates,
    setSuggestionTemplates,
    initializeSuggestionTemplates,
    removeTemplate
  } = useTemplateManager(analysisResult, generateUniqueId);

  // Removed useSimilarityCheck – suggestions are rendered as-is; backend manages issue states

  const {
    scrollAreaRef,
    scrollAreaRefMobile,
    suggestionsScrollAreaRef,
    messagesEndRef,
    messagesEndRefMobile,
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

  // ===== 整合檔案上傳邏輯 =====
  const {
    uploadedFiles,
    onDrop,
    removeFile,
    isProcessing: isFileProcessing,
    prepareForAnalysis,
    canProceed
  } = useFileUpload();

  // 已送出的檔案 id
  const [sentFileIds, setSentFileIds] = useState<string[]>([]);
  // 尚未送出的檔案（pendingFiles）
  const pendingFiles = uploadedFiles.filter(f => f.status === 'completed' && !sentFileIds.includes(f.id));

  // 簡化的 shouldShowExcerpt 邏輯（後端已處理主要邏輯）
  const shouldShowExcerpt = useCallback((message: ChatMessage) => {
    return !!message.excerpt;
  }, []);

  // Helper: flatten pendingFiles into file messages (PDF to images)
  const flattenFilesToMessages = useCallback((files: UploadedFile[]) => {
    const result: ChatMessage[] = [];
    for (const f of files) {
      if (f.type === 'pdf' && f.convertedImages && f.convertedImages.length > 0) {
        f.convertedImages.forEach((img, idx) => {
          result.push({
            id: generateUniqueId('file'),
            type: 'file',
            content: `${f.file.name} 頁${idx + 1}`,
            timestamp: new Date(),
            file: {
              id: f.id,
              name: `${f.file.name} 頁${idx + 1}`,
              type: 'image/png',
              size: 0,
              preview: img,
              isFromPdf: true,
              originalPdfName: f.file.name
            }
          });
        });
      } else if (f.type === 'image' && f.preview) {
        result.push({
          id: generateUniqueId('file'),
          type: 'file',
          content: f.file.name || '檔案',
          timestamp: new Date(),
          file: {
            id: f.id,
            name: f.file.name,
            type: f.file.type,
            size: f.file.size,
            preview: f.preview
          }
        });
      }
      // 可擴展：其他檔案型態可在此處理
    }
    return result;
  }, [generateUniqueId]);

  // 初始化聊天
  const initializeChat = useCallback(() => {
    try {
      // 嘗試從 sessionStorage 恢復狀態
      const savedChatHistory = sessionStorage.getItem('chatHistory');
      const savedSuggestionTemplates = sessionStorage.getItem('chatSuggestionTemplates');
      const savedResumeSnapshot = sessionStorage.getItem('resume_snapshot');

      if (savedChatHistory && savedSuggestionTemplates) {
        // 恢復之前的狀態
        console.log('🔄 恢復之前的智慧問答狀態');
        const chatHistory: ChatMessage[] = JSON.parse(savedChatHistory);
        const suggestionTemplates: SuggestionTemplate[] = JSON.parse(savedSuggestionTemplates);

        setMessages(chatHistory);
        setMessageCount(chatHistory.length);
        setSuggestionTemplates(suggestionTemplates);

        // 恢復快照（若無則以目前 resume 初始化）
        if (savedResumeSnapshot) {
          setResumeSnapshotBefore(JSON.parse(savedResumeSnapshot));
        } else {
          try {
            const storedResume = sessionStorage.getItem('resume');
            if (storedResume) {
              setResumeSnapshotBefore(JSON.parse(storedResume));
              sessionStorage.setItem('resume_snapshot', storedResume);
            }
          } catch {}
        }

        // 生成隨機罐頭選項
        initializeCannedMessages();
        return;
      }
    } catch (error) {
      console.error('恢復聊天狀態失敗:', error);
      // 如果恢復失敗，清除可能損壞的數據
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('chatSuggestions');
      sessionStorage.removeItem('chatSuggestionTemplates');
      sessionStorage.removeItem('resume_snapshot');
    }

    // 新開始或恢復失敗時的初始化邏輯
    console.log('🎯 開始新的智慧問答對話');

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

    // 初始化快照
    try {
      const storedResume = sessionStorage.getItem('resume');
      if (storedResume) {
        setResumeSnapshotBefore(JSON.parse(storedResume));
        sessionStorage.setItem('resume_snapshot', storedResume);
      }
    } catch {}

    // 生成隨機罐頭選項
    initializeCannedMessages();
  }, [generateUniqueId, analysisResult, initializeSuggestionTemplates, initializeCannedMessages, setSuggestionTemplates]);

  // 初始化快照（立即執行，不等待 initializeChat）
  useEffect(() => {
    try {
      const storedResume = sessionStorage.getItem('resume');
      if (storedResume && !resumeSnapshotBefore) {
        const parsedResume = JSON.parse(storedResume);
        setResumeSnapshotBefore(parsedResume);
        sessionStorage.setItem('resume_snapshot', storedResume);
        console.log('📸 初始化履歷快照');
      }
    } catch (error) {
      console.error('初始化履歷快照失敗:', error);
    }
  }, [resumeSnapshotBefore]);

  // 發送訊息時，將 pendingFiles（檔案訊息）與 user 文字訊息一次性組成，並一起送進 API call
  const handleSendMessage = useCallback(async () => {
    const hasText = currentInput.trim().length > 0;
    const hasFiles = pendingFiles.length > 0;
    if (!hasText && !hasFiles) return;

    // Log activity for file uploads
    if (hasFiles) {
      for (const file of pendingFiles) {
        logSmartChatAttachment(file.file.name, file.file.size);
      }
    }

    // 1. 準備 file messages (PDF 會展開為多個 image file message)
    const fileMessages: ChatMessage[] = flattenFilesToMessages(pendingFiles);

    // 2. 準備 user message
    let userMessage: ChatMessage | undefined = undefined;
    if (hasText) {
      userMessage = {
        id: generateUniqueId('user'),
        type: 'user',
        content: currentInput.trim(),
        timestamp: new Date()
      };
    }

    // 3. 一次 setMessages 並組成要送進 API 的 messages
    const messagesToSend = [...fileMessages, ...(userMessage ? [userMessage] : [])];
    setMessages(prev => [...prev, ...messagesToSend]);
    setMessageCount(prev => prev + messagesToSend.length);
    setCurrentInput('');
    setSentFileIds(prev => [...prev, ...pendingFiles.map(f => f.id)]);
    setIsLoading(true);

    // 4. API call: 一定要包含 fileMessages + userMessage
    setTimeout(() => {
      smartScrollToBottom(false, []);
    }, 50);

    try {
      // Load resume snapshots for diff (before from state snapshot, after from current storage)
      const resumeBefore = resumeSnapshotBefore;
      let resumeAfter: unknown = null;
      try {
        const stored = sessionStorage.getItem('resume');
        if (stored) resumeAfter = JSON.parse(stored);
      } catch {}
      let diffSummary: string | null = null;
      try {
        diffSummary = computeResumeDiffSummary(resumeBefore, resumeAfter);
      } catch {}

      const response = await fetch('/api/smart-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, ...messagesToSend],
          analysisResult,
          suggestions: [],
          templates: suggestionTemplates,
          resumeDiff: diffSummary,
          currentResume: resumeAfter ?? null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '請求失敗');
      }

      const result = await response.json();
      const { messages: aiMessages, cannedOptions, templates: newTemplates, issues: newIssues } = result.data as { 
        messages: ChatMessage[], 
        cannedOptions: string[], 
        templates: SuggestionTemplate[], 
        issues?: SuggestionTemplate[] 
      };

      setMessages(prev => [...prev, ...aiMessages]);
      setMessageCount(prev => prev + aiMessages.length);
      if (aiMessages.some((m) => m.suggestion)) {
        updateCannedOptions(["好呀", ...cannedOptions.slice(1)], false);
      } else {
        updateCannedOptions(cannedOptions, false);
      }
      setSuggestionTemplates(newTemplates);
      if (newIssues) {
        // Handle issues if they exist
        console.log('Received new issues:', newIssues);
      }

      // 更新快照為本輪的 after
      try {
        setResumeSnapshotBefore(resumeAfter ?? null);
        sessionStorage.setItem('resume_snapshot', JSON.stringify(resumeAfter));
      } catch {}

      requestAnimationFrame(() => {
        smartScrollToBottom(false, []);
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
  }, [currentInput, pendingFiles, messages, analysisResult, suggestionTemplates, updateCannedOptions, setSuggestionTemplates, smartScrollToBottom, generateUniqueId, flattenFilesToMessages, setCurrentInput, resumeSnapshotBefore]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // ===== Focus input helper =====
  const focusInput = useCallback((cursorToEnd: boolean = true, customValue?: string) => {
    const desktopTextarea = textareaRef.current;
    const mobileTextarea = textareaRefMobile.current;
    let targetTextarea: HTMLTextAreaElement | null = null;
    // 檢查大螢幕版本是否可見
    if (desktopTextarea && window.getComputedStyle(desktopTextarea.closest('.hidden') || desktopTextarea).display !== 'none') {
      targetTextarea = desktopTextarea;
    } else if (mobileTextarea && window.getComputedStyle(mobileTextarea.closest('.lg\\:hidden') || mobileTextarea).display !== 'none') {
      targetTextarea = mobileTextarea;
    }
    if (targetTextarea) {
      targetTextarea.focus();
      if (cursorToEnd) {
        setTimeout(() => {
          if (targetTextarea) {
            const value = customValue ?? targetTextarea.value;
            targetTextarea.setSelectionRange(value.length, value.length);
          }
        }, 0);
      }
    }
  }, [textareaRef, textareaRefMobile]);

  const handleCannedMessage = useCallback((message: string) => {
    setCurrentInput(message);
    // 多次延遲 scroll，確保訊息渲染後手機/桌面都能正確滾動
    setTimeout(() => smartScrollToBottom(false, []), 100);
    setTimeout(() => smartScrollToBottom(false, []), 300);
    setTimeout(() => smartScrollToBottom(false, []), 600);
    // 新增：自動 focus input
    setTimeout(() => focusInput(true, message), 0);
  }, [smartScrollToBottom, setCurrentInput, focusInput]);

  const handleComplete = useCallback(() => {
    // 將所有模板也當作 suggestion 傳遞到下一步，completed 用 completedSuggestion
    onComplete(messages, [], suggestionTemplates);
  }, [messages, suggestionTemplates, onComplete]);



  const quoteTemplate = useCallback((template: SuggestionTemplate) => {
    let quoteMessage = '';
    if (template.status === 'completed' && template.completedSuggestion) {
      quoteMessage = `關於「${template.completedSuggestion.title}」這個建議，我想進一步了解：\n\n原建議：${template.completedSuggestion.description}\n\n我想問：`;
    } else {
      quoteMessage = `關於「${template.title}」這個問題：\n\n${template.description}\n\n我想進一步討論：`;
    }
    setCurrentInput(quoteMessage);
    adjustTextareaHeight(quoteMessage);
    // Focus input
    setTimeout(() => focusInput(true, quoteMessage), 0);
  }, [setCurrentInput, adjustTextareaHeight, focusInput]);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // 新增：插入 file 訊息
  const addFileMessage = useCallback((file: UploadedFile) => {
    setMessages(prev => [
      ...prev,
      {
        id: generateUniqueId('file'),
        type: 'file',
        content: file.file.name || '檔案',
        timestamp: new Date(),
        file: {
          id: file.id,
          name: file.file.name,
          type: file.file.type,
          size: file.file.size,
          preview: file.preview,
          pages: file.convertedImages,
          isFromPdf: !!file.convertedImages
        }
      }
    ]);
    setMessageCount(prev => prev + 1);
  }, [generateUniqueId]);

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
          if (
            messageCount < CHAT_MESSAGE_LIMIT &&
            document.activeElement !== (textareaRef.current || textareaRefMobile.current)
          ) {
            focusInput();
          }
        }, 100);
      });
    }
  }, [isLoading, messageCount, focusInput, textareaRef, textareaRefMobile]);

  // 優化滾動函數，避免閉包問題
  const scrollToBottomWithSuggestions = useCallback(() => {
    smartScrollToBottom(false, []);
  }, [smartScrollToBottom]);

  // 處理螢幕尺寸變化
  useEffect(() => {
    const handleResize = () => {
      // 延遲滾動以確保布局完成
      setTimeout(() => {
        scrollToBottomWithSuggestions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollToBottomWithSuggestions]);

  // 訊息更新時滾動
  useEffect(() => {
    // 使用 requestAnimationFrame 確保在 DOM 更新後滾動
    requestAnimationFrame(() => {
      scrollToBottomWithSuggestions();
      
      // 額外的延遲確保動畫完成
      setTimeout(() => {
        scrollToBottomWithSuggestions();
      }, 100);
      
      // 最後確保滾動
      setTimeout(() => {
        scrollToBottomWithSuggestions();
      }, 300);
    });
  }, [messages, scrollToBottomWithSuggestions]);

  // 當有新建議時，自動滾動建議面板到底部，並確保主聊天區域也滾動

  // 當載入狀態改變時，確保滾動到底部（顯示載入動畫）
  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        scrollToBottomWithSuggestions();
      }, 100);
    }
  }, [isLoading, scrollToBottomWithSuggestions]);

  return {
    // 狀態
    messages,
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
    removeTemplate,
    quoteTemplate,
    shouldShowExcerpt,
    onSkip,
    addFileMessage,
    uploadedFiles,
    onDrop,
    removeFile,
    pendingFiles,
    isFileProcessing,
    prepareForAnalysis,
    canProceed,
    initializeChat
  };
}