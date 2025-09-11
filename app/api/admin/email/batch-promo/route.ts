import { createClient } from "@/lib/supabase/server";
import { TablesInsert } from "@/lib/types/database";
import { checkAdminAuth } from "@/lib/utils/admin-auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BatchPromoEmailRequest {
  title: string;
  body: string;
  recipients: Array<{
    email: string;
    username: string;
  }>;
  promoConfig: {
    plan_id: number;
    single_use: boolean;
    expire_date?: string;
  };
}

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  avatar_url: string | null;
}

interface EmailResult {
  email: string;
  success: boolean;
  error?: string;
  promoCode?: string;
}

// Generate unique promo code
function generatePromoCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Replace user variables in template
function replaceUserVariables(template: string, user: UserData, promoCode: string): string {
  return template
    .replace(/\{\{user\.email\}\}/g, user.email || '')
    .replace(/\{\{user\.display_name\}\}/g, user.display_name || user.email?.split('@')[0] || '')
    .replace(/\{\{user\.id\}\}/g, user.id)
    .replace(/\{\{user\.created_at\}\}/g, new Date(user.created_at).toLocaleDateString('zh-TW'))
    .replace(/\{\{user\.avatar_url\}\}/g, user.avatar_url || '')
    .replace(/\{\{promo_code\}\}/g, promoCode);
}

// Generate email HTML template
function generateEmailHtml(title: string, body: string, user: UserData, promoCode: string): string {
  const processedBody = replaceUserVariables(body, user, promoCode);
  const userName = user.display_name || user.email?.split('@')[0] || '';
  
  return `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Noto Sans TC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #111827;
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .promo-box {
          background-color: #f0fdf4;
          border: 2px dashed #059669;
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
          text-align: center;
        }
        
        .promo-code {
          font-size: 24px;
          font-weight: 700;
          color: #059669;
          background-color: white;
          padding: 12px 24px;
          border-radius: 8px;
          display: inline-block;
          margin: 12px 0;
          letter-spacing: 2px;
          border: 2px solid #059669;
        }
        
        .cta-button {
          display: inline-block;
          background-color: #059669;
          color: white !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
        }
        
        .cta-button:hover {
          background-color: #047857;
        }
        
        .footer {
          background-color: #f9fafb;
          padding: 30px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="logo">🎉 Render Resume</div>
          <h1>${title}</h1>
          <p>專屬優惠代碼</p>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${processedBody}
          <div class="promo-box">
            <h3 style="color: #059669; margin: 0 0 12px 0;">🎁 您的專屬優惠代碼</h3>
            <div class="promo-code">${promoCode}</div>
            <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
              請複製此代碼並在結帳時使用
            </p>
          </div>
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.render-resume.com/settings" class="cta-button">立即使用優惠</a>
          </div>
        </div>
        <div class="footer">
          <p>優惠條款與細則請參考網站說明</p>
          <p>© 2025 Render Resume. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Send single email with promo code
async function sendSingleEmail(
  to: string,
  title: string,
  html: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const fromEmail = process.env.FROM_EMAIL;
    
    if (!fromEmail) {
      throw new Error('FROM_EMAIL environment variable is required');
    }

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: title,
      html: html,
    });

    if (error) {
      throw new Error(error.message);
    }

    console.log(`✅ 成功發送促銷郵件至: ${to}, ID: ${data?.id}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ 發送促銷郵件失敗至 ${to}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Main batch sending function with promo code generation
async function sendBatchPromoEmails(
  supabase: Awaited<ReturnType<typeof createClient>>,
  recipients: Array<{ email: string; username: string }>,
  title: string,
  body: string,
  promoConfig: BatchPromoEmailRequest['promoConfig']
): Promise<{ successCount: number; failedCount: number; details: EmailResult[] }> {
  const results: EmailResult[] = [];
  let successCount = 0;
  let failedCount = 0;

  // Batch processing with rate limiting
  const batchSize = 5;
  const delay = 2000; // 2 second delay between batches

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (recipient) => {
      try {
        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email, display_name, created_at, avatar_url')
          .eq('email', recipient.email)
          .single();

        if (userError || !userData) {
          throw new Error(`User not found: ${recipient.email}`);
        }

        // Generate unique promo code
        let promoCode: string;
        let codeExists = true;
        let attempts = 0;
        
        while (codeExists && attempts < 10) {
          promoCode = generatePromoCode();
          const { data: existingCode } = await supabase
            .from('promo_codes')
            .select('id')
            .eq('code', promoCode)
            .single();
          
          codeExists = !!existingCode;
          attempts++;
        }

        if (codeExists) {
          throw new Error('Failed to generate unique promo code');
        }

        // Insert promo code into database
        const promoData: TablesInsert<'promo_codes'> = {
          code: promoCode!,
          plan_id: promoConfig.plan_id,
          single_use: promoConfig.single_use,
          expire_date: promoConfig.expire_date || null,
        };

        const { error: promoError } = await supabase
          .from('promo_codes')
          .insert(promoData);

        if (promoError) {
          throw new Error(`Failed to create promo code: ${promoError.message}`);
        }

        // Generate email HTML
        const html = generateEmailHtml(title, body, userData, promoCode!);

        // Send email
        const emailResult = await sendSingleEmail(recipient.email, title, html);

        if (emailResult.success) {
          successCount++;
        } else {
          failedCount++;
        }

        return {
          email: recipient.email,
          success: emailResult.success,
          error: emailResult.error,
          promoCode: promoCode!,
        };

      } catch (error) {
        failedCount++;
        return {
          email: recipient.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return { successCount, failedCount, details: results };
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body: BatchPromoEmailRequest = await request.json();
    const { title, body: emailBody, recipients, promoConfig } = body;

    // Validate required parameters
    if (!title?.trim()) {
      return NextResponse.json(
        { error: '請輸入郵件標題' },
        { status: 400 }
      );
    }

    if (!emailBody?.trim()) {
      return NextResponse.json(
        { error: '請輸入郵件內容' },
        { status: 400 }
      );
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: '請選擇收件人' },
        { status: 400 }
      );
    }

    if (!promoConfig || !promoConfig.plan_id) {
      return NextResponse.json(
        { error: '請設定優惠方案' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Resend API Key 未設定' },
        { status: 500 }
      );
    }

    if (!process.env.FROM_EMAIL) {
      return NextResponse.json(
        { error: 'FROM_EMAIL 未設定' },
        { status: 500 }
      );
    }

    console.log(`📧 開始發送促銷郵件給 ${recipients.length} 位收件人`);

    // Send batch emails with promo codes
    const result = await sendBatchPromoEmails(
      authResult.supabase,
      recipients,
      title,
      emailBody,
      promoConfig
    );

    console.log(`📧 促銷郵件發送完成: 成功 ${result.successCount}, 失敗 ${result.failedCount}`);

    return NextResponse.json({
      success: true,
      successCount: result.successCount,
      failedCount: result.failedCount,
      details: result.details,
      message: `成功發送 ${result.successCount} 封郵件，失敗 ${result.failedCount} 封`
    });

  } catch (error) {
    console.error('Batch promo email send error:', error);
    return NextResponse.json(
      { error: '發送促銷郵件失敗' },
      { status: 500 }
    );
  }
}