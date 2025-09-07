import { checkAdminAuth } from "@/lib/utils/admin-auth";
import { NextRequest, NextResponse } from "next/server";

// 郵件模板生成函數
function generateEmailHtml(
  templateId: string,
  subject: string,
  content: string,
  user: { email: string; display_name?: string | null }
): string {
  const userName = user.display_name || user.email.split('@')[0];
  
  // 基礎 HTML 模板
  const baseTemplate = (body: string) => `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
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
          background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
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
        
        .cta-button {
          display: inline-block;
          background-color: #0891b2;
          color: white !important;
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          margin: 20px 0;
        }
        
        .cta-button:hover {
          background-color: #0e7490;
        }
        
        .footer {
          background-color: #f9fafb;
          padding: 30px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        
        .highlight-box {
          background-color: #ecfeff;
          border-left: 4px solid #0891b2;
          padding: 20px;
          margin: 30px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .highlight-box h3 {
          color: #0891b2;
          margin: 0 0 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${body}
      </div>
    </body>
    </html>
  `;

  // 根據模板 ID 生成內容
  let emailBody = '';
  
  switch (templateId) {
    case 'announcement':
      emailBody = `
        <div class="header">
          <div class="logo">📢 Render Resume</div>
          <h1>系統公告</h1>
          <p>重要資訊請詳閱</p>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${content ? content : `
          <div class="highlight-box">
            <h3>🔔 重要公告</h3>
            <p>我們有一些重要的系統更新要與您分享。這些變更將幫助您獲得更好的使用體驗。</p>
          </div>
          <p>感謝您持續使用 Render Resume！</p>
          `}
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.render-resume.com/dashboard" class="cta-button">前往儀表板</a>
          </div>
        </div>
        <div class="footer">
          <p>此為系統自動發送的郵件，請勿直接回覆</p>
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
      break;

    case 'feature_update':
      emailBody = `
        <div class="header">
          <div class="logo">🚀 Render Resume</div>
          <h1>新功能上線！</h1>
          <p>探索最新的強大功能</p>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${content ? content : `
          <p>我們很高興地宣布，Render Resume 推出了全新功能！</p>
          <div class="highlight-box">
            <h3>✨ 新功能亮點</h3>
            <ul>
              <li>智能履歷分析升級</li>
              <li>全新的模板設計</li>
              <li>更快的處理速度</li>
              <li>改進的使用者介面</li>
            </ul>
          </div>
          <p>立即登入體驗這些令人興奮的新功能！</p>
          `}
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.render-resume.com/dashboard" class="cta-button">立即體驗</a>
          </div>
        </div>
        <div class="footer">
          <p>有任何問題嗎？歡迎聯絡我們的支援團隊</p>
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
      break;

    case 'promotion':
      emailBody = `
        <div class="header" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">
          <div class="logo">🎉 Render Resume</div>
          <h1>限時優惠！</h1>
          <p>把握機會升級您的方案</p>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${content ? content : `
          <p>好消息！我們正在進行限時優惠活動。</p>
          <div class="highlight-box" style="background-color: #f0fdf4; border-color: #059669;">
            <h3 style="color: #059669;">💎 專屬優惠</h3>
            <p><strong>升級至專業版享 30% 折扣！</strong></p>
            <ul>
              <li>無限次履歷分析</li>
              <li>進階 AI 建議</li>
              <li>優先客戶支援</li>
              <li>更多專業模板</li>
            </ul>
          </div>
          <p>優惠期限有限，立即行動！</p>
          `}
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.render-resume.com/settings" class="cta-button" style="background-color: #059669;">立即升級</a>
          </div>
        </div>
        <div class="footer">
          <p>優惠條款與細則請參考網站說明</p>
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
      break;

    case 'newsletter':
      emailBody = `
        <div class="header" style="background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);">
          <div class="logo">📰 Render Resume</div>
          <h1>月刊精選</h1>
          <p>履歷技巧與職涯洞察</p>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${content ? content : `
          <p>歡迎閱讀本月的 Render Resume 月刊！</p>
          <div class="highlight-box" style="background-color: #f3e8ff; border-color: #7c3aed;">
            <h3 style="color: #7c3aed;">📚 本期精選</h3>
            <ul>
              <li><strong>履歷撰寫技巧：</strong>如何突出您的核心競爭力</li>
              <li><strong>求職趨勢：</strong>2024 年最受歡迎的技能</li>
              <li><strong>成功案例：</strong>用戶分享求職成功經驗</li>
              <li><strong>專家建議：</strong>面試準備的關鍵要點</li>
            </ul>
          </div>
          <p>希望這些內容對您的職涯發展有所幫助！</p>
          `}
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://www.render-resume.com/faq" class="cta-button" style="background-color: #7c3aed;">查看常見問題</a>
          </div>
        </div>
        <div class="footer">
          <p>不想再收到電子報？您可以在設定中取消訂閱</p>
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
      break;

    case 'custom':
      emailBody = `
        <div class="header">
          <div class="logo">✨ Render Resume</div>
          <h1>${subject}</h1>
        </div>
        <div class="content">
          <p>親愛的 ${userName}，您好！</p>
          ${content}
        </div>
        <div class="footer">
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
      break;

    default:
      emailBody = `
        <div class="header">
          <div class="logo">✨ Render Resume</div>
          <h1>${subject}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© 2024 Render Resume. All rights reserved.</p>
        </div>
      `;
  }

  return baseTemplate(emailBody);
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await checkAdminAuth();
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { templateId, subject, content, sampleUser } = body;

    const html = generateEmailHtml(templateId, subject, content, sampleUser);

    return NextResponse.json({ html });
  } catch (error) {
    console.error('Email preview error:', error);
    return NextResponse.json(
      { error: '預覽郵件失敗' },
      { status: 500 }
    );
  }
}