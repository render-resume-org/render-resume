"use client";

import { useAuth } from "@/components/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Copy, Lightbulb, Send, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from 'react';

// 用戶頭像組件
interface UserAvatarProps {
  user: {
    avatar_url?: string;
    display_name?: string;
    email?: string;
  } | null;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const initial = user?.display_name?.[0] || user?.email?.[0] || 'U';
  
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={user?.avatar_url} alt={user?.display_name || user?.email || "User"} />
      <AvatarFallback className="bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400 text-sm font-medium">
        {initial.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

// 聊天消息類型
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
}

// 建議狀態類型
export interface SuggestionRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: Date;
}

// 罐頭訊息選項
const CANNED_MESSAGES = [
  "你先問我！",
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

// 隨機選擇罐頭訊息（除了第一個固定選項）
function getRandomCannedMessages(): string[] {
  const fixedFirst = CANNED_MESSAGES[0]; // "你先問我！"
  const others = CANNED_MESSAGES.slice(1);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return [fixedFirst, ...shuffled.slice(0, 3)];
}

interface SmartChatProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[]) => void;
  onSkip: () => void;
}

export default function SmartChat({ analysisResult, onComplete, onSkip }: SmartChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionRecord[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [cannedOptions, setCannedOptions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageCounterRef = useRef(0);

  const generateUniqueId = useCallback((prefix: string) => {
    messageCounterRef.current += 1;
    return `${prefix}-${Date.now()}-${messageCounterRef.current}`;
  }, []);

  const initializeChat = useCallback(() => {
    // 取得 follow-up 問題數量
    const followUpCount = analysisResult?.missing_content?.follow_ups?.length || 0;
    
    const welcomeMessage: ChatMessage = {
      id: generateUniqueId('ai-welcome'),
      type: 'ai',
      content: `嗨！我是你的 AI 履歷優化顧問 🤖

我已經仔細分析了你的履歷，並準備了 ${followUpCount > 0 ? `${followUpCount} 個深度追問問題` : '幾個專業問題'}來幫你挖掘更多亮點！

你可以主動提問，或讓我基於你的履歷背景主動詢問。我會協助你深入了解專案細節、挖掘遺漏的成就，並提供具體可執行的優化建議。

選擇一個開始的方式，或直接在下方輸入你的問題：`,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    setMessageCount(1);
    
    // 生成隨機罐頭選項
    setCannedOptions(getRandomCannedMessages());
  }, [generateUniqueId, analysisResult]);

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

    // 重置 textarea 高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
          analysisResult
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || '請求失敗');
      }

      const { message, suggestion } = result.data;

      // 添加 AI 回應
      const aiMessage: ChatMessage = {
        id: generateUniqueId('ai'),
        type: 'ai',
        content: message,
        timestamp: new Date(),
        suggestion
      };

      setMessages(prev => [...prev, aiMessage]);
      setMessageCount(prev => prev + 1);

      // 如果有建議，記錄到建議列表
      if (suggestion) {
        const suggestionRecord: SuggestionRecord = {
          id: generateUniqueId('suggestion'),
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          timestamp: new Date()
        };
        setSuggestions(prev => [...prev, suggestionRecord]);
      }

      // 自動 focus 到輸入框
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);

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
    if (textareaRef.current) {
      textareaRef.current.focus();
      // 將光標移到最後
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(quoteMessage.length, quoteMessage.length);
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

  return (
    <div className="space-y-6">
      {/* 新的兩欄布局 */}
      <div className="max-w-7xl mx-auto flex items-start justify-center gap-6">
        {/* 左側建議面板 */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-[25rem] max-w-[85vw]"
            >
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-cyan-600" />
                    AI 建議記錄 ({suggestions.length})
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    對話中產生的履歷優化建議
                  </p>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {suggestions.map((suggestion) => (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            layout
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm pr-2 leading-relaxed">
                                {suggestion.title}
                              </h4>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => quoteSuggestion(suggestion)}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors"
                                  title="引用此建議進行深入討論"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSuggestion(suggestion.id)}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  title="刪除此建議"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 break-words leading-relaxed">
                              {suggestion.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="inline-block text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                                {suggestion.category}
                              </span>
                              <span className="text-xs text-gray-400">
                                {suggestion.timestamp.toLocaleTimeString('zh-TW', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                  
                  {/* 完成對話按鈕 */}
                  {(suggestions.length > 0 || messageCount >= 20) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-4 border-t mt-4"
                    >
                      <Button 
                        onClick={handleComplete}
                        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
                        size="sm"
                      >
                        完成對話 ({suggestions.length} 個建議)
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 右側聊天區域 */}
        <div className="max-w-[85vw] w-[45rem] h-full">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🤖</span>
                  AI 智慧問答
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {messageCount}/30 則對話
                  </div>
                  <Button variant="ghost" size="sm" onClick={onSkip} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    跳過問答
                  </Button>
                </div>
              </CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                自由詢問履歷相關問題，AI 會記錄並提供具體建議
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
                          <div className={cn("flex items-start space-x-2 max-w-[85%]", message.type === 'user' ? 'flex-row-reverse space-x-reverse' : '')}>
                            {message.type === 'user' ? (
                              <UserAvatar user={user} />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg">🤖</span>
                              </div>
                            )}
                            <div
                              className={cn(`rounded-lg px-4 py-2 w-fit max-w-full`, message.type === 'user'
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

              {/* 罐頭訊息選項 */}
              {cannedOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="flex flex-wrap gap-2">
                    {cannedOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.2 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCannedMessage(option)}
                          className="text-xs hover:bg-cyan-50 hover:border-cyan-300 dark:hover:bg-cyan-900/20 transition-colors"
                        >
                          {option}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 對話限制提醒 */}
              <AnimatePresence>
                {messageCount >= 25 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-amber-800 dark:text-amber-200">
                      {messageCount >= 30 ? '已達到對話上限（30則）' : `即將達到對話上限（${messageCount}/30）`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 輸入區域 */}
              <div className="flex space-x-2 items-end">
                <Textarea
                  ref={textareaRef}
                  value={currentInput}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder={messageCount >= 30 ? "已達到對話上限" : "問我任何履歷相關的問題... (Shift+Enter 換行，Enter 發送)"}
                  disabled={isLoading || messageCount >= 30}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none transition-colors focus:border-cyan-500 focus:ring-cyan-500"
                  rows={1}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!currentInput.trim() || isLoading || messageCount >= 30}
                  size="icon"
                  className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-700 transition-colors disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 