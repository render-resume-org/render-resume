import { getReactEmailTemplate } from '@/services/email-templates';
import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';

interface ReactPreviewRequest {
  emailType: 'waitlist' | 'beta-release';
  email: string;
  userName: string;
  redeemCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReactPreviewRequest = await request.json();
    const { emailType, email, userName, redeemCode } = body;

    if (!email || !userName) {
      return NextResponse.json(
        { error: 'Email and userName are required' },
        { status: 400 }
      );
    }

    console.log('⚛️ [React Email Preview] Generating preview for:', { emailType, email, userName });

    // 根據郵件類型選擇對應的 action type
    const actionType = emailType === 'waitlist' ? 'waitlist_welcome' : 'beta_release';
    
    // 獲取 React 組件
    const reactComponent = await getReactEmailTemplate(
      actionType,
      redeemCode || 'TESTCODE', // 使用提供的 redeemCode 或預設值
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      userName
    );

    if (!reactComponent) {
      return NextResponse.json(
        { error: `React template not found for ${emailType}` },
        { status: 404 }
      );
    }

    // 將 React 組件渲染為 HTML
    const html = await render(reactComponent);

    console.log('✅ [React Email Preview] Successfully generated HTML');

    return NextResponse.json({
      success: true,
      html,
      emailType,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('❌ [React Email Preview] Error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to generate React email preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// 處理 GET 請求 - 提供 API 資訊
export async function GET() {
  return NextResponse.json({
    message: 'React Email Preview API',
    description: 'POST endpoint to preview React email components',
    supportedTypes: ['waitlist', 'beta-release'],
    example: {
      method: 'POST',
      body: {
        emailType: 'beta-release',
        email: 'test@example.com',
        userName: '測試用戶',
        redeemCode: 'REDEEMCODE'
      }
    }
  });
}
