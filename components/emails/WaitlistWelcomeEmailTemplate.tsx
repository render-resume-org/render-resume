import { Heading, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { BRAND_COLORS, emailStyles } from './BaseEmailTemplate';

interface WaitlistWelcomeEmailTemplateProps {
  userName?: string;
  userEmail: string;
}

export const WaitlistWelcomeEmailTemplate: React.FC<WaitlistWelcomeEmailTemplateProps> = ({
  userName = '您',
  userEmail,
}) => {
  return (
    <BaseEmailTemplate
      preview="🎉 歡迎加入 RenderResume Waitlist！搶先體驗 AI 履歷分析"
    >
      <Section style={emailStyles.header}>
        <Text style={emailStyles.logo}>RenderResume</Text>
        <Heading style={emailStyles.headerTitle}>🎉 歡迎加入 Waitlist！</Heading>
        <Text style={emailStyles.headerSubtitle}>
          您已成功加入我們的搶先體驗名單，讓我們一起創造更好的履歷體驗！
        </Text>
      </Section>
      
      <Section style={emailStyles.content}>
        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '0 0 20px 0' }}>
          親愛的 {userName}，您好！👋<br /><br />
          🎊 恭喜您成功加入 Render Resume 的 Waitlist！我們非常興奮能與您一起開啟 AI 履歷分析的全新體驗。
        </Text>
        
        <Section style={emailStyles.infoBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.primary, marginBottom: '15px', margin: '0 0 15px 0' }}>
            🚀 您將獲得什麼？
          </Heading>
          <Text style={{ margin: 0, color: BRAND_COLORS.text, lineHeight: '1.8' }}>
            ✨ <strong>六維度專業分析</strong> - 基於 Fortune 500 企業標準<br />
            🎯 <strong>個人化改進建議</strong> - AI 驅動的精準優化<br />
            📊 <strong>競爭力評分</strong> - 清楚了解您的優勢與改進空間<br />
            🔄 <strong>即時更新</strong> - 隨時追蹤履歷優化進度<br />
            💎 <strong>搶先體驗</strong> - 免費使用完整功能
          </Text>
        </Section>

        <Section style={emailStyles.warningBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.warning, marginBottom: '10px', margin: '0 0 10px 0' }}>
            ⏰ 接下來會發生什麼？
          </Heading>
          <Text style={{ margin: 0, color: BRAND_COLORS.text }}>
            我們會在 <strong>一個月內</strong> 發送您的專屬邀請碼，屆時您就可以：
          </Text>
          <Text style={{ margin: '10px 0 0 0', paddingLeft: '20px', color: BRAND_COLORS.text }}>
            1️⃣ 上傳您的履歷進行分析<br />
            2️⃣ 獲得詳細的優化建議<br />
            3️⃣ 下載改進後的專業版本
          </Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '30px 0' }}>
          <Text style={{ margin: '20px 0', color: BRAND_COLORS.textLight }}>
            想了解更多？探索我們的功能介紹：
          </Text>
          
          <Link target='_blank' href='https://www.render-resume.com' style={emailStyles.ctaButton}>
            🔍 探索更多功能
          </Link>
        </Section>

        <Section style={emailStyles.infoBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.primary, marginBottom: '10px', margin: '0 0 10px 0' }}>
            💡 小撇步
          </Heading>
          <Text style={{ margin: 0, color: BRAND_COLORS.text }}>
            在等待期間，您可以：<br />
            • 關注我們的<Link target='_blank' href='https://www.threads.com/@newbie.founder' style={emailStyles.link}>部落格</Link>獲取履歷撰寫技巧<br />
            • 瀏覽<Link target='_blank' href='https://www.render-resume.com/faq' style={emailStyles.link}>常見問題</Link>了解更多功能細節<br />
            • 準備您想要分析的履歷文件（支援 PDF 格式）
          </Text>
        </Section>
      </Section>
      
      <Section style={emailStyles.footer}>
        <Text style={emailStyles.footerText}>
          <strong>📧 聯絡資訊：</strong>
        </Text>
        <Text style={emailStyles.footerText}>
          • 電子郵件：{userEmail}<br />
          • 加入時間：{new Date().toLocaleDateString('zh-TW')}
        </Text>
        <Text style={{ ...emailStyles.footerText, marginTop: '20px' }}>
          有任何問題嗎？回覆此電子郵件或造訪我們的{' '}
          <Link target='_blank' href='https://www.render-resume.com/help' style={emailStyles.link}>
            支援中心
          </Link>。我們很樂意為您提供協助！
        </Text>
        <Text style={{ ...emailStyles.footerText, marginTop: '15px', fontStyle: 'italic' }}>
          感謝您對 Render Resume 的信任與支持！🙏
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
}; 