import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import CannedMessages from "./canned-messages";
import ChatInput from "./chat-input";
// import ChatLimitAlert from "./chat-limit-alert";
import { FullscreenImagePreview, UploadedFileCard } from "@/components/upload/uploaded-files-list";
import type { UploadedFile } from "@/utils/upload-utils";
import type { Variants } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { SuggestionTemplate } from "./ai-suggestions-sidebar";
import ChatMessageCard from "./chat-message-card";
import DraggableFab from "./draggable-fab";
import LoadingMessage from "./loading-message";
import SuggestionCard from "./suggestion-card";
import type { ChatMessage, SuggestionRecord } from "./types";
import { CHAT_MESSAGE_LIMIT, MAX_FILES_PER_MESSAGE } from "./utils";

interface MobileChatPanelProps {
  suggestionTemplates: SuggestionTemplate[];
  quoteTemplate: (t: SuggestionTemplate) => void;
  removeTemplate: (id: string) => void;
  onComplete: () => void;
  messageCount: number;
  suggestionsScrollAreaRef: React.RefObject<HTMLDivElement | null>;
  messages: ChatMessage[];
  messageVariants: Variants;
  isLoading: boolean;
  cannedOptions: string[];
  handleCannedMessage: (msg: string) => void;
  currentInput: string;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSendMessage: () => void;
  textareaRefMobile: React.RefObject<HTMLTextAreaElement | null>;
  messagesEndRefMobile: React.RefObject<HTMLDivElement | null>;
  scrollAreaRefMobile: React.RefObject<HTMLDivElement | null>;
  onSkip: (suggestions: SuggestionRecord[], suggestionTemplates: SuggestionTemplate[]) => void;
  showSuggestionsDrawer: boolean;
  setShowSuggestionsDrawer: (open: boolean) => void;
  onFileUpload: (files: File[]) => void;
  pendingFiles: UploadedFile[];
  onRemovePendingFile: (id: string) => void;
  onRestart: () => void;
}

const MobileChatPanel = memo((props: MobileChatPanelProps) => {
  const lastToastRef = useRef<number>(0);
  useEffect(() => {
    if (props.messageCount >= (CHAT_MESSAGE_LIMIT - 5) && lastToastRef.current !== props.messageCount) {
      toast(props.messageCount >= CHAT_MESSAGE_LIMIT ? `已達到對話上限（${CHAT_MESSAGE_LIMIT}則）` : `即將達到對話上限（${props.messageCount}/${CHAT_MESSAGE_LIMIT}）`);
      lastToastRef.current = props.messageCount;
    }
  }, [props.messageCount]);
  // Auto-expand logic for new in_progress template
  const [forceExpandId, setForceExpandId] = useState<string | null>(null);
  const prevStatuses = useRef<{ [id: string]: string }>({});
  useEffect(() => {
    let foundNewInProgress = false;
    let newInProgressId: string | null = null;
    for (const t of props.suggestionTemplates) {
      const prev = prevStatuses.current[t.id];
      if (!prev && t.status === 'in_progress') {
        foundNewInProgress = true;
        newInProgressId = t.id;
      }
      if (prev && prev !== t.status && (t.status === 'in_progress' || t.status === 'completed')) {
        setForceExpandId(t.id);
      }
      prevStatuses.current[t.id] = t.status;
    }
    if (foundNewInProgress && newInProgressId) {
      setForceExpandId(newInProgressId);
    }
  }, [props.suggestionTemplates]);
  
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

  // 直接複製原本 lg:hidden 內的內容，將 props 替換為 props.xxx
  // ...
  const [preview, setPreview] = useState<{ images: string[]; index: number } | null>(null);
  return (
    <div className="lg:hidden flex flex-col space-y-4">
      {/* 聊天區域 */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 flex flex-col">
        {/* Header 固定高度 */}
        <div className="flex-shrink-0 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-end sm:space-x-4 gap-2 w-full">
              <div className="text-sm text-gray-500">
                {props.messageCount}/{CHAT_MESSAGE_LIMIT} 則對話
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={props.onRestart} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                  重新對話
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 my-1">
            自由詢問履歷相關問題，AI 會記錄並提供具體建議
          </div>
        </div>
        <Separator className="mt-2" />
        {/* Chat Area */}
        <div className="overflow-hidden" style={{ height: 'calc(100vh - 25rem)' }}>
          <ScrollArea className="h-full px-4" ref={props.scrollAreaRefMobile}>
            <div className="space-y-4 py-2">
              {messageElements}
              {props.isLoading && <LoadingMessage />}
            </div>
            <div ref={props.messagesEndRefMobile} className="h-0" />
          </ScrollArea>
        </div>
        {/* Input Area */}
        <Separator />
        <div className="p-4 space-y-4 flex-shrink-0">
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
            textareaRef={props.textareaRefMobile}
            disabled={props.isLoading || props.messageCount >= CHAT_MESSAGE_LIMIT}
            fileUploadDisabled={props.pendingFiles.length >= MAX_FILES_PER_MESSAGE}
            messageCount={props.messageCount}
            onFileUpload={props.onFileUpload}
          />
        </div>
      </div>
      {/* 浮動 Lightbulb trigger */}
      <DraggableFab
        onClick={() => props.setShowSuggestionsDrawer(true)}
        icon={
          <div className="rounded-xl hover:scale-110 transition-all p-2 flex items-center justify-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
            <Lightbulb className="h-6 w-6 text-cyan-600" />
          </div>
        }
        initialPosition={{ right: 16, bottom: 16 }}
        snapMargin={16}
      />
      {/* 彈出建議總結 Sheet */}
      <Sheet open={props.showSuggestionsDrawer} onOpenChange={props.setShowSuggestionsDrawer}>
        <SheetContent side="bottom" className="max-h-[80vh] p-0">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <SheetTitle asChild>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">建議總結</h2>
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="sm" className="text-gray-500">關閉</Button>
            </SheetClose>
          </div>
          <div className="px-4 pb-4" style={{ height: '75vh', overflowY: 'auto' }}>
            {/* Template 區塊 */}
            {props.suggestionTemplates.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-cyan-600 rounded-full mr-2"></span>
                  追蹤問題 ({props.suggestionTemplates.filter((t) => t.status === 'completed').length}/{props.suggestionTemplates.length})
                </h4>
                <div className="space-y-3">
                  {props.suggestionTemplates.map((template) => (
                    <SuggestionCard
                      key={template.id}
                      template={template}
                      onQuote={item => {
                        if ('status' in item) {
                          props.quoteTemplate(item);
                          if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                            props.setShowSuggestionsDrawer(false);
                          }
                        }
                      }}
                      onRemove={props.removeTemplate}
                      forceExpand={forceExpandId === template.id}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Regular Suggestions 區塊移除 */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});

MobileChatPanel.displayName = 'MobileChatPanel';

export default MobileChatPanel; 