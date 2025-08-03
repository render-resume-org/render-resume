import { checkDailyUsageLimit } from '@/lib/actions/activity';
import { NextResponse } from 'next/server';

export interface UsageCheckResult {
  canProceed: boolean;
  currentUsage: number;
  dailyLimit: number;
  error?: string;
}

export interface UsageCheckResponse {
  success: boolean;
  response?: NextResponse;
  usageCheck?: UsageCheckResult;
}

/**
 * 檢查用戶今日使用量是否超過限制
 * @returns Promise<UsageCheckResponse> 包含檢查結果和可選的錯誤響應
 */
export async function checkUsageLimit(): Promise<UsageCheckResponse> {
  console.log('📊 [UTIL] Checking daily usage limit');
  const usageCheck = await checkDailyUsageLimit();
  
  if (!usageCheck.canProceed) {
    console.error('❌ [UTIL] Daily usage limit exceeded:', {
      currentUsage: usageCheck.currentUsage,
      dailyLimit: usageCheck.dailyLimit,
      error: usageCheck.error
    });
    
    const errorMessage = usageCheck.error 
      ? `使用量檢查失敗: ${usageCheck.error}`
      : `您今日已使用 ${usageCheck.currentUsage} 次分析功能，已達到每日 ${usageCheck.dailyLimit} 次的使用限制。請升級您的方案以獲得更多使用額度，或明天再試。`;
    
    const response = NextResponse.json(
      { 
        error: errorMessage,
        usageLimitExceeded: true,
        currentUsage: usageCheck.currentUsage,
        dailyLimit: usageCheck.dailyLimit
      },
      { status: 429 }
    );
    
    return {
      success: false,
      response,
      usageCheck
    };
  }
  
  console.log('✅ [UTIL] Daily usage limit check passed:', {
    currentUsage: usageCheck.currentUsage,
    dailyLimit: usageCheck.dailyLimit
  });
  
  return {
    success: true,
    usageCheck
  };
} 