import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
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
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getSkillStyle(template);

  return (
    <ResumeSection
      title="SKILLS"
      icon={Code}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className={styles.skillList}>
        {data.map((skillGroup, index) => (
          <div key={index}>
            <p className={TemplateStylingService.getBodyTextStyle(template)}>
              <span className={cn(styles.categoryName, 'font-bold')}>{skillGroup.category}:</span>{' '}
              {skillGroup.items.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 