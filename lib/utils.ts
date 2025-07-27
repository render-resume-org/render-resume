import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * 清除智慧問答相關的 sessionStorage 數據
 */
export function clearSmartChatSession() {
  try {
    sessionStorage.removeItem('chatHistory');
    sessionStorage.removeItem('chatSuggestions');
    sessionStorage.removeItem('chatSuggestionTemplates');
    sessionStorage.removeItem('selectedSuggestions');
    sessionStorage.removeItem('analysisResult');
    sessionStorage.removeItem('optimizedResume');
    console.log('🧹 清除智慧問答會話數據');
  } catch (error) {
    console.warn('⚠️ 清除智慧問答會話數據失敗:', error);
  }
}
