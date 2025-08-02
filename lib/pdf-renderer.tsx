import { getTemplateById, ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cnPdf } from '@/lib/utils';
import React from 'react';

// 動態導入 renderToStaticMarkup 以避免客戶端錯誤
let renderToStaticMarkup: ((element: React.ReactElement) => string) | null = null;

if (typeof window === 'undefined') {
  // 只在伺服器端導入
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactDOMServer = require('react-dom/server');
  renderToStaticMarkup = ReactDOMServer.renderToStaticMarkup;
}

// PDF 專用的 ResumeSection 包裝器（移除互動功能）
function PdfResumeSection({ 
  title, 
  icon: Icon, 
  className, 
  titleClassName, 
  iconClassName, 
  children, 
  showIcon = true 
}: { 
  title: string;
  icon?: React.ElementType;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  children: React.ReactNode;
  showIcon?: boolean;
}) {
  return (
    <section className={cnPdf('resume-section', className)}>
      <h3 className={cnPdf('resume-section-title', titleClassName)}>
        {Icon && showIcon && <Icon className={cnPdf('resume-section-icon mr-2', iconClassName)} />}
        {title}
      </h3>
      <div className="resume-section-content">
        {children}
      </div>
    </section>
  );
}

// PDF 專用的 ResumeHeader 組件（完全匹配預覽組件）
function PdfResumeHeader({ personalInfo, template }: { personalInfo: OptimizedResume['personalInfo'], template: ResumeTemplate }) {
  const { font, colors, styles } = template;

  if (template.id === 'latex') {
    return (
      <header className={cnPdf(styles.header)}>
        <h1 className={cnPdf(font.sizes.title, colors.text)}>
          {personalInfo.fullName}
        </h1>
        <div className={cnPdf(font.sizes.subtitle, colors.secondary, 'flex justify-center items-center space-x-2')}>
          <span>{personalInfo.email}</span>
          <span>{'//'}</span>
          <span>{personalInfo.phone}</span>
          {personalInfo.linkedin && (
            <>
              <span>{'//'}</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>
    );
  }



  // Standard template - 完全匹配預覽組件
  return (
    <header className={cnPdf(styles.header)}>
              <h1 className={cnPdf(font.sizes.title, colors.text, 'mb-2')}>
          {personalInfo.fullName}
        </h1>

      
      <div className={cnPdf('flex flex-wrap gap-4', font.sizes.body, colors.secondary)}>
        {personalInfo.email && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3v18h24V3H0zm21.518 2L12 12.713 2.482 5h19.036zM2 19V7.183l10 8.104 10-8.104V19H2z"/>
            </svg>
            {personalInfo.email}
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.5-6.5l2.2-2.2c.2-.3.3-.7.2-1-.3-1.2-.5-2.4-.5-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2a9 9 0 0 0-9-9v2c3.9 0 7 3.1 7 7zm-4 0h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/>
            </svg>
            {personalInfo.phone}
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {personalInfo.location}
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            {personalInfo.website}
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
            </svg>
            {personalInfo.linkedin}
          </div>
        )}
        {personalInfo.github && (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.30.653 1.653.242 2.873.119 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {personalInfo.github}
          </div>
        )}
      </div>
    </header>
  );
}

// PDF 專用的 Summary Section（完全匹配預覽組件）
function PdfSummarySection({ data, template }: { data: string, template: ResumeTemplate }) {
  const { font, colors, styles } = template;

  if (!data) return null;

  return (
    <PdfResumeSection
      title="SUMMARY"
      className={template.spacing.section}
      titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
      showIcon={styles.showSectionIcons}
    >
      <p className={cnPdf(font.sizes.body, colors.secondary, 'leading-relaxed')}>{data}</p>
    </PdfResumeSection>
  );
}

// PDF 專用的 Experience Section（完全匹配預覽組件）
function PdfExperienceSection({ data, template }: { data: OptimizedResume['experience'], template: ResumeTemplate }) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <PdfResumeSection
        title="Experience"
        className={spacing.section}
        titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
        showIcon={styles.showSectionIcons}
      >
        <div className="space-y-4">
          {data.map((job, index) => (
            <div key={index}>
              <div className="mb-1">
                <span className={cnPdf(font.sizes.body, colors.text, 'font-bold')}>{job.title}</span>
                <span className={cnPdf(font.sizes.body, colors.secondary)}> | {job.company} | {job.period}</span>
              </div>
              <ul className="space-y-1">
                {job.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={cnPdf(font.sizes.body, colors.secondary, 'list-disc list-inside')}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PdfResumeSection>
    );
  }

  // Standard template - 完全匹配預覽組件
  return (
    <PdfResumeSection
      title="EXPERIENCE"
      className={spacing.section}
      titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
      showIcon={styles.showSectionIcons}
    >
      <div className="space-y-6">
        {data.map((job, index) => (
          <div key={index}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={cnPdf(font.sizes.body, colors.text, 'font-semibold')}>{job.title}</h3>
                <p className={cnPdf(font.sizes.body, colors.primary, 'font-medium')}>{job.company}</p>
              </div>
              <span className={cnPdf(font.sizes.caption, colors.secondary)}>{job.period}</span>
            </div>
            <ul className="space-y-1">
              {job.achievements.map((achievement, achIndex) => (
                <li key={achIndex} className={cnPdf(font.sizes.body, colors.secondary, 'flex items-start')}>
                  <span className={cnPdf(colors.primary, 'mr-2 mt-1')}>•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PdfResumeSection>
  );
}

// PDF 專用的 Skills Section（完全匹配預覽組件）
function PdfSkillsSection({ data, template }: { data: OptimizedResume['skills'], template: ResumeTemplate }) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  return (
    <PdfResumeSection
      title="SKILLS"
      className={spacing.section}
      titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
      showIcon={styles.showSectionIcons}
    >
      <div className="space-y-1">
        {data.map((skillGroup, index) => (
          <div key={index}>
            <p className={cnPdf(font.sizes.body, colors.text)}>
              <span className={cnPdf(font.sizes.body, colors.text, 'font-bold')}>{skillGroup.category}:</span>{' '}
              {skillGroup.items.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </PdfResumeSection>
  );
}

// PDF 專用的 Projects Section（完全匹配預覽組件）
function PdfProjectsSection({ data, template }: { data: OptimizedResume['projects'], template: ResumeTemplate }) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <PdfResumeSection
        title="Projects"
        className={spacing.section}
        titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
        showIcon={styles.showSectionIcons}
      >
        <div className="space-y-4">
          {data.map((project, index) => (
            <div key={index}>
              <div className="mb-1">
                <span className={cnPdf(font.sizes.body, colors.text, 'font-bold')}>{project.name}</span>
              </div>
              {project.achievements && project.achievements.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {project.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className={cnPdf(font.sizes.body, colors.secondary, 'list-disc list-inside')}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </PdfResumeSection>
    );
  }

  // Standard template - 完全匹配預覽組件
  return (
    <PdfResumeSection
      title="PROJECTS"
      className={spacing.section}
      titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
      showIcon={styles.showSectionIcons}
    >
      <div className="space-y-6">
        {data.map((project, index) => (
          <div key={index} className="border-l-2 border-cyan-200 pl-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className={cnPdf(font.sizes.body, colors.text, 'font-semibold')}>{project.name}</h3>
            </div>
            {project.achievements && project.achievements.length > 0 && (
              <ul className="space-y-1">
                {project.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={cnPdf(font.sizes.body, colors.secondary, 'flex items-start')}>
                    <span className={cnPdf(colors.primary, 'mr-2 mt-1')}>•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </PdfResumeSection>
  );
}

// PDF 專用的 Education Section（完全匹配預覽組件） 
function PdfEducationSection({ data, template }: { data: OptimizedResume['education'], template: ResumeTemplate }) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <PdfResumeSection
        title="Education"
        className={spacing.section}
        titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
        showIcon={styles.showSectionIcons}
      >
        <div className="space-y-4">
          {data.map((edu, index) => (
            <div key={index}>
              <div className="mb-1">
                <span className={cnPdf(font.sizes.body, colors.text, 'font-bold')}>{edu.degree}{edu.major && `, ${edu.major}`}</span>
                <span className={cnPdf(font.sizes.body, colors.secondary)}> | {edu.school} | {edu.period}</span>
              </div>
              {edu.details && edu.details.length > 0 && (
                <ul className="space-y-1">
                  {edu.details.map((detail, detIndex) => (
                    <li key={detIndex} className={cnPdf(font.sizes.body, colors.secondary, 'list-disc list-inside')}>
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </PdfResumeSection>
    );
  }

  // Standard template - 完全匹配預覽組件
  return (
    <PdfResumeSection
      title="EDUCATION"
      className={spacing.section}
      titleClassName={cnPdf(font.sizes.heading, colors.text, styles.sectionTitle)}
      showIcon={styles.showSectionIcons}
    >
      <div className="space-y-6">
        {data.map((edu, index) => (
          <div key={index}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={cnPdf(font.sizes.body, colors.text, 'font-semibold')}>{edu.degree}{edu.major && `, ${edu.major}`}</h3>
                <p className={cnPdf(font.sizes.body, colors.primary, 'font-medium')}>{edu.school}</p>
              </div>
              <span className={cnPdf(font.sizes.caption, colors.secondary)}>{edu.period}</span>
            </div>
            {edu.details && edu.details.length > 0 && (
              <ul className="space-y-1">
                {edu.details.map((detail, detIndex) => (
                  <li key={detIndex} className={cnPdf(font.sizes.body, colors.secondary, 'flex items-start')}>
                    <span className={cnPdf(colors.primary, 'mr-2 mt-1')}>•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </PdfResumeSection>
  );
}

// PDF 專用的 Resume Preview 組件（完全匹配預覽組件）
function PdfResumePreview({ resumeData, template }: { resumeData: OptimizedResume, template: ResumeTemplate }) {
  const { font, colors } = template;

  return (
    <div className={cnPdf(`px-16 py-12 min-h-[1000px] h-fit ${font.family} ${colors.background}`)} id="resume-content">
      <PdfResumeHeader personalInfo={resumeData.personalInfo} template={template} />

      {template.layout.sections.map(sectionName => {
        switch (sectionName) {
          case 'summary':
            return resumeData.summary ? (
              <PdfSummarySection key={sectionName} data={resumeData.summary} template={template} />
            ) : null;
          case 'experience':
            return <PdfExperienceSection key={sectionName} data={resumeData.experience} template={template} />;
          case 'skills':
            return <PdfSkillsSection key={sectionName} data={resumeData.skills} template={template} />;
          case 'projects':
            return <PdfProjectsSection key={sectionName} data={resumeData.projects} template={template} />;
          case 'education':
            return <PdfEducationSection key={sectionName} data={resumeData.education} template={template} />;
          default:
            return null;
        }
      })}
      
      <footer className={cnPdf('flex w-full items-center justify-center gap-1 mt-12 text-xs text-gray-400 text-center select-none print:mt-8')}>
        <p>made with</p>
        <p className={cnPdf(`font-semibold ${colors.primary}`)}>RenderResume</p>
      </footer>
      <div className={cnPdf('text-xs text-gray-400 w-full text-center')}>
        www.render-resume.com
      </div>
    </div>
  );
}

// 生成 PDF 用的完整 HTML
export function generatePdfHtml(resumeData: OptimizedResume, templateId: string = 'standard'): string {
  const template = getTemplateById(templateId);
  
  // 檢查是否在伺服器端環境
  if (typeof window !== 'undefined') {
    throw new Error('generatePdfHtml 只能在伺服器端使用');
  }
  
  if (!renderToStaticMarkup) {
    throw new Error('renderToStaticMarkup 未初始化');
  }
  
  // 將 React 組件渲染為 HTML 字串
  const resumeHtml = renderToStaticMarkup(
    <PdfResumePreview resumeData={resumeData} template={template} />
  );

  // 生成完整的 HTML 文檔，包含必要的 CSS
  const fullHtml = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume PDF</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* PDF 專用樣式 - 完全匹配預覽頁面 */
    body {
      margin: 0;
      padding: 0;
      background: white;
      font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    
    /* A4 頁面尺寸 */
    .pdf-container {
      width: 100%;
      height: auto;
      margin: 0;
      background: white;
      box-sizing: border-box;
    }
    
    /* 隱藏不需要的元素 */
    button, [role="button"] {
      display: none !important;
    }
    
    /* 確保列印樣式 */
    @media print {
      .pdf-container {
        width: 100%;
        height: auto;
        margin: 0;
        box-shadow: none;
      }
    }
    
    /* 字體載入 */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;500;600;700&display=swap');
    
    /* 確保中文字體正確顯示 */
    .font-inter { font-family: 'Inter', 'Noto Sans TC', sans-serif; }
    .font-noto-tc { font-family: 'Noto Sans TC', sans-serif; }
    .font-serif { font-family: 'Times New Roman', Times, serif !important; }
    
    /* 強制 serif 字體顯示 - 完全匹配預覽 */
    .font-serif,
    .font-serif * {
      font-family: 'Times New Roman', Times, serif !important;
    }
    
    /* 移除可能的互動元素樣式 */
    .hover\\:bg-gray-50:hover { background-color: transparent !important; }
    .cursor-pointer { cursor: default !important; }
    
    /* 確保內容適合 A4 - 完全匹配預覽 */
    .px-16 { padding-left: 15mm; padding-right: 15mm; }
    .py-12 { padding-top: 15mm; padding-bottom: 15mm; }
    
    /* 頁面分割處理 */
    .page-break-inside-avoid {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    
    /* 確保顏色正確顯示 */
    .text-gray-900 { color: rgb(17 24 39) !important; }
    .text-gray-600 { color: rgb(75 85 99) !important; }
    .text-gray-500 { color: rgb(107 114 128) !important; }
    .text-gray-400 { color: rgb(156 163 175) !important; }
    .text-cyan-600 { color: rgb(8 145 178) !important; }
    .text-blue-600 { color: rgb(37 99 235) !important; }
    .text-emerald-600 { color: rgb(5 150 105) !important; }
    .text-purple-600 { color: rgb(147 51 234) !important; }
    .text-orange-600 { color: rgb(234 88 12) !important; }
    .bg-cyan-600 { background-color: rgb(8 145 178) !important; }
    .bg-blue-600 { background-color: rgb(37 99 235) !important; }
    .bg-emerald-600 { background-color: rgb(5 150 105) !important; }
    .bg-purple-600 { background-color: rgb(147 51 234) !important; }
    .bg-orange-600 { background-color: rgb(234 88 12) !important; }
    
    /* 確保字體大小和行高 - 完全匹配預覽 */
    .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
    .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
    .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
    .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .text-xs { font-size: 0.75rem; line-height: 1rem; }
    
    /* 字體粗細 */
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    
    /* 文字對齊 */
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    
    /* 文字變換 */
    .uppercase { text-transform: uppercase; }
    .lowercase { text-transform: lowercase; }
    .capitalize { text-transform: capitalize; }
    
    /* 字符間距 */
    .tracking-wide { letter-spacing: 0.025em; }
    .tracking-widest { letter-spacing: 0.1em; }
    
    /* 間距 - 完全匹配預覽 */
    .mb-8 { margin-bottom: 2rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-1\\.5 { margin-bottom: 0.375rem; }
    .mt-12 { margin-top: 3rem; }
    .mt-1 { margin-top: 0.25rem; }
    .ml-4 { margin-left: 1rem; }
    .ml-2 { margin-left: 0.5rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mr-1 { margin-right: 0.25rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-2 > * + * { margin-top: 0.5rem; }
    .space-y-1 > * + * { margin-top: 0.25rem; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .gap-4 { gap: 1rem; }
    .gap-2 { gap: 0.5rem; }
    .gap-1 { gap: 0.25rem; }
    
    /* Flexbox */
    .flex { display: flex; }
    .flex-wrap { flex-wrap: wrap; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .items-start { align-items: flex-start; }
    .items-center { align-items: center; }
    .flex-1 { flex: 1 1 0%; }
    .flex-shrink-0 { flex-shrink: 0; }
    
    /* 內邊距 */
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
    .pb-1 { padding-bottom: 0.25rem; }
    .pl-4 { padding-left: 1rem; }
    
    /* 圓角 */
    .rounded-full { border-radius: 9999px; }
    
    /* 列表 */
    .list-disc { list-style-type: disc; }
    .list-inside { list-style-position: inside; }
    
    /* 行高 */
    .leading-relaxed { line-height: 1.625; }
    
    /* 邊框 */
    .border-b { border-bottom: 1px solid; }
    .border-black { border-color: black; }
    .border-l-2 { border-left: 2px solid; }
    .border-cyan-200 { border-color: rgb(165 243 252); }
    
    /* 履歷專用樣式 - 完全匹配預覽 */
    .resume-section-title { 
      border-bottom: 1px solid black; 
      padding-bottom: 0.25rem; 
      margin-bottom: 1rem; 
    }
    
    /* 網格和佈局 */
    .grid { display: grid; }
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    
    /* 背景色 */
    .bg-white { background-color: white; }
    .bg-cyan-100 { background-color: rgb(207 250 254); }
    
    /* 寬度和定位 */
    .w-fit { width: fit-content; }
    .w-4 { width: 1rem; }
    .h-4 { height: 1rem; }
    
    /* 確保履歷內容使用正確的字體 */
    #resume-content.font-serif,
    #resume-content.font-serif * {
      font-family: 'Times New Roman', Times, serif !important;
    }
    
    /* 強制覆蓋任何其他字體設定 */
    .font-serif * {
      font-family: inherit !important;
    }
  </style>
</head>
<body>
  <div class="pdf-container">
    ${resumeHtml}
  </div>
</body>
</html>`;

  return fullHtml;
}