import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import ResumeSection from '../resume-section';

interface EducationSectionProps {
  data: OptimizedResume['education'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function EducationSection({ data, template, onEdit }: EducationSectionProps) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <ResumeSection
        title="Education"
        icon={GraduationCap}
        className={spacing.section}
        titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
        iconClassName={cn(colors.primary, 'w-5 h-5')}
        showIcon={styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-2">
          {data.map((edu, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <span className={cn(font.sizes.body, colors.text, 'font-bold')}>
                  {edu.school} | {edu.degree}
                </span>
                <span className={cn(font.sizes.body, colors.secondary)}>{edu.period}</span>
              </div>
              {edu.details && edu.details.length > 0 && (
                <p className={cn(font.sizes.body, colors.secondary)}>{edu.details.join(', ')}</p>
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
      title="Education"
      icon={GraduationCap}
      className={spacing.section}
      titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
      iconClassName={cn(colors.primary, 'w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="space-y-4">
        {data.map((edu, index) => (
          <div key={index} className="border-l-2 border-cyan-200 dark:border-cyan-800 pl-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <h3 className={cn(font.sizes.body, colors.text, 'font-semibold')}>{edu.degree}</h3>
                <p className={cn(font.sizes.body, colors.primary, 'font-medium')}>{edu.school}</p>
              </div>
              <span className={cn(font.sizes.caption, colors.secondary)}>{edu.period}</span>
            </div>
            {edu.details && edu.details.length > 0 && (
              <p className={cn(font.sizes.caption, colors.secondary)}>{edu.details.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 