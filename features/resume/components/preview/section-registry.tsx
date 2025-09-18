import { ResumeTemplate } from '@/lib/config/resume-templates';
import type { InlineChangeHandler } from '@/types/inline-edit';
import { OptimizedResume } from '@/types/resume';
import { memo } from 'react';
import AchievementsSection from './sections/achievements-section';
import EducationSection from './sections/education-section';
import ExperienceSection from './sections/experience-section';
import ProjectsSection from './sections/projects-section';
import SkillsSection from './sections/skills-section';
import SummarySection from './sections/summary-section';

type SectionName = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements';

interface SectionProps<T = unknown> {
  data: T;
  template: ResumeTemplate;
  onEdit?: () => void;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

type SectionComponent = React.ComponentType<SectionProps>;

// 記憶化區段元件以提升效能
const MemoizedSummarySection = memo(SummarySection);
const MemoizedSkillsSection = memo(SkillsSection);
const MemoizedExperienceSection = memo(ExperienceSection);
const MemoizedProjectsSection = memo(ProjectsSection);
const MemoizedEducationSection = memo(EducationSection);
const MemoizedAchievementsSection = memo(AchievementsSection);

const SECTION_REGISTRY: Record<SectionName, SectionComponent> = {
  summary: MemoizedSummarySection as SectionComponent,
  experience: MemoizedExperienceSection as SectionComponent,
  projects: MemoizedProjectsSection as SectionComponent,
  achievements: MemoizedAchievementsSection as SectionComponent,
  education: MemoizedEducationSection as SectionComponent,
  skills: MemoizedSkillsSection as SectionComponent,
};

interface SectionRendererProps {
  sectionName: SectionName;
  resumeData: OptimizedResume;
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: unknown;
}

/**
 * 優化的區段渲染器
 * 使用記憶化組件和數據驗證來提升性能
 */
export function renderSection({ sectionName, resumeData, template, onEdit, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: SectionRendererProps & { inlineEditable?: boolean; onInlineChange?: InlineChangeHandler; highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined; getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined; }) {
  const SectionComponent = SECTION_REGISTRY[sectionName];
  
  if (!SectionComponent) {
    console.warn(`Section component not found for: ${sectionName}`);
    return null;
  }

  const sectionData = resumeData[sectionName as keyof OptimizedResume];
  
  if (!sectionData || 
      (Array.isArray(sectionData) && sectionData.length === 0) ||
      (typeof sectionData === 'string' && !sectionData.trim()) ||
      (typeof sectionData === 'object' && Object.keys(sectionData as object).length === 0)) {
    return null;
  }

  if (sectionName === 'experience') {
    const Experience = SECTION_REGISTRY.experience as unknown as React.ComponentType<SectionProps>;
    return (
      <Experience
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  if (sectionName === 'projects') {
    const Projects = SECTION_REGISTRY.projects as unknown as React.ComponentType<SectionProps>;
    return (
      <Projects
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  if (sectionName === 'education') {
    const Education = SECTION_REGISTRY.education as unknown as React.ComponentType<SectionProps>;
    return (
      <Education
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  if (sectionName === 'achievements') {
    const Achievements = SECTION_REGISTRY.achievements as unknown as React.ComponentType<SectionProps>;
    return (
      <Achievements
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  if (sectionName === 'skills') {
    const Skills = SECTION_REGISTRY.skills as unknown as React.ComponentType<SectionProps>;
    return (
      <Skills
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  if (sectionName === 'summary') {
    const Summary = SECTION_REGISTRY.summary as unknown as React.ComponentType<SectionProps>;
    return (
      <Summary
        data={sectionData}
        template={template}
        onEdit={onEdit}
        inlineEditable={inlineEditable}
        onInlineChange={onInlineChange}
        highlightForPath={highlightForPath}
        getPreviewValueForPath={getPreviewValueForPath}
      />
    );
  }

  return <SectionComponent data={sectionData} template={template} onEdit={onEdit} inlineEditable={inlineEditable} onInlineChange={onInlineChange} highlightForPath={highlightForPath} getPreviewValueForPath={getPreviewValueForPath} />;
}

/**
 * 動態註冊新的區段元件
 */
export function registerSection(sectionName: SectionName, component: SectionComponent) {
  SECTION_REGISTRY[sectionName] = memo(component) as SectionComponent;
}

/**
 * 獲取已註冊的區段元件
 */
export function getSectionComponent(sectionName: SectionName): SectionComponent | undefined {
  return SECTION_REGISTRY[sectionName];
}

/**
 * 檢查區段是否已註冊
 */
export function isSectionRegistered(sectionName: SectionName): boolean {
  return sectionName in SECTION_REGISTRY;
}

/**
 * 獲取所有已註冊的區段名稱
 */
export function getRegisteredSections(): SectionName[] {
  return Object.keys(SECTION_REGISTRY) as SectionName[];
}

export { SECTION_REGISTRY };
