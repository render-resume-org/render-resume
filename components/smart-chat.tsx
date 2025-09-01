"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
import { useState } from "react";
import { toast } from "sonner";
import type { SuggestionTemplate } from "./smart-chat/ai-suggestions-sidebar";
import DesktopChatPanel from "./smart-chat/desktop-chat-panel";
import MobileChatPanel from "./smart-chat/mobile-chat-panel";
import type { ChatMessage, SuggestionRecord } from "./smart-chat/types";
import { useChatLogic } from "./smart-chat/use-chat-logic";
import { messageVariants } from "./smart-chat/utils";

// Re-export types for backwards compatibility
export type { ChatMessage, SuggestionRecord } from "./smart-chat/types";

interface SmartChatProps {
  analysisResult: ResumeAnalysisResult;
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
  onSkip: (suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
}

export default function SmartChat({ analysisResult, onComplete, onSkip }: SmartChatProps) {
  const {
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
    handleKeyPress,
    handleTextareaChange,
    handleCannedMessage,
    handleComplete,
    handleToggleSidebar,
    removeTemplate,
    quoteTemplate,
    handleSendMessage,
    pendingFiles,
    onDrop,
    removeFile,
    initializeChat, // <-- add this from useChatLogic
  } = useChatLogic({ analysisResult, onComplete, onSkip });

  // 新增：重新對話 confirm dialog 狀態
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  // 新增：重新對話 handler
  const handleRestart = () => {
    setShowRestartDialog(true);
  };

  const handleConfirmRestart = () => {
    setShowRestartDialog(false);
    // 清除會話數據（不能清掉 analysisResult）
    try {
      sessionStorage.removeItem('chatHistory');
      sessionStorage.removeItem('chatSuggestions');
      sessionStorage.removeItem('optimizedResume');
      console.log('🧹 清除智慧問答會話數據');
    } catch (error) {
      console.warn('⚠️ 清除智慧問答會話數據失敗:', error);
    }
    // 重新初始化聊天
    initializeChat();
    toast("已重新開始對話");
  };

  return (
    <div className="flex flex-col">
      <AlertDialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要重新開始對話嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              這將會清除目前所有對話紀錄與追蹤問題，但會保留同一份履歷分析。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRestart} className="bg-cyan-600 hover:bg-cyan-600 text-white transition-colors">確認重置</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Full screen container with responsive max-width */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full lg:max-w-[75vw] h-[80vh]">
          <DesktopChatPanel
            suggestionTemplates={suggestionTemplates}
            onQuoteTemplate={quoteTemplate}
            onRemoveTemplate={removeTemplate}
            onComplete={handleComplete}
            messageCount={messageCount}
            suggestionsScrollAreaRef={suggestionsScrollAreaRef}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            messages={messages}
            messageVariants={messageVariants}
            isLoading={isLoading}
            cannedOptions={cannedOptions}
            handleCannedMessage={handleCannedMessage}
            currentInput={currentInput}
            handleTextareaChange={handleTextareaChange}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            textareaRef={textareaRef}
            messagesEndRef={messagesEndRef}
            scrollAreaRef={scrollAreaRef}
            onSkip={onSkip}
            onFileUpload={onDrop}
            pendingFiles={pendingFiles}
            onRemovePendingFile={removeFile}
            onRestart={handleRestart}
          />
          <MobileChatPanel
            suggestionTemplates={suggestionTemplates}
            quoteTemplate={quoteTemplate}
            removeTemplate={removeTemplate}
            onComplete={handleComplete}
            messageCount={messageCount}
            suggestionsScrollAreaRef={suggestionsScrollAreaRef}
            messages={messages}
            messageVariants={messageVariants}
            isLoading={isLoading}
            cannedOptions={cannedOptions}
            handleCannedMessage={handleCannedMessage}
            currentInput={currentInput}
            handleTextareaChange={handleTextareaChange}
            handleKeyPress={handleKeyPress}
            handleSendMessage={handleSendMessage}
            textareaRefMobile={textareaRefMobile}
            messagesEndRefMobile={messagesEndRefMobile}
            scrollAreaRefMobile={scrollAreaRefMobile}
            onSkip={onSkip}
            showSuggestionsDrawer={showSuggestionsDrawer}
            setShowSuggestionsDrawer={setShowSuggestionsDrawer}
            onFileUpload={onDrop}
            pendingFiles={pendingFiles}
            onRemovePendingFile={removeFile}
            onRestart={handleRestart}
          />
        </div>
      </div>
    </div>
  );
} 