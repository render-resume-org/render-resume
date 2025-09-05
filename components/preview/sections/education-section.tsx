import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface EducationSectionProps {
  data: OptimizedResume['education'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string }) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
}

export default function EducationSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath }: EducationSectionProps) {
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
                    {inlineEditable ? (
                      <InlineText
                        text={`${education.degree}${education.major ? `, ${education.major}` : ''}`}
                        inlineEditable
                        highlightType={highlightForPath?.(`education[${index}].degreeMajor`)}
                        onChange={(t) => onInlineChange?.({ path: `education[${index}].degreeMajor`, value: t })}
                      />
                    ) : (
                      highlightText(`${education.degree}${education.major ? `, ${education.major}` : ''}`, annotations)
                    )}
                  </h4>
                  <p className={cn(font.sizes.caption, 'text-black')}>
                    {inlineEditable ? (
                      <InlineText 
                        text={education.school} 
                        inlineEditable 
                        highlightType={highlightForPath?.(`education[${index}].school`)}
                        onChange={(t) => onInlineChange?.({ path: `education[${index}].school`, value: t })} 
                      />
                    ) : (
                      education.school
                    )}
                  </p>
                </div>
                 <span className={cn(font.sizes.caption, 'text-black')}>
                   {inlineEditable ? (
                     <InlineText 
                       text={education.period} 
                       inlineEditable 
                       highlightType={highlightForPath?.(`education[${index}].period`)}
                       onChange={(t) => onInlineChange?.({ path: `education[${index}].period`, value: t })} 
                     />
                   ) : (
                     highlightText(education.period, annotations)
                   )}
                 </span>
              </div>
              {education.outcomes && education.outcomes.length > 0 && (
                <p className={cn(font.sizes.caption, 'text-black mt-1')}>
                  {inlineEditable ? (
                    <InlineText 
                      text={education.outcomes.join(', ')} 
                      inlineEditable 
                      highlightType={highlightForPath?.(`education[${index}].outcomes`)}
                      onChange={(t) => onInlineChange?.({ path: `education[${index}].outcomes`, value: t })} 
                    />
                  ) : (
                    highlightText(education.outcomes.join(', '), annotations)
                  )}
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
                <h3 className={cn(font.sizes.body, 'text-black font-bold')}>
                  {inlineEditable ? (
                    <InlineText text={education.school} inlineEditable onChange={(t) => onInlineChange?.({ path: `education[${index}].school`, value: t })} />
                  ) : (
                    education.school
                  )}
                </h3>
                 {education.period && (
                   <span className={cn(font.sizes.caption, 'text-black')}>
                     {inlineEditable ? (
                       <InlineText text={education.period} inlineEditable onChange={(t) => onInlineChange?.({ path: `education[${index}].period`, value: t })} />
                     ) : (
                       highlightText(education.period, annotations)
                     )}
                   </span>
                 )}
              </div>
            </div>
            <div className="mb-1">
               <p className={cn(font.sizes.body, 'text-black italic')}>
                 {inlineEditable ? (
                   <InlineText
                     text={`${education.degree}${education.major ? `, ${education.major}` : ''}${education.gpa ? `, GPA: ${education.gpa}` : ''}`}
                     inlineEditable
                     onChange={(t) => onInlineChange?.({ path: `education[${index}].degreeMajorGpa`, value: t })}
                   />
                 ) : (
                   highlightText(`${education.degree}${education.major ? `, ${education.major}` : ''}${education.gpa ? `, GPA: ${education.gpa}` : ''}`, annotations)
                 )}
               </p>
            </div>
            {education.honor && (
              <p className={cn(font.sizes.body, 'text-black')}>
                {inlineEditable ? (
                  <InlineText text={education.honor} inlineEditable onChange={(t) => onInlineChange?.({ path: `education[${index}].honor`, value: t })} />
                ) : (
                  education.honor
                )}
              </p>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 