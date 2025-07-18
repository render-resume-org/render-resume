import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import EducationSection from './sections/education-section';
import ExperienceSection from './sections/experience-section';
import ProjectsSection from './sections/projects-section';
import SkillsSection from './sections/skills-section';
import SummarySection from './sections/summary-section';

type SectionName = 'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'certifications';

interface SectionProps<T = unknown> {
  data: T;
  template: ResumeTemplate;
  onEdit?: () => void;
}

type SectionComponent = React.ComponentType<SectionProps>;

const SECTION_REGISTRY: Record<SectionName, SectionComponent> = {
  summary: SummarySection as SectionComponent,
  skills: SkillsSection as SectionComponent,
  experience: ExperienceSection as SectionComponent,
  projects: ProjectsSection as SectionComponent,
  education: EducationSection as SectionComponent,
  achievements: () => null, // Placeholder for future implementation
  certifications: () => null, // Placeholder for future implementation
};

interface SectionRendererProps {
  sectionName: SectionName;
  resumeData: OptimizedResume;
  template: ResumeTemplate;
  onEdit?: () => void;
}

export function renderSection({ sectionName, resumeData, template, onEdit }: SectionRendererProps) {
  const SectionComponent = SECTION_REGISTRY[sectionName];
  
  if (!SectionComponent) {
    console.warn(`Section component not found for: ${sectionName}`);
    return null;
  }

  const sectionData = resumeData[sectionName as keyof OptimizedResume];
  
  if (!sectionData) {
    return null;
  }

  return <SectionComponent data={sectionData} template={template} onEdit={onEdit} />;
}

export function registerSection(sectionName: SectionName, component: SectionComponent) {
  SECTION_REGISTRY[sectionName] = component;
}

export { SECTION_REGISTRY };
