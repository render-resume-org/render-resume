import { Heading, Link, Section, Text } from '@react-email/components';
import * as React from 'react';
import BaseEmailTemplate, { BRAND_COLORS, emailStyles } from './BaseEmailTemplate';

interface BetaReleaseEmailTemplateProps {
  userName?: string;
  userEmail: string;
  redeemCode: string;
}

export const BetaReleaseEmailTemplate: React.FC<BetaReleaseEmailTemplateProps> = ({
  userName: _userName = '您', // eslint-disable-line @typescript-eslint/no-unused-vars
  userEmail: _userEmail, // eslint-disable-line @typescript-eslint/no-unused-vars
  redeemCode,
}) => {
  return (
    <BaseEmailTemplate
      preview="🎉 RenderResume Beta 版正式推出！專屬 Waitlist 回饋等你領取"
    >
      <Section style={emailStyles.header}>
        <Text style={emailStyles.logo}>RenderResume</Text>
        <Heading style={emailStyles.headerTitle}>Beta 版正式推出！</Heading>
        <Text style={emailStyles.headerSubtitle}>
          AI 履歷編輯器正式上線，專屬 Waitlist 回饋等你領取！
        </Text>
      </Section>
      
      <Section style={emailStyles.content}>
        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '0 0 20px 0' }}>
          親愛的 RenderResume 使用者，
        </Text>

        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '0 0 20px 0', lineHeight: '1.7' }}>
          在求職的過程中，你是否曾為撰寫履歷所苦，明明有能力卻不知道該如何適當地包裝自己？
        </Text>

        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '0 0 20px 0', lineHeight: '1.7' }}>
          我們也是深受撰寫履歷所苦的求職者，為了幫助求職者解決撰寫履歷的困難，我們打造了「AI 履歷編輯器」的服務，讓創建履歷的過程變的非常簡單輕鬆！
        </Text>

        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '0 0 20px 0', lineHeight: '1.7' }}>
          我們很高興宣布 RenderResume Beta 版正式推出！RenderResume 能根據你提供的履歷資料幫你快速建立、分析以及優化履歷。
        </Text>

        <Section style={emailStyles.infoBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.primary, marginBottom: '15px', margin: '0 0 15px 0' }}>
            🤖 AI 履歷分析
          </Heading>
          <Text style={{ fontSize: '16px', margin: '0 0 20px 0', color: BRAND_COLORS.text, lineHeight: '1.7' }}>
            透過最先進的 AI 技術對你提供的履歷資料進行專業分析，清楚呈現履歷的競爭力與優化方向。
          </Text>
        </Section>
        
        <Section style={emailStyles.infoBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.primary, marginBottom: '15px', margin: '15px 0 15px 0' }}>
            ✏️ AI 履歷編輯器
          </Heading>
          <Text style={{ fontSize: '16px', margin: 0, color: BRAND_COLORS.text, lineHeight: '1.7' }}>
            你可以在編輯履歷的同時和 AI 顧問進行對話，AI 顧問會針對履歷的即時內容提供具體的優化指引，甚至直接幫你在編輯器即時修改履歷。
          </Text>
        </Section>

        <Section style={emailStyles.warningBox}>
          <Heading as="h3" style={{ color: BRAND_COLORS.warning, marginBottom: '15px', margin: '0 0 15px 0' }}>
            🎁 專屬 Waitlist 回饋
          </Heading>
          <Text style={{ fontSize: '16px', margin: '0 0 15px 0', color: BRAND_COLORS.text, lineHeight: '1.7' }}>
            非常感謝您加入 waitlist，我們將提供給您專屬的 waitlist 回饋：<strong>一個月的免費 pro 訂閱權限！</strong>
          </Text>
          <Text style={{ fontSize: '16px', margin: '0 0 15px 0', color: BRAND_COLORS.text }}>
            請至 RenderResume 的帳戶設定輸入以下兌換碼進行兌換：<strong>{redeemCode}</strong>
          </Text>
        </Section>

        <Section style={{ textAlign: 'center', margin: '40px 0' }}>
          <Link target='_blank' href='https://www.render-resume.com' style={emailStyles.ctaButton}>
            🚀 立即體驗 AI 履歷編輯器！
          </Link>
        </Section>

        <Text style={{ fontSize: '16px', marginBottom: '20px', margin: '20px 0', textAlign: 'center', fontWeight: '600' }}>
          非常感謝你對 <strong>Render Resume</strong> 的支持！
        </Text>
        <Text style={{ fontSize: '16px', marginTop: '15px', fontStyle: 'italic', textAlign: 'right', color: BRAND_COLORS.text }}>
          RenderResume 團隊 敬上
        </Text>
      </Section>
    </BaseEmailTemplate>
  );
};
