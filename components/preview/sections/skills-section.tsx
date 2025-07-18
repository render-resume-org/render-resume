import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';
import ResumeSection from '../resume-section';

interface SkillsSectionProps {
  data: OptimizedResume['skills'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function SkillsSection({ data, template, onEdit }: SkillsSectionProps) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <ResumeSection
        title="Skills"
        icon={Code}
        className={spacing.section}
        titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
        iconClassName={cn(colors.primary, 'w-5 h-5')}
        showIcon={styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-1">
          {data.map((skillGroup, index) => (
            <div key={index} className="flex items-start">
              <p className={cn(font.sizes.body, colors.text, 'w-fit font-bold flex-shrink-0')}>{skillGroup.category}:</p>
              <p className={cn(font.sizes.body, colors.secondary)}>{skillGroup.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </ResumeSection>
    );
  }

  // Default template
  return (
    <ResumeSection
      title="Skills"
      icon={Code}
      className={spacing.section}
      titleClassName={cn(font.sizes.heading, colors.text, styles.sectionTitle)}
      iconClassName={cn(colors.primary, 'w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((skillGroup, index) => (
          <div key={index}>
            <h4 className={cn(font.sizes.body, colors.text, 'font-medium mb-2')}>{skillGroup.category}</h4>
            <div className="flex flex-wrap gap-2">
              {skillGroup.items.map((skill, skillIndex) => (
                <span key={skillIndex} className={cn(font.sizes.caption, 'px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 rounded')}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 