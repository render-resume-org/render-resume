import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import ResumeSection from '../resume-section';

interface ProjectsSectionProps {
  data: OptimizedResume['projects'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function ProjectsSection({ data, template, onEdit }: ProjectsSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');

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
                  {project.name}
                </h4>
                {project.period && (
                  <span className={styles.period}>
                    {project.period}
                  </span>
                )}
              </div>
              {project.achievements && project.achievements.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'mt-1 list-disc list-inside')}>
                  {project.achievements.map((achievement, achievementIndex) => (
                    <li key={achievementIndex}>{achievement}</li>
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
                <h3 className={styles.projectName}>{project.name}</h3>
                {project.period && (
                  <span className={styles.period}>{project.period}</span>
                )}
              </div>
            </div>
            {project.achievements && project.achievements.length > 0 && (
              <ul className={styles.achievementList}>
                {project.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={styles.achievement}>
                    {achievement}
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