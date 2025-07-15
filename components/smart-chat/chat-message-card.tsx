import { useAuth } from "@/components/hooks/use-auth";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ChatMessage } from "../smart-chat";
import ExcerptCard from "./excerpt-card";
import SuggestionCard from "./suggestion-card";
import UserAvatar from "./user-avatar";

interface ChatMessageCardProps {
  message: ChatMessage;
}

const ChatMessageCard = ({ message }: ChatMessageCardProps) => {
  const { user } = useAuth();
  // timestamp 兼容 string 或 Date
  const time = typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp;
  return (
    <div className={cn(`w-full flex`, message.type === 'user' ? 'justify-end' : 'justify-start')}>
      <div className={cn("flex items-start space-x-2 max-w-[90vw]", message.type === 'user' ? 'flex-row-reverse space-x-reverse' : '')}>
        {message.type === 'user' ? (
          <UserAvatar user={user} />
        ) : (
          <Image
            src="/images/remo.png"
            alt="AI 機器人頭像"
            width={32}
            height={32}
            className="border w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 object-cover"
            priority
          />
        )}
        <div className="w-fit max-w-full space-y-2">
          {/* 履歷摘錄卡片 */}
          {message.excerpt && message.type === 'ai' && (
            <ExcerptCard excerpt={message.excerpt} />
          )}
          {/* 主要消息內容 */}
          <div
            className={cn(`rounded-lg px-4 py-2`, message.type === 'user'
              ? 'bg-cyan-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            )}
          >
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {time.toLocaleTimeString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          {/* 若有 suggestion，顯示建議卡片（以 template 樣式） */}
          {message.type === 'ai' && message.suggestion && (
            <SuggestionCard
              suggestion={{
                id: 'inline',
                ...message.suggestion,
                timestamp: message.timestamp
              }}
              onQuote={() => {}}
              onRemove={() => {}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageCard; 