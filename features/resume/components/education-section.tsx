import { useResumeEditor } from '@/features/smart-chat/components/resume-editor-context';
import { buildAnnotationsFromAnalysis, highlightText } from '../utils/resume-annotations';
import { ResumeTemplate } from '@/features/resume/lib/resume-templates';
import type { InlineChangeHandler } from '@/types/inline-edit';
import { OptimizedResume } from '@/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import { cn } from '@/utils';
import { GraduationCap } from 'lucide-react';
import InlineText from './inline-text';
import ResumeSection from './resume-section';

interface EducationSectionProps {
  data: OptimizedResume['education'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function EducationSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: EducationSectionProps) {
  const resumeEditor = useResumeEditor();
  const getInlineIds = resumeEditor?.getInlineIds || ((groupId: string, length: number) => Array.from({ length }, (_, i) => `fallback-${groupId}-${i}`));
  const { font, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const annotations = buildAnnotationsFromAnalysis(analysisResult);
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('education');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

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
                        text={education.degree}
                        inlineEditable
                        navOrder={sectionBase + index * 10000 + 10}
                        highlightType={highlightForPath?.(`education[${index}].degree`)}
                        onChange={(t) => onInlineChange?.({ path: `education[${index}].degree`, value: t })}
                      />
                    ) : (
                      highlightText(education.degree, annotations)
                    )}
                    {education.major && (
                      <>
                        {', '}
                        {inlineEditable ? (
                          <InlineText
                            text={education.major}
                            inlineEditable
                            navOrder={sectionBase + index * 10000 + 11}
                            highlightType={highlightForPath?.(`education[${index}].major`)}
                            onChange={(t) => onInlineChange?.({ path: `education[${index}].major`, value: t })}
                          />
                        ) : (
                          highlightText(education.major, annotations)
                        )}
                      </>
                    )}
                  </h4>
                  <p className={cn(font.sizes.caption, 'text-black')}>
                    {inlineEditable ? (
                      <InlineText 
                        text={education.school} 
                        inlineEditable 
                        navOrder={sectionBase + index * 10000 + 20}
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
                       navOrder={sectionBase + index * 10000 + 30}
                       highlightType={highlightForPath?.(`education[${index}].period`)}
                       onChange={(t) => onInlineChange?.({ path: `education[${index}].period`, value: t })} 
                     />
                   ) : (
                     highlightText(education.period, annotations)
                   )}
                 </span>
              </div>
              {education.outcomes && education.outcomes.length > 0 && (
                <ul className={cn(font.sizes.caption, 'text-black mt-1 space-y-1')}>
                {(() => {
                  const groupId = `education-${index}-outcomes`;
                  const ids = getInlineIds(groupId, (education.outcomes || []).length);
                  return (education.outcomes || []).map((outcome, outcomeIndex) => (
                  <li key={ids[outcomeIndex] ?? outcomeIndex} className={cn(font.sizes.caption, 'text-black list-disc list-outside ml-4')} data-inline-group={groupId} data-inline-order={outcomeIndex}>
                    {inlineEditable ? (
                      <InlineText 
                        text={outcome} 
                        inlineEditable 
                        isBullet
                        bulletId={ids[outcomeIndex]}
                        groupId={groupId}
                        navOrder={sectionBase + index * 10000 + 100 + outcomeIndex}
                        highlightType={highlightForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)}
                        previewOriginal={getPreviewValueForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)?.after}
                        onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `education[${index}].outcomes`, index: outcomeIndex })}
                        onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `education[${index}].outcomes`, bulletId: ids[outcomeIndex] })}
                        onChange={(t) => onInlineChange?.({ path: `education[${index}].outcomes[${outcomeIndex}]`, value: t })} 
                      />
                    ) : (
                      highlightText(outcome, annotations)
                    )}
                  </li>
                ))
                })()}
              </ul>
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
                    <InlineText text={education.school} inlineEditable navOrder={sectionBase + index * 10000 + 10} onChange={(t) => onInlineChange?.({ path: `education[${index}].school`, value: t })} />
                  ) : (
                    education.school
                  )}
                </h3>
                 {education.period && (
                   <span className={cn(font.sizes.caption, 'text-black')}>
                     {inlineEditable ? (
                       <InlineText text={education.period} inlineEditable navOrder={sectionBase + index * 10000 + 20} onChange={(t) => onInlineChange?.({ path: `education[${index}].period`, value: t })} />
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
                     text={education.degree}
                     inlineEditable
                     navOrder={sectionBase + index * 10000 + 30}
                     onChange={(t) => onInlineChange?.({ path: `education[${index}].degree`, value: t })}
                   />
                 ) : (
                   highlightText(education.degree, annotations)
                 )}
                 {education.major && (
                   <>
                     {', '}
                     {inlineEditable ? (
                       <InlineText
                         text={education.major}
                         inlineEditable
                         navOrder={sectionBase + index * 10000 + 31}
                         onChange={(t) => onInlineChange?.({ path: `education[${index}].major`, value: t })}
                       />
                     ) : (
                       highlightText(education.major, annotations)
                     )}
                   </>
                 )}
                 {education.gpa && (
                   <>
                     {', GPA: '}
                     {inlineEditable ? (
                       <InlineText
                         text={education.gpa}
                         inlineEditable
                         navOrder={sectionBase + index * 10000 + 32}
                         onChange={(t) => onInlineChange?.({ path: `education[${index}].gpa`, value: t })}
                       />
                     ) : (
                       highlightText(education.gpa, annotations)
                     )}
                   </>
                 )}
               </p>
            </div>
            {education.honor && (
              <p className={cn(font.sizes.body, 'text-black')}>
                {inlineEditable ? (
                  <InlineText text={education.honor} inlineEditable navOrder={sectionBase + index * 10000 + 100} onChange={(t) => onInlineChange?.({ path: `education[${index}].honor`, value: t })} />
                ) : (
                  education.honor
                )}
              </p>
            )}
            {education.outcomes && education.outcomes.length > 0 && (
              <ul className={cn(font.sizes.caption, 'text-black mt-1 space-y-1')}>
                {(() => {
                  const groupId = `education-${index}-outcomes`;
                  const ids = getInlineIds(groupId, (education.outcomes || []).length);
                  return (education.outcomes || []).map((outcome, outcomeIndex) => (
                  <li key={ids[outcomeIndex] ?? outcomeIndex} className={cn(font.sizes.caption, 'text-black list-disc list-outside ml-4')} data-inline-group={groupId} data-inline-order={outcomeIndex}>
                    {inlineEditable ? (
                      <InlineText 
                        text={outcome} 
                        inlineEditable 
                        isBullet
                        bulletId={ids[outcomeIndex]}
                        groupId={groupId}
                        navOrder={sectionBase + index * 10000 + 200 + outcomeIndex}
                        highlightType={highlightForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)}
                        previewOriginal={getPreviewValueForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`education[${index}].outcomes[${outcomeIndex}]`)?.after}
                        onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `education[${index}].outcomes`, index: outcomeIndex })}
                        onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `education[${index}].outcomes`, bulletId: ids[outcomeIndex] })}
                        onChange={(t) => onInlineChange?.({ path: `education[${index}].outcomes[${outcomeIndex}]`, value: t })} 
                      />
                    ) : (
                      highlightText(outcome, annotations)
                    )}
                  </li>
                ))
                })()}
              </ul>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 