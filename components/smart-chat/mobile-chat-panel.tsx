import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import CannedMessages from "./canned-messages";
import ChatInput from "./chat-input";
// import ChatLimitAlert from "./chat-limit-alert";
import type { Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { SuggestionTemplate } from "./ai-suggestions-sidebar";
import ChatMessageCard from "./chat-message-card";
import LoadingMessage from "./loading-message";
import SuggestionCard from "./suggestion-card";
import SuggestionList from "./suggestion-list";
import type { ChatMessage, SuggestionRecord } from "./types";

interface MobileChatPanelProps {
  suggestions: SuggestionRecord[];
  suggestionTemplates: SuggestionTemplate[];
  onQuote: (s: SuggestionRecord) => void;
  quoteTemplate: (t: SuggestionTemplate) => void;
  onRemove: (id: string) => void;
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
  onSkip: (suggestions: SuggestionRecord[]) => void;
  showSuggestionsDrawer: boolean;
  setShowSuggestionsDrawer: (open: boolean) => void;
}

const MobileChatPanel = (props: MobileChatPanelProps) => {
  const lastToastRef = useRef<number>(0);
  useEffect(() => {
    if (props.messageCount >= 25 && lastToastRef.current !== props.messageCount) {
      toast(props.messageCount >= 30 ? "已達到對話上限（30則）" : `即將達到對話上限（${props.messageCount}/30）`);
      lastToastRef.current = props.messageCount;
    }
  }, [props.messageCount]);
  // 直接複製原本 lg:hidden 內的內容，將 props 替換為 props.xxx
  // ...
  return (
    <div className="lg:hidden flex flex-col space-y-4">
      {/* 聊天區域 */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 flex flex-col">
        {/* Header 固定高度 */}
        <div className="flex-shrink-0 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center justify-between sm:justify-end sm:space-x-4 gap-2 w-full">
              <div className="text-sm text-gray-500">
                {props.messageCount}/30 則對話
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => props.onSkip(props.suggestions)} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm">
                  跳過問答
                </Button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 my-1">
            自由詢問履歷相關問題，AI 會記錄並提供具體建議
          </div>
          <Button
            variant="outline"
            size="sm"
            className="px-2 py-1 h-8 text-xs border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-100"
            onClick={() => props.setShowSuggestionsDrawer(true)}
          >
            查看建議 ({props.suggestions.length})
          </Button>
        </div>
        <Separator className="mt-2" />
        {/* Chat Area */}
        <div className="overflow-hidden" style={{ height: 'calc(100vh - 25rem)' }}>
          <ScrollArea className="h-full px-4" ref={props.scrollAreaRefMobile}>
            <div className="space-y-4 py-2">
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
              {props.isLoading && <LoadingMessage />}
            </div>
            <div ref={props.messagesEndRefMobile} className="h-0" />
          </ScrollArea>
        </div>
        {/* Input Area */}
        <Separator />
        <div className="p-4 space-y-4 flex-shrink-0">
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
            disabled={props.isLoading || props.messageCount >= 30}
            messageCount={props.messageCount}
          />
        </div>
      </div>
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
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Regular Suggestions 區塊 */}
            <SuggestionList
              suggestions={props.suggestions}
              onQuote={props.onQuote}
              onRemove={props.onRemove}
              onComplete={props.onComplete}
              messageCount={props.messageCount}
              suggestionsScrollAreaRef={props.suggestionsScrollAreaRef}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileChatPanel; 