// =====================
// 型別定義
// =====================

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'file';
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
  file?: {
    id: string;
    name: string;
    type: string;
    size: number;
    preview?: string;
    pages?: string[]; // PDF 頁面 base64 圖片
    isFromPdf?: boolean;
    originalPdfName?: string;
  };
}

export interface SuggestionRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  timestamp: Date;
} 