import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// PDF 專用的 className 處理，移除 hover 和互動相關的類別
export function cnPdf(...inputs: ClassValue[]) {
  const className = twMerge(clsx(inputs));
  
  // 移除 PDF 不需要的互動類別
  return className
    .replace(/hover:[^\s]+/g, '')
    .replace(/cursor-pointer/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 清除智慧問答相關的 sessionStorage 數據
 */
export function clearSessionData() {
  try {
    sessionStorage.removeItem('analysisResult');
    sessionStorage.removeItem('chatHistory');
    sessionStorage.removeItem('chatSuggestions');
    console.log('🧹 清除會話數據完成');
  } catch (error) {
    console.warn('⚠️ 清除會話數據失敗:', error);
  }
}
