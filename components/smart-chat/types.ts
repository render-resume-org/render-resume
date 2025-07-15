// =====================
// 型別定義
// =====================

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
  };
  quickResponses?: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string; // e.g., "工作經驗", "專案經驗", "技能"
  };
  excerptId?: string; // 用於追蹤 excerpt 的唯一 ID
}

export interface SuggestionRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: Date;
} 