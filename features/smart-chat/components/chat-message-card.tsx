import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { ChatMessage } from "../types/resume-editor";
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

  // 檔案訊息顯示
  if (message.type === 'file' && message.file) {
    return (
      <div className={cn('w-full flex justify-end')}>
        <div className="flex flex-row-reverse items-start space-x-reverse space-x-2 max-w-[90vw]">
          <UserAvatar user={user} />
          <div className="w-fit max-w-full space-y-2">
            <div className="rounded-lg px-4 py-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-900 dark:text-cyan-100">
              <div className="flex items-center gap-2">
                {message.file.type.startsWith('image/') && message.file.preview && (
                  <Image src={message.file.preview} alt={message.file.name} width={96} height={96} className="rounded max-h-24 max-w-24 object-cover" />
                )}
                {message.file.isFromPdf && message.file.pages && message.file.pages.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {message.file.pages.slice(0, 4).map((img, idx) => (
                      <Image key={idx} src={img} alt={`PDF頁面${idx + 1}`} width={48} height={64} className="rounded border max-h-16 max-w-12 object-cover" />
                    ))}
                    {message.file.pages.length > 4 && (
                      <span className="text-xs text-gray-400 ml-2">+{message.file.pages.length - 4}頁</span>
                    )}
                  </div>
                )}
                <div>
                  <div className="font-medium text-cyan-900 dark:text-cyan-100">{message.file.name}</div>
                  <div className="text-xs text-gray-500">{(message.file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <div className="text-xs opacity-70 mt-1">{time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                title: message.suggestion.title,
                description: message.suggestion.description,
                category: message.suggestion.category,
                timestamp: message.timestamp as Date,
                patchOps: message.suggestion.patchOps
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