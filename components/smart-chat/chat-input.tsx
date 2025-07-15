import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import React from "react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  disabled: boolean;
  messageCount: number;
}

const ChatInput = ({ value, onChange, onKeyPress, onSend, textareaRef, disabled, messageCount }: ChatInputProps) => (
  <div className="flex space-x-3 items-end">
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={messageCount >= 30 ? "已達到對話上限" : "問我任何履歷相關的問題... (Shift+Enter 換行，Enter 發送)"}
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

export default ChatInput; 