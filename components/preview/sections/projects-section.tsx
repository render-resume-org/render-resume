import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import ResumeSection from '../resume-section';

interface ProjectsSectionProps {
  data: OptimizedResume['projects'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
}

export default function ProjectsSection({ data, template, onEdit, analysisResult }: ProjectsSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');
  const annotations = buildAnnotationsFromAnalysis(analysisResult);

  if (isLatex) {
    return (
      <ResumeSection
        title="Projects"
        icon={FolderOpen}
        className={styles.container}
        titleClassName={styles.title}
        iconClassName={styles.icon}
        showIcon={template.styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-3">
          {data.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                 <h4 className={styles.projectName}>
                   {highlightText(project.name, annotations)}
                 </h4>
                 {project.period && (
                   <span className={styles.period}>
                     {highlightText(project.period, annotations)}
                   </span>
                 )}
              </div>
              {project.achievements && project.achievements.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'mt-1 list-disc list-inside')}>
                   {project.achievements.map((achievement, achievementIndex) => (
                     <li key={achievementIndex}>{highlightText(achievement, annotations)}</li>
                   ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </ResumeSection>
    );
  }

  // Standard template
  return (
    <ResumeSection
      title="PROJECTS"
      icon={FolderOpen}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className={styles.projectList}>
        {data.map((project, index) => (
          <div key={index} className={styles.projectContainer}>
            <div className="mb-1">
              <div className="flex justify-between items-center">
                 <h3 className={styles.projectName}>{highlightText(project.name, annotations)}</h3>
                 {project.period && (
                   <span className={styles.period}>{highlightText(project.period, annotations)}</span>
                 )}
              </div>
            </div>
               {project.achievements && project.achievements.length > 0 && (
               <ul className={styles.achievementList}>
                 {project.achievements.map((achievement, achIndex) => (
                   <li key={achIndex} className={styles.achievement}>
                     {highlightText(achievement, annotations)}
                   </li>
                 ))}
               </ul>
             )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 