// =====================
// 型別定義
// =====================

export interface PatchOp {
  op: 'set';
  path: string; // e.g., experience[0].achievements[1]
  value: string; // full paragraph replacement
}

export interface InsertOp {
  op: 'insert';
  path: string; // array path (e.g., experience[0].achievements)
  value: string; // bullet to insert
  index?: number; // optional explicit index (default: append or after matched index)
}

export interface RemoveOp {
  op: 'remove';
  path: string; // item path (e.g., experience[0].achievements[2]) or array path with index
  index?: number; // optional explicit index if path is the array path
}

export type PatchOpUnion = PatchOp | InsertOp | RemoveOp;

// Utility types for path operations
export type PathCursor = Record<string, unknown> | unknown[] | null;
export type ArrayContainer = unknown[] | null;

// Type-safe path navigation utilities
export interface PathNavigationResult {
  container: ArrayContainer;
  lastKey: string | number | null;
}

export interface PathValueResult<T = unknown> {
  value: T;
  parent: Record<string, unknown> | unknown[] | null;
  key: string | number | null;
}

// Type-safe object property access
export type SafeKey<T> = T extends Record<string, unknown> ? keyof T : never;
export type SafeValue<T, K> = K extends keyof T ? T[K] : unknown;

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