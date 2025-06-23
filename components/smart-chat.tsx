"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit3, Send, User, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 聊天消息類型
export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  encouragement?: string;
}

// 用戶回答和對應問題的狀態
export interface ChatState {
  question: string;
  userResponse: string;
  questionIndex: number;
}

interface SmartChatProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], chatStates: ChatState[]) => void;
  onSkip: () => void;
}

// AI 鼓勵話語模板 - 年輕活潑但專業的語調
const AI_RESPONSE_TEMPLATES = [
  "太棒了！這個經驗聽起來很有價值呢～ 💪",
  "哇，這個回答很棒！我已經更了解你的背景了 ✨",
  "很好很好！這些細節對履歷優化超有幫助的 🎯",
  "收到收到！你的經驗真的很豐富耶 🚀",
  "讚！這樣的具體描述會讓履歷更亮眼 ⭐",
  "了解了！這個經歷聽起來很精彩 🎉",
  "很棒的分享！這些資訊對我們很有用 👍",
  "Perfect！這正是我需要知道的資訊 💯"
];

// 獲取隨機 AI 回應
const getRandomAIResponse = (): string => {
  return AI_RESPONSE_TEMPLATES[Math.floor(Math.random() * AI_RESPONSE_TEMPLATES.length)];
};

export default function SmartChat({ analysisResult, onComplete, onSkip }: SmartChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStates, setChatStates] = useState<ChatState[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCounterRef = useRef(0);

  // 從分析結果中獲取 follow_ups 問題
  const followUpQuestions = useMemo(() => analysisResult.missing_content?.follow_ups || [], [analysisResult]);

  const generateUniqueId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  }, []);

  const initializeChat = useCallback(() => {
    if (followUpQuestions.length === 0) {
      return;
    }

    // 添加AI的開場白和第一個問題
    const welcomeMessage: ChatMessage = {
      id: generateUniqueId('ai-welcome'),
      type: 'ai',
      content: `嗨！我是你的 AI 履歷小助手 🤖\n\n剛剛分析了你的履歷，發現有幾個地方可以更完整一些！讓我問你幾個問題來幫你優化內容吧～`,
      timestamp: new Date()
    };

    const firstQuestionMessage: ChatMessage = {
      id: generateUniqueId('ai-question'),
      type: 'ai',
      content: followUpQuestions[0],
      timestamp: new Date()
    };

    setMessages([welcomeMessage, firstQuestionMessage]);
  }, [followUpQuestions, generateUniqueId]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    // 自動滾動到底部
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // 開始編輯訊息
  const handleStartEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingContent(content);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.focus();
        editTextareaRef.current.setSelectionRange(content.length, content.length);
      }
    }, 100);
  };

  // 取消編輯
  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingContent('');
  };

  // 確認編輯
  const handleConfirmEdit = () => {
    if (!editingContent.trim() || !editingMessageId) return;

    // 更新訊息內容
    setMessages(prev => prev.map(msg => 
      msg.id === editingMessageId 
        ? { ...msg, content: editingContent.trim(), timestamp: new Date() }
        : msg
    ));

    // 同時更新對應的 chatStates
    setChatStates(prev => prev.map(state => {
      const correspondingMessage = messages.find(msg => 
        msg.id === editingMessageId && msg.type === 'user'
      );
      if (correspondingMessage) {
        // 找到對應的問題索引來更新正確的 chatState
        const messageIndex = messages.findIndex(msg => msg.id === editingMessageId);
        const questionsBefore = messages.slice(0, messageIndex).filter(msg => 
          msg.type === 'ai' && msg.content !== messages[0]?.content // 排除歡迎訊息
        ).length - 1; // 減去歡迎後的第一個問題
        
        if (state.questionIndex === questionsBefore) {
          return { ...state, userResponse: editingContent.trim() };
        }
      }
      return state;
    }));

    setEditingMessageId(null);
    setEditingContent('');
  };

  // 編輯時的按鍵處理
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConfirmEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateUniqueId('user'),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // 記錄當前的問答狀態
    const newChatState: ChatState = {
      question: followUpQuestions[currentQuestionIndex],
      userResponse: currentInput.trim(),
      questionIndex: currentQuestionIndex
    };
    setChatStates(prev => [...prev, newChatState]);

    setCurrentInput('');
    setIsLoading(true);

    // 重置 textarea 高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // 模擬 0.3 秒延遲
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 添加AI的鼓勵回應
      const encouragementMessage: ChatMessage = {
        id: generateUniqueId('ai-encouragement'),
        type: 'ai',
        content: getRandomAIResponse(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, encouragementMessage]);

      // 檢查是否還有問題要問
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < followUpQuestions.length) {
        // 再延遲 0.3 秒後問下一個問題
        setTimeout(() => {
          const nextQuestionMessage: ChatMessage = {
            id: generateUniqueId('ai-question'),
            type: 'ai',
            content: followUpQuestions[nextQuestionIndex],
            timestamp: new Date()
          };

          setMessages(prev => [...prev, nextQuestionMessage]);
          setCurrentQuestionIndex(nextQuestionIndex);
          
          // 自動 focus 到輸入框，提升用戶體驗
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
            }
          }, 100);
        }, 300);
      } else {
        // 結束對話
        setTimeout(() => {
          const endMessage: ChatMessage = {
            id: generateUniqueId('ai-end'),
            type: 'ai',
            content: '太棒了！謝謝你的詳細回答 🎉\n\n這些資訊對優化你的履歷超有幫助的！現在讓我們來看看根據你的回答生成的優化建議吧～',
            timestamp: new Date()
          };

          setMessages(prev => {
            const finalMessages = [...prev, endMessage];
            setTimeout(() => onComplete(finalMessages, [...chatStates, newChatState]), 3000);
            return finalMessages;
          });
        }, 300);
      }
    } catch (error) {
      console.error('Failed to generate AI response:', error);
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
    setCurrentInput(e.target.value);
    
    // 自動調整高度
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleSkip = () => {
    onSkip();
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

  if (followUpQuestions.length === 0 && !isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            智慧問答
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            您的履歷分析結果都很不錯！無需額外的問答優化。
          </p>
          <Button onClick={onSkip} className="bg-cyan-600 hover:bg-cyan-700 text-white">
            繼續查看建議
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🤖</span>
            AI 智慧問答
          </div>
          <div className="text-sm text-gray-500">
            {currentQuestionIndex + 1}/{followUpQuestions.length}
          </div>
        </CardTitle>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>幫助您完善履歷內容</span>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            跳過問答
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 聊天區域 */}
        <div className="h-[400px] border rounded-lg overflow-hidden">
          <ScrollArea className="w-full h-full p-4" ref={scrollAreaRef}>
            <div className="w-full space-y-4">
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
                    <div
                      className={cn(`flex items-start space-x-2 max-w-[80%] min-w-0`, message.type === 'user' ? 'flex-row-reverse space-x-reverse' : '')}
                    >
                      <div className={cn(`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`, message.type === 'user'
                          ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                      )}>
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <span className="text-lg">🤖</span>}
                      </div>
                      <div
                        className={cn(`rounded-lg px-4 py-2 min-w-0 flex-1`, message.type === 'user'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        )}
                      >
                        {editingMessageId === message.id ? (
                          // 編輯模式
                          <div className="space-y-2">
                            <Textarea
                              ref={editTextareaRef}
                              value={editingContent}
                              onChange={(e) => setEditingContent(e.target.value)}
                              onKeyPress={handleEditKeyPress}
                              className="min-h-[60px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                              placeholder="編輯您的回答..."
                            />
                            <div className="flex space-x-2 justify-end">
                              <Button
                                size="sm"
                                onClick={handleCancelEdit}
                                className="h-7 px-2 text-xs bg-cyan-600 hover:bg-cyan-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={handleConfirmEdit}
                                disabled={!editingContent.trim()}
                                className="h-7 px-2 text-xs bg-cyan-600 hover:bg-cyan-700"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // 正常顯示模式
                          <div className="group">
                            <div className="flex items-start justify-between">
                              <p className="text-sm whitespace-pre-wrap chat-message-content flex-1">{message.content}</p>
                              {message.type === 'user' && !isLoading && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleStartEdit(message.id, message.content)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-cyan-700"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString('zh-TW', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        )}
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
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
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
          </ScrollArea>
        </div>

        {/* 輸入區域 */}
        <div className="flex space-x-2 items-end">
          <Textarea
            ref={textareaRef}
            value={currentInput}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="輸入您的回答... (Shift+Enter 換行，Enter 發送)"
            disabled={isLoading}
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isLoading}
            size="icon"
            className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 