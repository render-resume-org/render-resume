import {
    Body,
    Container,
    Font,
    Head,
    Html,
    Preview
} from '@react-email/components';
import * as React from 'react';

// Brand colors matching RenderResume system
const BRAND_COLORS = {
  primary: '#0891b2', // cyan-600
  secondary: '#0e7490', // cyan-700
  accent: '#06b6d4', // cyan-500
  success: '#059669', // emerald-600
  warning: '#d97706', // amber-600
  error: '#dc2626', // red-600
  text: '#111827', // gray-900
  textLight: '#6b7280', // gray-500
  background: '#ffffff',
  backgroundLight: '#f9fafb', // gray-50
  border: '#e5e7eb', // gray-200
  muted: '#f3f4f6', // gray-100
};

export default function BaseEmailTemplate({
  children,
  preview
}: {
  children: React.ReactNode;
  preview?: string;
}) {
  return (
    <Html lang="zh-TW">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Noto Sans TC"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {preview && <Preview>{preview}</Preview>}
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: BRAND_COLORS.backgroundLight,
  fontFamily: "'Noto Sans TC', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  lineHeight: '1.6',
  color: BRAND_COLORS.text,
  margin: '0',
  padding: '0',
};

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: BRAND_COLORS.background,
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
};

// Export styles for use in child components
export const emailStyles = {
  header: {
    background: `linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%)`,
    color: 'white',
    padding: '40px 30px',
    textAlign: 'center' as const,
  },
  
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: 'white',
  },
  
  headerSubtitle: {
    fontSize: '16px',
    opacity: '0.9',
    margin: '0',
    color: 'white',
  },
  
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  
  content: {
    padding: '40px 30px',
  },
  
  codeContainer: {
    backgroundColor: BRAND_COLORS.muted,
    border: `2px dashed ${BRAND_COLORS.border}`,
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  
  codeLabel: {
    color: BRAND_COLORS.textLight,
    fontSize: '14px',
    marginBottom: '15px',
  },
  
  verificationCode: {
    fontFamily: "'Courier New', monospace",
    fontSize: '36px',
    fontWeight: 'bold',
    color: BRAND_COLORS.primary,
    letterSpacing: '6px',
    margin: '10px 0',
  },
  
  ctaButton: {
    display: 'inline-block',
    backgroundColor: BRAND_COLORS.primary,
    color: 'white',
    padding: '16px 32px',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '16px',
    margin: '20px 0',
  },
  
  footer: {
    backgroundColor: BRAND_COLORS.backgroundLight,
    padding: '30px',
    borderTop: `1px solid ${BRAND_COLORS.border}`,
    color: BRAND_COLORS.textLight,
    fontSize: '14px',
    lineHeight: '1.6',
  },
  
  footerText: {
    margin: '0 0 8px 0',
    color: BRAND_COLORS.textLight,
  },
  
  link: {
    color: BRAND_COLORS.primary,
    textDecoration: 'none',
  },
  
  infoBox: {
    backgroundColor: '#ecfeff',
    borderLeft: `4px solid ${BRAND_COLORS.primary}`,
    padding: '20px',
    margin: '30px 0',
    borderRadius: '0 8px 8px 0',
  },
  
  warningBox: {
    backgroundColor: '#fffbeb',
    borderLeft: `4px solid ${BRAND_COLORS.warning}`,
    padding: '20px',
    margin: '30px 0',
    borderRadius: '0 8px 8px 0',
  },
  
  errorBox: {
    backgroundColor: '#fef2f2',
    borderLeft: `4px solid ${BRAND_COLORS.error}`,
    padding: '20px',
    margin: '30px 0',
    borderRadius: '0 8px 8px 0',
  },
  
  successBox: {
    backgroundColor: '#f0fdf4',
    borderLeft: `4px solid ${BRAND_COLORS.success}`,
    padding: '20px',
    margin: '30px 0',
    borderRadius: '0 8px 8px 0',
  },
};

export { BRAND_COLORS };
