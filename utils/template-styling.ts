import { ResumeTemplate } from '@/features/resume/lib/resume-templates';
import { cn } from '@/utils';

/**
 * 模板樣式服務 - 統一管理模板相關的樣式邏輯
 */
export class TemplateStylingService {
  /**
   * 獲取區段標題樣式
   */
  static getSectionTitleStyle(template: ResumeTemplate): string {
    return cn(
      template.font.sizes.heading,
      template.colors.primary,
      template.styles.sectionTitle
    );
  }

  /**
   * 獲取區段容器樣式
   */
  static getSectionContainerStyle(template: ResumeTemplate): string {
    return cn(template.spacing.section);
  }

  /**
   * 獲取區段圖示樣式
   */
  static getSectionIconStyle(template: ResumeTemplate): string {
    return cn(template.colors.primary, 'w-5 h-5');
  }

  /**
   * 獲取正文樣式
   */
  static getBodyTextStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.body, template.colors.text);
  }

  /**
   * 獲取標題樣式
   */
  static getTitleStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.title, template.colors.primary);
  }

  /**
   * 獲取副標題樣式
   */
  static getSubtitleStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.subtitle, template.colors.secondary);
  }

  /**
   * 獲取說明文字樣式
   */
  static getCaptionStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.caption, template.colors.secondary);
  }

  /**
   * 獲取公司名稱樣式
   */
  static getCompanyStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.company, template.colors.primary);
  }

  /**
   * 獲取專案名稱樣式
   */
  static getProjectNameStyle(template: ResumeTemplate): string {
    return cn(template.font.sizes.projectName, template.colors.primary);
  }

  /**
   * 根據模板ID獲取特定樣式
   */
  static getTemplateSpecificStyle(template: ResumeTemplate, element: 'job-title' | 'company' | 'period' | 'achievement'): string {
    const baseStyle = this.getBodyTextStyle(template);

    switch (element) {
      case 'job-title':
        return cn(baseStyle, 'font-bold', 'text-sm');
      
      case 'company':
        return this.getCompanyStyle(template);
      
      case 'period':
        return cn(this.getCaptionStyle(template));
      
      case 'achievement':
        return cn(baseStyle, 'list-disc list-outside ml-4');
      
      default:
        return baseStyle;
    }
  }

  /**
   * 獲取工作經驗樣式
   */
  static getExperienceStyle(template: ResumeTemplate) {
    return {
      container: cn(template.spacing.section),
      title: this.getSectionTitleStyle(template),
      icon: this.getSectionIconStyle(template),
      jobContainer: cn('mb-2'),
      jobTitle: this.getTemplateSpecificStyle(template, 'job-title'),
      company: this.getCompanyStyle(template),
      period: this.getTemplateSpecificStyle(template, 'period'),
      achievement: this.getTemplateSpecificStyle(template, 'achievement'),
      achievementList: cn('space-y-1'),
      jobList: cn('space-y-2'),
    };
  }

  /**
   * 獲取專案樣式
   */
  static getProjectStyle(template: ResumeTemplate) {
    return {
      container: cn(template.spacing.section),
      title: this.getSectionTitleStyle(template),
      icon: this.getSectionIconStyle(template),
      projectContainer: cn(template.spacing.item),
      projectName: this.getProjectNameStyle(template),
      period: this.getCaptionStyle(template),
      techContainer: cn('flex flex-wrap gap-2 mb-2'),
      techBadge: cn('px-2 py-1 bg-cyan-100 text-cyan-600 rounded-full text-xs'),
      achievement: this.getTemplateSpecificStyle(template, 'achievement'),
      achievementList: cn('space-y-1'),
      projectList: cn('space-y-4'),
    };
  }

  /**
   * 獲取技能樣式
   */
  static getSkillStyle(template: ResumeTemplate) {
    return {
      container: cn(template.spacing.section),
      title: this.getSectionTitleStyle(template),
      icon: this.getSectionIconStyle(template),
      categoryContainer: cn(template.spacing.item),
      categoryName: cn(this.getBodyTextStyle(template), 'font-bold mb-1'),
      skillContainer: cn('flex flex-wrap gap-2'),
      skillBadge: cn('px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-sm'),
      skillList: cn('space-y-1'),
    };
  }

  /**
   * 獲取教育樣式
   */
  static getEducationStyle(template: ResumeTemplate) {
    return {
      container: cn(template.spacing.section),
      title: this.getSectionTitleStyle(template),
      icon: this.getSectionIconStyle(template),
      educationContainer: cn(template.spacing.item),
      degree: cn(this.getBodyTextStyle(template), 'font-bold'),
      school: cn(this.getBodyTextStyle(template), 'font-semibold'),
      period: this.getCaptionStyle(template),
      detail: cn(this.getBodyTextStyle(template), 'list-disc list-outside ml-4'),
      detailList: cn('space-y-1'),
      educationList: cn('space-y-4'),
    };
  }

  /**
   * 獲取摘要樣式
   */
  static getSummaryStyle(template: ResumeTemplate) {
    return {
      container: cn(template.spacing.section),
      title: this.getSectionTitleStyle(template),
      icon: this.getSectionIconStyle(template),
      content: cn(this.getBodyTextStyle(template), 'leading-relaxed'),
    };
  }

  /**
   * 獲取 PDF 專用樣式（移除互動效果）
   */
  static getPdfSafeStyle(normalStyle: string): string {
    return normalStyle
      .replace(/hover:[^\s]+/g, '')
      .replace(/cursor-pointer/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 根據模板類型應用字體系列
   */
  static applyFontFamily(template: ResumeTemplate, className: string): string {
    // 如果已經包含字體家族，則不重複添加
    if (className.includes('font-')) {
      return className;
    }
    return cn(template.font.family, className);
  }

  /**
   * 檢查是否為特定模板
   */
  static isTemplateType(template: ResumeTemplate, type: 'latex' | 'standard' | 'modern'): boolean {
    return template.id === type;
  }

  /**
   * 獲取適應模板的佈局樣式
   */
  static getResponsiveLayout(template: ResumeTemplate) {
    return {
      headerSpacing: cn(template.styles.header),
      sectionSpacing: cn(template.spacing.section),
      itemSpacing: cn(template.spacing.item),
      lineSpacing: cn(template.spacing.line),
      compactSpacing: false,
    };
  }
} 