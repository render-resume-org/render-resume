import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import ResumeSection from '../resume-section';

interface ExperienceSectionProps {
  data: OptimizedResume['experience'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function ExperienceSection({ data, template, onEdit }: ExperienceSectionProps) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <ResumeSection
        title="Experience"
        icon={Briefcase}
        className={spacing.section}
        titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
        iconClassName={cn(colors.primary, 'w-5 h-5')}
        showIcon={styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-4">
          {data.map((job, index) => (
            <div key={index}>
              <div className="mb-1">
                <span className={cn(font.sizes.body, colors.text, 'font-bold')}>{job.title}</span>
                <span className={cn(font.sizes.body, colors.secondary)}> | {job.company} | {job.period}</span>
              </div>
              <ul className="space-y-1">
                {job.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={cn(font.sizes.body, colors.secondary, 'list-disc list-inside')}>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ResumeSection>
    );
  }

  // Default template
  return (
    <ResumeSection
      title="Experience"
      icon={Briefcase}
      className={spacing.section}
      titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
      iconClassName={cn(colors.primary, 'w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="space-y-6">
        {data.map((job, index) => (
          <div key={index}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={cn(font.sizes.body, colors.text, 'font-semibold')}>{job.title}</h3>
                <p className={cn(font.sizes.body, colors.primary, 'font-medium')}>{job.company}</p>
              </div>
              <span className={cn(font.sizes.caption, colors.secondary)}>{job.period}</span>
            </div>
            <ul className="space-y-1">
              {job.achievements.map((achievement, achIndex) => (
                <li key={achIndex} className={cn(font.sizes.body, colors.secondary, 'flex items-start')}>
                  <span className={cn(colors.primary, 'mr-2 mt-1')}>•</span>
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 