import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import CannedMessages from "./canned-messages";
import ChatInput from "./chat-input";
// import ChatLimitAlert from "./chat-limit-alert";
import { FullscreenImagePreview, UploadedFileCard } from "@/features/resume/components/upload/uploaded-files-list";
import type { UploadedFile } from "@/utils/upload-utils";
import type { Variants } from "framer-motion";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { SuggestionTemplate } from "./ai-suggestions-sidebar";
import ChatMessageCard from "./chat-message-card";
import IssueBar from "./issue-bar";
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

  return (
    <div className="hidden lg:flex items-stretch h-full">
      {/* 聊天區域（全寬） */}
      <div className="flex-1 min-w-0 h-full">
        <div className="bg-white dark:bg-gray-800 h-full flex flex-col">
          {/* Issue bar below header */}
          <IssueBar
            suggestionTemplates={props.suggestionTemplates}
            onQuoteTemplate={props.onQuoteTemplate}
            onRemoveTemplate={props.onRemoveTemplate}
          />
          {/* Chat Area */}
          <div className="flex-1 overflow-hidden px-4">
            <ScrollArea className="h-full" ref={props.scrollAreaRef}>
              <div className="space-y-4 py-4">
                {messageElements}
                {props.isLoading && <LoadingMessage />}
              </div>
              <div ref={props.messagesEndRef} className="h-0" />
            </ScrollArea>
          </div>
          {/* Input Area */}
          <div className="px-6 py-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
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