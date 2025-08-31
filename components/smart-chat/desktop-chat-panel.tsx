import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import AISuggestionsSidebar from "./ai-suggestions-sidebar";
import CannedMessages from "./canned-messages";
import ChatInput from "./chat-input";
// import ChatLimitAlert from "./chat-limit-alert";
import { FullscreenImagePreview, UploadedFileCard } from "@/components/upload/uploaded-files-list";
import type { UploadedFile } from "@/lib/upload-utils";
import type { Variants } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { SuggestionTemplate } from "./ai-suggestions-sidebar";
import ChatMessageCard from "./chat-message-card";
import LoadingMessage from "./loading-message";
import type { ChatMessage, SuggestionRecord } from "./types";
import { CHAT_MESSAGE_LIMIT, MAX_FILES_PER_MESSAGE } from "./utils";

interface DesktopChatPanelProps {
  suggestionTemplates: SuggestionTemplate[];
  onQuoteTemplate: (t: SuggestionTemplate) => void;
  onRemoveTemplate: (id: string) => void;
  onComplete: () => void;
  messageCount: number;
  suggestionsScrollAreaRef: React.RefObject<HTMLDivElement | null>;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  messages: ChatMessage[];
  messageVariants: Variants;
  isLoading: boolean;
  cannedOptions: string[];
  handleCannedMessage: (msg: string) => void;
  currentInput: string;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollAreaRef: React.RefObject<HTMLDivElement | null>;
  onSkip: (suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
  onFileUpload: (files: File[]) => void;
  pendingFiles: UploadedFile[];
  onRemovePendingFile: (id: string) => void;
  onRestart: () => void;
}

const DesktopChatPanel = memo((props: DesktopChatPanelProps) => {
  const lastToastRef = useRef<number>(0);
  useEffect(() => {
    if (props.messageCount >= (CHAT_MESSAGE_LIMIT - 5) && lastToastRef.current !== props.messageCount) {
      toast(props.messageCount >= CHAT_MESSAGE_LIMIT ? `已達到對話上限（${CHAT_MESSAGE_LIMIT}則）` : `即將達到對話上限（${props.messageCount}/${CHAT_MESSAGE_LIMIT}）`);
      lastToastRef.current = props.messageCount;
    }
  }, [props.messageCount]);
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(null);
  
  // 優化：使用 useMemo 緩存訊息列表
  const messageElements = useMemo(() => (
    <AnimatePresence mode="popLayout">
      {props.messages.map((message) => (
        <motion.div
          key={message.id}
          variants={props.messageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
        >
          <ChatMessageCard message={message} />
        </motion.div>
      ))}
    </AnimatePresence>
  ), [props.messages, props.messageVariants]);

  // 優化：使用 useMemo 緩存檔案預覽
  const filePreviewElements = useMemo(() => {
    if (!props.pendingFiles || props.pendingFiles.length === 0) return null;
    
    return (
      <div className="mb-2 flex gap-2 overflow-x-auto">
        {props.pendingFiles.map((file) => (
          <UploadedFileCard
            key={file.id}
            file={file}
            onRemove={props.onRemovePendingFile}
            onPreview={(images, index) => setPreview({ images, index })}
          />
        ))}
      </div>
    );
  }, [props.pendingFiles, props.onRemovePendingFile]);

  // 直接複製原本 lg:flex 內的內容，將 props 替換為 props.xxx
  // ...
  return (
    <div className="hidden lg:flex items-stretch gap-6 h-full">
      {/* 左側建議面板 */}
      <AISuggestionsSidebar
        suggestionTemplates={props.suggestionTemplates}
        onQuoteTemplate={props.onQuoteTemplate}
        onRemoveTemplate={props.onRemoveTemplate}
        onComplete={props.onComplete}
        messageCount={props.messageCount}
        suggestionsScrollAreaRef={props.suggestionsScrollAreaRef}
        isCollapsed={props.isSidebarCollapsed}
        onToggleCollapse={props.onToggleSidebar}
      />
      {/* 右側聊天區域 */}
      <div className="flex-1 min-w-0 h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              自由詢問履歷相關問題，AI 助理 Remo 會記錄並提供具體建議
            </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {props.messageCount}/{CHAT_MESSAGE_LIMIT} 則對話
                </div>
                <Button variant="ghost" size="sm" onClick={props.onRestart} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  重新對話
                </Button>
              </div>
            </div>
            
          </div>
          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6" ref={props.scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messageElements}
                {props.isLoading && <LoadingMessage />}
              </div>
              <div ref={props.messagesEndRef} className="h-0" />
            </ScrollArea>
          </div>
          {/* Input Area */}
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
            {/* File preview above input */}
            {filePreviewElements}
            {/* Modal for preview */}
            {preview && (
              <FullscreenImagePreview
                images={preview.images}
                index={preview.index}
                onClose={() => setPreview(null)}
                onPrev={() => setPreview(p => p && p.index > 0 ? { ...p, index: p.index - 1 } : p)}
                onNext={() => setPreview(p => p && p.index < p.images.length - 1 ? { ...p, index: p.index + 1 } : p)}
              />
            )}
            <AnimatePresence mode="popLayout">
              {props.cannedOptions.length > 0 && (
                <CannedMessages cannedOptions={props.cannedOptions} onCannedMessage={props.handleCannedMessage} />
              )}
            </AnimatePresence>
            <ChatInput
              value={props.currentInput}
              onChange={props.handleTextareaChange}
              onKeyPress={props.handleKeyPress}
              onSend={props.handleSendMessage}
              textareaRef={props.textareaRef}
              disabled={props.isLoading || props.messageCount >= CHAT_MESSAGE_LIMIT}
              fileUploadDisabled={props.pendingFiles.length >= MAX_FILES_PER_MESSAGE}
              messageCount={props.messageCount}
              onFileUpload={props.onFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

DesktopChatPanel.displayName = 'DesktopChatPanel';

export default DesktopChatPanel; 