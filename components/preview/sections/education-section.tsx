import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import ResumeSection from '../resume-section';

interface EducationSectionProps {
  data: OptimizedResume['education'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
}

export default function EducationSection({ data, template, onEdit, analysisResult }: EducationSectionProps) {
  const { font, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const annotations = buildAnnotationsFromAnalysis(analysisResult);

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return (
      <ResumeSection
        title="Education"
        icon={GraduationCap}
        className={spacing.section}
        titleClassName={cn(font.sizes.heading, 'text-black', styles.sectionTitle)}
        iconClassName={cn('text-black w-5 h-5')}
        showIcon={styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-2">
          {data.map((education, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={cn(font.sizes.body, 'text-black font-medium')}>
                    {highlightText(`${education.degree}${education.major ? `, ${education.major}` : ''}`, annotations)}
                  </h4>
                  <p className={cn(font.sizes.caption, 'text-black')}>
                    {education.school}
                  </p>
                </div>
                 <span className={cn(font.sizes.caption, 'text-black')}>
                   {highlightText(education.period, annotations)}
                 </span>
              </div>
              {education.details && education.details.length > 0 && (
                <p className={cn(font.sizes.caption, 'text-black mt-1')}>
                  {highlightText(education.details.join(', '), annotations)}
                </p>
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
      title="EDUCATION"
      icon={GraduationCap}
      className={spacing.section}
      titleClassName={cn(font.family, font.sizes.heading, 'text-black', styles.sectionTitle)}
      iconClassName={cn('text-black w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className="space-y-2">
        {data.map((education, index) => (
          <div key={index}>
            <div className="mb-1">
              <div className="flex justify-between items-center">
                <h3 className={cn(font.sizes.body, 'text-black font-bold')}>{education.school}</h3>
                 {education.period && (
                   <span className={cn(font.sizes.caption, 'text-black')}>{highlightText(education.period, annotations)}</span>
                 )}
              </div>
            </div>
            <div className="mb-1">
               <p className={cn(font.sizes.body, 'text-black italic')}>
                 {highlightText(`${education.degree}${education.major ? `, ${education.major}` : ''}${education.gpa ? `, GPA: ${education.gpa}` : ''}`, annotations)}
               </p>
            </div>
            {education.honor && (
              <p className={cn(font.sizes.body, 'text-black')}>{education.honor}</p>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 