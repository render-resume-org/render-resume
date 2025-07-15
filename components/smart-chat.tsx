"use client";

import { ResumeAnalysisResult } from "@/lib/types/resume-analysis";
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
  onComplete: (chatHistory: ChatMessage[], suggestions: SuggestionRecord[]) => void;
  onSkip: (suggestions: SuggestionRecord[]) => void;
}

export default function SmartChat({ analysisResult, onComplete, onSkip }: SmartChatProps) {
  const {
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
    shouldShowExcerpt
  } = useChatLogic({ analysisResult, onComplete, onSkip });

  return (
    <div className="flex flex-col">
      {/* Full screen container with responsive max-width */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full lg:max-w-[75vw] h-[80vh]">
          <DesktopChatPanel
              suggestions={suggestions}
              suggestionTemplates={suggestionTemplates}
              onQuote={quoteSuggestion}
            onQuoteTemplate={(item: SuggestionTemplate) => {
              quoteTemplate(item);
              }}
              onRemove={removeSuggestion}
              onRemoveTemplate={removeTemplate}
              onComplete={handleComplete}
              messageCount={messageCount}
              suggestionsScrollAreaRef={suggestionsScrollAreaRef}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            messages={messages}
            messageVariants={messageVariants}
            shouldShowExcerpt={shouldShowExcerpt}
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
          />
          <MobileChatPanel
                  suggestions={suggestions}
            suggestionTemplates={suggestionTemplates}
                  onQuote={quoteSuggestion}
            quoteTemplate={quoteTemplate}
                  onRemove={removeSuggestion}
            removeTemplate={removeTemplate}
                  onComplete={handleComplete}
                  messageCount={messageCount}
            suggestionsScrollAreaRef={suggestionsScrollAreaRef}
            messages={messages}
            messageVariants={messageVariants}
            shouldShowExcerpt={shouldShowExcerpt}
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
          />
        </div>
      </div>
    </div>
  );
} 