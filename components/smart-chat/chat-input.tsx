import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send } from "lucide-react";
import React, { useRef } from "react";
import { CHAT_MESSAGE_LIMIT } from "./utils";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
  messageCount: number;
  onFileUpload?: (files: File[]) => void;
  fileUploadDisabled?: boolean;
}

const ChatInput = ({ value, onChange, onKeyPress, onSend, textareaRef, disabled, messageCount, onFileUpload, fileUploadDisabled }: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    if (!fileUploadDisabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && onFileUpload) {
      onFileUpload(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  // 新增：支援貼上圖片
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (fileUploadDisabled || !onFileUpload) return;
    const items = e.clipboardData.items;
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      e.preventDefault(); // 避免圖片 base64 直接貼到文字框
      onFileUpload(files);
    }
  };

  return (
    <div className="flex space-x-3 items-center justify-center">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="flex-shrink-0"
        onClick={handleFileButtonClick}
        tabIndex={-1}
        aria-label="上傳附件"
        disabled={!!fileUploadDisabled}
        title={fileUploadDisabled ? '單次最多上傳 3 個文件' : undefined}
      >
        <Plus className="h-5 w-5" />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept="image/*,application/pdf"
          disabled={!!fileUploadDisabled}
        />
      </Button>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onPaste={handlePaste}
        placeholder={messageCount >= CHAT_MESSAGE_LIMIT ? "已達到對話上限" : "問我任何履歷相關的問題... (Shift+Enter 換行，Enter 發送)"}
        disabled={disabled}
        className="flex-1 min-h-[48px] max-h-[120px] resize-none transition-colors focus:border-cyan-500 focus:ring-cyan-500 text-sm"
        rows={1}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || disabled}
        size="icon"
        className="flex-shrink-0 bg-cyan-600 hover:bg-cyan-700 transition-colors disabled:opacity-50 h-12 w-12"
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput; 