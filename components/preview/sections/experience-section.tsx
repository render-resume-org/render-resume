import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
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
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getExperienceStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');

  if (isLatex) {
    return (
      <ResumeSection
        title="Experience"
        icon={Briefcase}
        className={styles.container}
        titleClassName={styles.title}
        iconClassName={styles.icon}
        showIcon={template.styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className={styles.jobList}>
          {data.map((job, index) => (
            <div key={index}>
              <div className={styles.jobContainer}>
                <span className={styles.jobTitle}>{job.title}</span>
                <span>
                  <span> | </span>
                  <span className={styles.company}>{job.company}</span>
                  <span> | {job.period}</span>
                </span>
              </div>
              <ul className={styles.achievementList}>
                {job.achievements.map((achievement, achIndex) => (
                  <li key={achIndex} className={styles.achievement}>
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

  // Standard template
  return (
    <ResumeSection
      title="EXPERIENCE"
      icon={Briefcase}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className={styles.jobList}>
        {data.map((job, index) => (
          <div key={index}>
            <div className={styles.jobContainer}>
              <div className="flex justify-between items-center">
                <h3 className={styles.company}>{job.company}</h3>
                <span className={styles.period}>{job.period}</span>
              </div>
              <p className={cn(styles.jobTitle, 'italic')}>{job.title}</p>
            </div>
            <ul className={styles.achievementList}>
              {job.achievements.map((achievement, achIndex) => (
                <li key={achIndex} className={styles.achievement}>
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