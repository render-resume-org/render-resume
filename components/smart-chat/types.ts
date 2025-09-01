// =====================
// 型別定義
// =====================

export type PatchOp =
  | {
      op: 'set';
      path: string; // e.g., experience[0].achievements[1]
      value: string; // full paragraph replacement
    }
  | {
      op: 'insert';
      path: string; // array path (e.g., experience[0].achievements)
      value: string; // bullet to insert
      index?: number; // optional explicit index (default: append or after matched index)
    }
  | {
      op: 'remove';
      path: string; // item path (e.g., experience[0].achievements[2]) or array path with index
      index?: number; // optional explicit index if path is the array path
    };

export interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'file';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
    patchOps?: PatchOp[]; // optional apply-ready operations
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
  patchOps?: PatchOp[]; // optional apply-ready operations
}

export interface SuggestionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed';
  originalFollowUp?: string; // 原始的 follow-up 問題
  completedSuggestion?: SuggestionRecord; // 完成後的建議
  timestamp: Date;
  patchOps?: PatchOp[]; // optional apply-ready operations
}

// Utility types for path operations
export type PathValue = string | number | boolean | null | undefined;
export type PathObject = Record<string, unknown>;
export type PathArray = unknown[];

// Type-safe path navigation
export interface PathNavigationResult {
  container: PathArray | null;
  lastKey: string | number | null;
}

export interface PathCursor {
  [key: string]: unknown;
} 