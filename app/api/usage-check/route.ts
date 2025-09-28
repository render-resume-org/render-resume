import { checkUsageLimit } from '@/features/account/utils/usage-check';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('📊 [API] Checking usage limit');
    
    const usageResult = await checkUsageLimit();
    
    if (!usageResult.success) {
      // 如果用量檢查失敗，返回錯誤響應
      return usageResult.response || NextResponse.json(
        { 
          error: '用量檢查失敗',
          canProceed: false 
        },
        { status: 500 }
      );
    }
    
    // 用量檢查成功，返回結果
    return NextResponse.json({
      canProceed: usageResult.usageCheck?.canProceed || false,
      currentUsage: usageResult.usageCheck?.currentUsage || 0,
      dailyLimit: usageResult.usageCheck?.dailyLimit || 0,
      success: true
    });
    
  } catch (error) {
    console.error('❌ [API] Usage check error:', error);
    
    return NextResponse.json(
      { 
        error: '系統錯誤，請稍後再試',
        canProceed: false,
        success: false
      },
      { status: 500 }
    );
  }
}
