import { ResumeTemplate } from '@/lib/config/resume-templates';
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
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <ResumeSection
        title="Projects"
        icon={FolderOpen}
        className={spacing.section}
        titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
        iconClassName={cn(colors.primary, 'w-5 h-5')}
        showIcon={styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-4">
          {data.map((project, index) => (
            <div key={index}>
              <div className="mb-1">
                <span className={cn(font.sizes.body, colors.text, 'font-bold')}>{project.name}</span>
                {project.technologies && project.technologies.length > 0 && (
                  <span className={cn(font.sizes.body, colors.secondary)}> | {project.technologies.join(', ')}</span>
                )}
              </div>
              <p className={cn(font.sizes.body, colors.secondary)}>{project.description}</p>
              {project.achievements && project.achievements.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {project.achievements.map((achievement, achIndex) => (
                    <li key={achIndex} className={cn(font.sizes.body, colors.secondary, 'list-disc list-inside')}>
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

  // Default template
  return (
    <ResumeSection
      title="Projects"
      icon={FolderOpen}
      className={spacing.section}
      titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
      iconClassName={cn(colors.primary, 'w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="space-y-6">
        {data.map((project, index) => (
          <div key={index} className="border-l-2 border-cyan-200 dark:border-cyan-800 pl-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className={cn(font.sizes.body, colors.text, 'font-semibold')}>{project.name}</h3>
              {project.technologies && project.technologies.length > 0 && (
                <span className={cn(font.sizes.caption, colors.secondary)}>{project.technologies.join(', ')}</span>
              )}
            </div>
            <p className={cn(font.sizes.body, colors.secondary, 'mb-2')}>{project.description}</p>
            {project.achievements && project.achievements.length > 0 && (
              <ul className="space-y-1">
                {project.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={cn(font.sizes.body, colors.secondary, 'flex items-start')}>
                    <span className={cn(colors.primary, 'mr-2 mt-1')}>•</span>
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