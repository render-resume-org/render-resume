import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import AISuggestionsSidebar from "./ai-suggestions-sidebar";
import CannedMessages from "./canned-messages";
import ChatInput from "./chat-input";
// import ChatLimitAlert from "./chat-limit-alert";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import ChatMessageCard from "./chat-message-card";
import LoadingMessage from "./loading-message";

const DesktopChatPanel = (props: any) => {
  const lastToastRef = useRef<number>(0);
  useEffect(() => {
    if (props.messageCount >= 25 && lastToastRef.current !== props.messageCount) {
      toast(props.messageCount >= 30 ? "已達到對話上限（30則）" : `即將達到對話上限（${props.messageCount}/30）`);
      lastToastRef.current = props.messageCount;
    }
  }, [props.messageCount]);
  // 直接複製原本 lg:flex 內的內容，將 props 替換為 props.xxx
  // ...
  return (
    <div className="hidden lg:flex items-start gap-6 h-full">
      {/* 左側建議面板 */}
      <AISuggestionsSidebar
        suggestions={props.suggestions}
        suggestionTemplates={props.suggestionTemplates}
        onQuote={props.onQuote}
        onQuoteTemplate={props.onQuoteTemplate}
        onRemove={props.onRemove}
        onRemoveTemplate={props.onRemoveTemplate}
        onComplete={props.onComplete}
        messageCount={props.messageCount}
        suggestionsScrollAreaRef={props.suggestionsScrollAreaRef}
        isCollapsed={props.isSidebarCollapsed}
        onToggleCollapse={props.onToggleSidebar}
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
                  {props.messageCount}/30 則對話
                </div>
                <Button variant="ghost" size="sm" onClick={() => props.onSkip(props.suggestions)} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
            <ScrollArea className="h-full p-6" ref={props.scrollAreaRef}>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {props.messages.map((message: any) => (
                    <motion.div
                      key={message.id}
                      variants={props.messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                    >
                      <ChatMessageCard message={message} shouldShowExcerpt={props.shouldShowExcerpt} />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {props.isLoading && <LoadingMessage />}
              </div>
              <div ref={props.messagesEndRef} className="h-0" />
            </ScrollArea>
          </div>
          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <AnimatePresence mode="popLayout">
              {props.cannedOptions.length > 0 && (
                <CannedMessages cannedOptions={props.cannedOptions} onCannedMessage={props.handleCannedMessage} />
              )}
            </AnimatePresence>
            {/* <AnimatePresence>
              {props.messageCount >= 25 && <ChatLimitAlert messageCount={props.messageCount} />}
            </AnimatePresence> */}
            <ChatInput
              value={props.currentInput}
              onChange={props.handleTextareaChange}
              onKeyPress={props.handleKeyPress}
              onSend={props.handleSendMessage}
              textareaRef={props.textareaRef}
              disabled={props.isLoading || props.messageCount >= 30}
              messageCount={props.messageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopChatPanel; 