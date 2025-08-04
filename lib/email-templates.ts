import * as React from 'react';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
  react?: React.ReactElement; // Optional React component for Resend
}

export interface EmailTemplateData {
  token: string;
  redirectTo: string;
  userEmail: string;
  userName?: string;
  companyName?: string;
}

// Brand colors matching RenderResume system
const BRAND_COLORS = {
  primary: '#0891b2', // cyan-600 from the system
  secondary: '#0e7490', // cyan-700
  accent: '#06b6d4', // cyan-500
  success: '#059669', // emerald-600
  warning: '#d97706', // amber-600
  error: '#dc2626', // red-600
  danger: '#dc2626',
  text: '#111827', // gray-900
  textLight: '#6b7280', // gray-500
  background: '#ffffff',
  backgroundLight: '#f9fafb', // gray-50
  border: '#e5e7eb', // gray-200
  muted: '#f3f4f6', // gray-100
};

// Base HTML template wrapper
function createBaseTemplate(content: string, title: string): string {
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
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Noto Sans TC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: ${BRAND_COLORS.text};
          background-color: ${BRAND_COLORS.backgroundLight};
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${BRAND_COLORS.background};
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .content {
          padding: 40px 30px;
        }
        
        .code-container {
          background-color: ${BRAND_COLORS.muted};
          border: 2px dashed ${BRAND_COLORS.border};
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
        }
        
        .code-label {
          color: ${BRAND_COLORS.textLight};
          font-size: 14px;
          margin-bottom: 15px;
        }
        
        .verification-code {
          font-family: 'Courier New', monospace;
          font-size: 36px;
          font-weight: bold;
          color: ${BRAND_COLORS.primary};
          letter-spacing: 6px;
          margin: 10px 0;
        }
        
        .cta-button {
          display: inline-block;
          background-color: ${BRAND_COLORS.primary};
          color: white !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
          transition: background-color 0.3s ease;
        }
        
        .cta-button:hover {
          background-color: ${BRAND_COLORS.secondary};
        }
        
        .footer {
          background-color: ${BRAND_COLORS.backgroundLight};
          padding: 30px;
          border-top: 1px solid ${BRAND_COLORS.border};
          color: ${BRAND_COLORS.textLight};
          font-size: 14px;
          line-height: 1.6;
        }
        
        .footer p {
          margin-bottom: 8px;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        @media (max-width: 600px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .verification-code {
            font-size: 28px;
            letter-spacing: 4px;
          }
          
          .cta-button {
            padding: 14px 24px;
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

// Individual email templates
export const emailTemplates = {
  signup: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header">
        <div class="logo">✨ RenderResume</div>
        <h1>歡迎加入！</h1>
        <p>讓我們確認您的帳戶，開始製作出色的履歷。</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          您好！👋<br><br>
          歡迎使用 RenderResume！我們很興奮能幫助您創建專業的 AI 履歷，讓您在競爭中脫穎而出。
        </p>
        
        <div style="text-align: center;">
          <p style="margin: 20px 0; color: ${BRAND_COLORS.textLight};">
            點擊下方按鈕確認您的電子郵件並開始使用：
          </p>
          
          <a href="${data.redirectTo}" class="cta-button">
            確認電子郵件並開始使用
          </a>
        </div>
        
        <div style="background-color: #ecfeff; border-left: 4px solid ${BRAND_COLORS.primary}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.primary}; margin-bottom: 10px;">🚀 接下來什麼？</h3>
          <ul style="margin: 0; padding-left: 20px; color: ${BRAND_COLORS.text};">
            <li>上傳您的現有履歷或從頭開始</li>
            <li>獲得 AI 驅動的改進建議</li>
            <li>下載專業的 PDF 版本</li>
            <li>與潛在雇主分享您的履歷</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>重要提醒：</strong>此信件將於 1 小時後過期，以確保安全性。</p>
        <p>如果您沒有建立 RenderResume 帳戶，您可以安全地忽略此電子郵件。</p>
        <p style="margin-top: 20px;">
          需要協助？回覆此電子郵件，我們很樂意為您提供協助！
        </p>
      </div>
    `;
    
    return {
      subject: '✨ 歡迎使用 RenderResume - 確認您的帳戶',
      html: createBaseTemplate(content, '確認您的 RenderResume 帳戶'),
      text: `歡迎使用 RenderResume！\n\n確認您的帳戶代碼：${data.token}\n\n或造訪：${data.redirectTo}\n\n此代碼將於 1 小時後過期。\n\n如果您沒有建立此帳戶，您可以安全地忽略此電子郵件。`
    };
  },

  login: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header">
        <div class="logo">✨ RenderResume</div>
        <h1>登入您的帳戶</h1>
        <p>您的安全登入連結已準備就緒。</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          您好！👋<br><br>
          有人（希望是您！）請求登入您的 RenderResume 帳戶。
        </p>
        
        <div class="code-container">
          <div class="code-label">您的登入代碼：</div>
          <div class="verification-code">${data.token}</div>
        </div>
        
        <div style="text-align: center;">
          <p style="margin: 20px 0; color: ${BRAND_COLORS.textLight};">
            點擊下方按鈕安全登入：
          </p>
          
          <a href="${data.redirectTo}" class="cta-button">
            登入 RenderResume
          </a>
        </div>
        
        <div style="background-color: #fffbeb; border-left: 4px solid ${BRAND_COLORS.warning}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.warning}; margin-bottom: 10px;">🔒 安全提醒</h3>
          <p style="margin: 0; color: ${BRAND_COLORS.text};">
            此登入連結將於 1 小時後過期。如果您沒有請求此登入，請忽略此電子郵件並考慮更改您的密碼。
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>安全提示：</strong>請勿與任何人分享此登入代碼。</p>
        <p>此登入連結將於 1 小時後過期以確保您的安全。</p>
        <p style="margin-top: 20px;">
          遇到問題？回覆此電子郵件，我們很樂意為您提供協助！
        </p>
      </div>
    `;
    
    return {
      subject: '🔐 登入 RenderResume',
      html: createBaseTemplate(content, '登入 RenderResume'),
      text: `登入 RenderResume\n\n您的登入代碼：${data.token}\n\n或造訪：${data.redirectTo}\n\n此代碼將於 1 小時後過期。\n\n如果您沒有請求此登入，請忽略此電子郵件。`
    };
  },

  recovery: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header" style="background: linear-gradient(135deg, ${BRAND_COLORS.error} 0%, ${BRAND_COLORS.danger} 100%);">
        <div class="logo">✨ RenderResume</div>
        <h1>重設您的密碼</h1>
        <p>讓我們安全地讓您重新進入您的帳戶。</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          您好！👋<br><br>
          我們收到了重設您 RenderResume 帳戶密碼的請求。別擔心，這種事常常發生！
        </p>
        
        <div class="code-container" style="background-color: #fef2f2; border-color: #fecaca;">
          <div class="code-label" style="color: ${BRAND_COLORS.danger};">您的密碼重設代碼：</div>
          <div class="verification-code" style="color: ${BRAND_COLORS.danger};">${data.token}</div>
        </div>
        
        <div style="text-align: center;">
          <p style="margin: 20px 0; color: ${BRAND_COLORS.textLight};">
            點擊下方按鈕建立新密碼：
          </p>
          
          <a href="${data.redirectTo}" class="cta-button" style="background-color: ${BRAND_COLORS.danger};">
            重設我的密碼
          </a>
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid ${BRAND_COLORS.danger}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.danger}; margin-bottom: 10px;">🛡️ 安全提醒</h3>
          <ul style="margin: 0; padding-left: 20px; color: ${BRAND_COLORS.text};">
            <li>此重設連結將於 1 小時後過期</li>
            <li>選擇一個強而獨特的密碼</li>
            <li>請勿與任何人分享您的密碼</li>
            <li>考慮使用密碼管理器</li>
          </ul>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>沒有請求此項？</strong>如果您沒有請求密碼重設，您可以安全地忽略此電子郵件。您的帳戶仍然安全。</p>
        <p>此重設連結將於 1 小時後過期以確保安全性。</p>
        <p style="margin-top: 20px;">
          有疑問？回覆此電子郵件，我們很樂意為您提供協助！
        </p>
      </div>
    `;
    
    return {
      subject: '🔒 重設您的 RenderResume 密碼',
      html: createBaseTemplate(content, '重設您的密碼'),
      text: `重設您的 RenderResume 密碼\n\n您的重設代碼：${data.token}\n\n或造訪：${data.redirectTo}\n\n此代碼將於 1 小時後過期。\n\n如果您沒有請求此重設，您可以安全地忽略此電子郵件。`
    };
  },

  invite: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header" style="background: linear-gradient(135deg, ${BRAND_COLORS.success} 0%, #059669 100%);">
        <div class="logo">✨ RenderResume</div>
        <h1>您受到邀請！</h1>
        <p>有人邀請您加入 RenderResume。</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          您好！👋<br><br>
          您受邀加入 RenderResume，這是一個 AI 驅動的平台，用於創建引人注目的專業履歷。
        </p>
        
        <div class="code-container" style="background-color: #f0fdf4; border-color: #bbf7d0;">
          <div class="code-label" style="color: ${BRAND_COLORS.success};">您的邀請代碼：</div>
          <div class="verification-code" style="color: ${BRAND_COLORS.success};">${data.token}</div>
        </div>
        
        <div style="text-align: center;">
          <p style="margin: 20px 0; color: ${BRAND_COLORS.textLight};">
            點擊下方按鈕接受您的邀請：
          </p>
          
          <a href="${data.redirectTo}" class="cta-button" style="background-color: ${BRAND_COLORS.success};">
            接受邀請
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>此邀請將於 24 小時後過期。</strong></p>
        <p>如果您沒有預期收到此邀請，您可以安全地忽略此電子郵件。</p>
      </div>
    `;
    
    return {
      subject: '🎉 您受邀使用 RenderResume！',
      html: createBaseTemplate(content, 'RenderResume 邀請'),
      text: `您受邀使用 RenderResume！\n\n您的邀請代碼：${data.token}\n\n接受邀請：${data.redirectTo}\n\n此邀請將於 24 小時後過期。`
    };
  },

  emailChange: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header" style="background: linear-gradient(135deg, ${BRAND_COLORS.warning} 0%, #d97706 100%);">
        <div class="logo">✨ RenderResume</div>
        <h1>確認電子郵件變更</h1>
        <p>驗證您的新電子郵件地址。</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          您好！👋<br><br>
          您請求變更您 RenderResume 帳戶的電子郵件地址。請使用下方的代碼確認此變更。
        </p>
        
        <div class="code-container" style="background-color: #fffbeb; border-color: #fed7aa;">
          <div class="code-label" style="color: ${BRAND_COLORS.warning};">您的確認代碼：</div>
          <div class="verification-code" style="color: ${BRAND_COLORS.warning};">${data.token}</div>
        </div>
        
        <div style="text-align: center;">
          <a href="${data.redirectTo}" class="cta-button" style="background-color: ${BRAND_COLORS.warning};">
            確認電子郵件變更
          </a>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>重要提醒：</strong>此確認代碼將於 1 小時後過期。</p>
        <p>如果您沒有請求此變更，請立即聯絡支援。</p>
      </div>
    `;
    
    return {
      subject: '📧 確認您的電子郵件變更 - RenderResume',
      html: createBaseTemplate(content, '確認電子郵件變更'),
      text: `確認您的 RenderResume 電子郵件變更\n\n確認代碼：${data.token}\n\n或造訪：${data.redirectTo}\n\n此代碼將於 1 小時後過期。`
    };
  },

  waitlistWelcome: (data: EmailTemplateData): EmailTemplate => {
    const content = `
      <div class="header">
        <div class="logo">🎯 Render Resume</div>
        <h1>🎉 歡迎加入 Waitlist！</h1>
        <p>您已成功加入我們的搶先體驗名單，讓我們一起創造更好的履歷體驗！</p>
      </div>
      
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">
          親愛的 ${data.userName || '您'}，您好！👋<br><br>
          🎊 恭喜您成功加入 Render Resume 的 Waitlist！我們非常興奮能與您一起開啟 AI 履歷分析的全新體驗。
        </p>
        
        <div style="background-color: #ecfeff; border-left: 4px solid ${BRAND_COLORS.primary}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.primary}; margin-bottom: 15px;">🚀 您將獲得什麼？</h3>
          <div style="color: ${BRAND_COLORS.text}; line-height: 1.8;">
            ✨ <strong>六維度專業分析</strong> - 基於 Fortune 500 企業標準<br>
            🎯 <strong>個人化改進建議</strong> - AI 驅動的精準優化<br>
            📊 <strong>競爭力評分</strong> - 清楚了解您的優勢與改進空間<br>
            🔄 <strong>即時更新</strong> - 隨時追蹤履歷優化進度<br>
            💎 <strong>搶先體驗</strong> - 免費使用完整功能
          </div>
        </div>

        <div style="background-color: #fffbeb; border-left: 4px solid ${BRAND_COLORS.warning}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.warning}; margin-bottom: 10px;">⏰ 接下來會發生什麼？</h3>
          <p style="margin: 0; color: ${BRAND_COLORS.text};">
            我們會在 <strong>一個月內</strong> 發送您的專屬邀請碼，屆時您就可以：
          </p>
          <div style="margin: 10px 0 0 0; padding-left: 20px; color: ${BRAND_COLORS.text};">
            1️⃣ 上傳您的履歷進行分析<br>
            2️⃣ 獲得詳細的優化建議<br>
            3️⃣ 下載改進後的專業版本
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="margin: 20px 0; color: ${BRAND_COLORS.textLight};">
            想了解更多？探索我們的功能介紹：
          </p>
          
                          <a href="https://www.render-resume.com/resume-builder" class="cta-button">
            🔍 探索更多功能
          </a>
        </div>

        <div style="background-color: #ecfeff; border-left: 4px solid ${BRAND_COLORS.primary}; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0;">
          <h3 style="color: ${BRAND_COLORS.primary}; margin-bottom: 10px;">💡 小撇步</h3>
          <div style="margin: 0; color: ${BRAND_COLORS.text};">
            在等待期間，您可以：<br>
            • 關注我們的<a href="https://www.threads.net/@newbie.founder" style="color: ${BRAND_COLORS.primary};">部落格</a>獲取履歷撰寫技巧<br>
            • 瀏覽<a href="https://www.render-resume.com/faq" style="color: ${BRAND_COLORS.primary};">常見問題</a>了解更多功能細節<br>
            • 準備您想要分析的履歷文件（支援 PDF 格式）
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p><strong>📧 聯絡資訊：</strong></p>
        <p>
          • 電子郵件：${data.userEmail}<br>
          • 加入時間：${new Date().toLocaleDateString('zh-TW')}
        </p>
        <p style="margin-top: 20px;">
          有任何問題嗎？回覆此電子郵件，我們很樂意為您提供協助！
        </p>
        <p style="margin-top: 15px; font-style: italic;">
          感謝您對 Render Resume 的信任與支持！🙏
        </p>
      </div>
    `;
    
    return {
      subject: '🎉 歡迎加入 Render Resume Waitlist！搶先體驗 AI 履歷分析',
      html: createBaseTemplate(content, '歡迎加入 Render Resume Waitlist'),
      text: `🎉 歡迎加入 Render Resume Waitlist！

親愛的 ${data.userName || '您'}，

恭喜您成功加入 Render Resume 的 Waitlist！

您將獲得：
✨ 六維度專業分析 - 基於 Fortune 500 企業標準
🎯 個人化改進建議 - AI 驅動的精準優化
📊 競爭力評分 - 清楚了解您的優勢與改進空間
🔄 即時更新 - 隨時追蹤履歷優化進度
💎 搶先體驗 - 免費使用完整功能

我們會在 一個月內 發送您的專屬邀請碼。

探索更多功能：https://www.render-resume.com

聯絡資訊：
• 電子郵件：${data.userEmail}
• 加入時間：${new Date().toLocaleDateString('zh-TW')}

感謝您對 Render Resume 的信任與支持！🙏`
    };
  }
};

// Helper function to get template by action type
export function getEmailTemplate(
  emailActionType: string, 
  token: string, 
  redirectTo: string, 
  userEmail: string,
  userName?: string
): EmailTemplate {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.render-resume.com';
  const data: EmailTemplateData = {
    token,
    redirectTo: redirectTo || baseUrl,
    userEmail,
    userName
  };

  // Try to use React templates if available (for better Resend support)
  if (typeof window === 'undefined') { // Server-side only
    try {
      switch (emailActionType) {
        case 'signup': {
          // Dynamically import React template
          const template = emailTemplates.signup(data);
          return {
            ...template,
            // Note: React component would be imported dynamically in the actual email sending function
          };
        }
      }
    } catch (error) {
      // Fallback to HTML templates if React components fail
      console.log('Falling back to HTML templates:', error);
    }
  }

  switch (emailActionType) {
    case 'signup':
      return emailTemplates.signup(data);
    case 'login':
      return emailTemplates.login(data);
    case 'recovery':
      return emailTemplates.recovery(data);
    case 'invite':
      return emailTemplates.invite(data);
    case 'email_change_current':
    case 'email_change_new':
      return emailTemplates.emailChange(data);
    case 'waitlist_welcome':
      return emailTemplates.waitlistWelcome(data);
    default:
      // Fallback template
      return {
        subject: `Render Resume - Action Required`,
        html: createBaseTemplate(`
          <div class="header">
            <div class="logo">🎯 Render Resume</div>
            <h1>Action Required</h1>
          </div>
          <div class="content">
            <p>Your verification code: <strong>${token}</strong></p>
            <a href="${data.redirectTo}" class="cta-button">Continue</a>
          </div>
        `, 'Action Required'),
        text: `Render Resume action required. Code: ${token}. Visit: ${data.redirectTo}`
      };
  }
}

// New function to get React email template for Resend
export async function getReactEmailTemplate(
  emailActionType: string,
  token: string,
  redirectTo: string,
  userEmail: string,
  userName?: string
): Promise<React.ReactElement | null> {
  if (typeof window !== 'undefined') return null; // Client-side guard
  
  try {
    switch (emailActionType) {
      case 'signup': {
        const { SignupEmailTemplate } = await import('@/components/emails/SignupEmailTemplate');
        return React.createElement(SignupEmailTemplate, {
          token,
          redirectTo: redirectTo || process.env.NEXT_PUBLIC_APP_URL || 'https://www.render-resume.com',
          userName
        });
      }
      case 'waitlist_welcome': {
        const { WaitlistWelcomeEmailTemplate } = await import('@/components/emails/WaitlistWelcomeEmailTemplate');
        return React.createElement(WaitlistWelcomeEmailTemplate, {
          userName,
          userEmail
        });
      }
      default:
        return null;
    }
  } catch (error) {
    console.error('Error loading React email template:', error);
    return null;
  }
} 