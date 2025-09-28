import { getEmailTemplate, getReactEmailTemplate } from '@/features/content/lib/email-templates';
import { NextRequest, NextResponse } from 'next/server';

interface EmailResult {
  success?: boolean;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

interface TestResult {
  success: boolean;
  templates: {
    subject: string;
    hasReactTemplate: boolean;
    hasHtmlTemplate: boolean;
    hasTextTemplate: boolean;
  };
  testInfo: {
    email: string;
    userName: string;
    redeemCode: string;
    timestamp: string;
  };
  emailSent?: boolean;
  emailResult?: EmailResult;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    // 提取查詢參數
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'test@example.com';
    const userName = searchParams.get('userName') || '測試用戶';
    const redeemCode = searchParams.get('redeemCode') || 'REDEEMCODE';
    const format = searchParams.get('format') || 'html'; // html, text, or json
    
    console.log('🧪 [Test Beta Release Email] Generating template for:', email);
    
    // 獲取郵件模板
    const emailTemplate = getEmailTemplate(
      'beta_release',
      redeemCode, // 使用 redeemCode 作為 token
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      userName
    );
    
    if (!emailTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    
    // 根據格式返回不同內容
    switch (format) {
      case 'text':
        return new NextResponse(emailTemplate.text || 'No text template available', {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });
      
      case 'json':
        return NextResponse.json({
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
          redeemCode: redeemCode,
          timestamp: new Date().toISOString(),
        });
      
      case 'html':
      default:
        return new NextResponse(emailTemplate.html || emailTemplate.text || 'No HTML template available', {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
    }
    
  } catch (error) {
    console.error('❌ [Test Beta Release Email] Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate beta release email template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userName, redeemCode = 'REDEEMCODE', sendActualEmail = false } = body;
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    console.log('🧪 [Test Beta Release Email] Testing with:', { email, userName, redeemCode, sendActualEmail });
    
    // 獲取 React 模板進行測試
    const reactTemplate = await getReactEmailTemplate(
      'beta_release',
      redeemCode,
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      userName || email.split('@')[0]
    );
    
    // 獲取 HTML 模板
    const emailTemplate = getEmailTemplate(
      'beta_release',
      redeemCode,
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      email,
      userName || email.split('@')[0]
    );
    
    const result: TestResult = {
      success: true,
      templates: {
        subject: emailTemplate?.subject || 'Beta Release Notification',
        hasReactTemplate: !!reactTemplate,
        hasHtmlTemplate: !!emailTemplate?.html,
        hasTextTemplate: !!emailTemplate?.text,
      },
      testInfo: {
        email,
        userName: userName || email.split('@')[0],
        redeemCode,
        timestamp: new Date().toISOString(),
      }
    };
    
    // 如果要求發送實際郵件
    if (sendActualEmail && email !== 'test@example.com') {
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/send-beta-release`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            userName: userName || email.split('@')[0],
            redeemCode,
          }),
        });
        
        const emailResult: EmailResult = await response.json();
        result.emailSent = response.ok;
        result.emailResult = emailResult;
      } catch (emailError) {
        result.emailSent = false;
        result.error = `發送郵件失敗: ${emailError}`;
      }
    }
    
    console.log('Test beta release email result:', result);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ [Test Beta Release Email] POST Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to test beta release email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
