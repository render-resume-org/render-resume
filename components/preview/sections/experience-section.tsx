import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import ResumeSection from '../resume-section';

interface ExperienceSectionProps {
  data: OptimizedResume['experience'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
}

export default function ExperienceSection({ data, template, onEdit, analysisResult }: ExperienceSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getExperienceStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');
  const annotations = buildAnnotationsFromAnalysis(analysisResult);

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
                   <span className={styles.company}>{highlightText(job.company, annotations)}</span>
                   <span> | {highlightText(job.period, annotations)}</span>
                </span>
              </div>
               <ul className={styles.achievementList}>
                 {job.achievements.map((achievement, achIndex) => (
                   <li key={achIndex} className={styles.achievement}>
                     {highlightText(achievement, annotations)}
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
                 <span className={styles.period}>{highlightText(job.period, annotations)}</span>
              </div>
               <p className={cn(styles.jobTitle, 'italic')}>{highlightText(job.title, annotations)}</p>
            </div>
             <ul className={styles.achievementList}>
               {job.achievements.map((achievement, achIndex) => (
                 <li key={achIndex} className={styles.achievement}>
                   {highlightText(achievement, annotations)}
                 </li>
               ))}
             </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 