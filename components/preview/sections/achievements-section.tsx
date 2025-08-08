import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';
import ResumeSection from '../resume-section';

interface AchievementsSectionProps {
  data: OptimizedResume['achievements'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function AchievementsSection({ data, template, onEdit }: AchievementsSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);

  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');

  if (isLatex) {
    return (
      <ResumeSection
        title="Achievements"
        icon={Award}
        className={styles.container}
        titleClassName={styles.title}
        iconClassName={styles.icon}
        showIcon={template.styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-2">
          {data.map((a, i) => (
            <div key={i}>
              <div className="flex justify-between items-start">
                <h4 className={styles.projectName}>{a.title}</h4>
                {a.period && <span className={styles.period}>{a.period}</span>}
              </div>
              {a.organization && (
                <p className={cn(TemplateStylingService.getCaptionStyle(template))}>{a.organization}</p>
              )}
              {a.details && a.details.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                  {a.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </ResumeSection>
    );
  }

  return (
    <ResumeSection
      title="ACHIEVEMENTS"
      icon={Award}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="space-y-2">
        {data.map((a, i) => (
          <div key={i}>
            <div className="flex justify-between items-center">
              <h3 className={styles.projectName}>{a.title}</h3>
              {a.period && <span className={styles.period}>{a.period}</span>}
            </div>
            {a.organization && (
              <p className={cn(TemplateStylingService.getCaptionStyle(template))}>{a.organization}</p>
            )}
            {a.details && a.details.length > 0 && (
              <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                {a.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}


