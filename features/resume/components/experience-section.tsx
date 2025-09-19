import { useResumeEditor } from '@/features/smart-chat/components/resume-editor-context';
import { buildAnnotationsFromAnalysis, highlightText } from '../utils/resume-annotations';
import { ResumeTemplate } from '@/features/resume/lib/resume-templates';
import { TemplateStylingService } from '@/utils/template-styling';
import type { InlineChangeHandler } from '@/types/inline-edit';
import { OptimizedResume } from '@/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import { cn } from '@/utils';
import { Briefcase } from 'lucide-react';
import InlineText from './inline-text';
import ResumeSection from './resume-section';

interface ExperienceSectionProps {
  data: OptimizedResume['experience'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function ExperienceSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: ExperienceSectionProps) {
  const resumeEditor = useResumeEditor();
  const getInlineIds = resumeEditor?.getInlineIds || ((groupId: string, length: number) => Array.from({ length }, (_, i) => `fallback-${groupId}-${i}`));

  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getExperienceStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');
  const annotations = buildAnnotationsFromAnalysis(analysisResult);
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('experience');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

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
                <span className={styles.jobTitle}>
                  {inlineEditable ? (
                    <InlineText
                      text={job.title}
                      inlineEditable
                      navOrder={sectionBase + index * 10000 + 30}
                      highlightType={highlightForPath?.(`experience[${index}].title`)}
                      previewOriginal={getPreviewValueForPath?.(`experience[${index}].title`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].title`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `experience[${index}].title`, value: t })}
                    />
                  ) : (
                    highlightText(job.title, annotations)
                  )}
                </span>
                 <span>
                  <span> | </span>
                   <span className={styles.company}>
                    {inlineEditable ? (
                      <InlineText
                        text={job.company}
                        inlineEditable
                        navOrder={sectionBase + index * 10000 + 10}
                        highlightType={highlightForPath?.(`experience[${index}].company`)}
                        previewOriginal={getPreviewValueForPath?.(`experience[${index}].company`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].company`)?.after}
                        onChange={(t) => onInlineChange?.({ path: `experience[${index}].company`, value: t })}
                      />
                    ) : (
                      highlightText(job.company, annotations)
                    )}
                   </span>
                   <span>
                    {' | '}
                    {inlineEditable ? (
                      <InlineText
                        text={job.period}
                        inlineEditable
                        navOrder={sectionBase + index * 10000 + 20}
                        highlightType={highlightForPath?.(`experience[${index}].period`)}
                        previewOriginal={getPreviewValueForPath?.(`experience[${index}].period`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].period`)?.after}
                        onChange={(t) => onInlineChange?.({ path: `experience[${index}].period`, value: t })}
                      />
                    ) : (
                      highlightText(job.period, annotations)
                    )}
                   </span>
                </span>
              </div>
               <ul className={styles.achievementList}>
                 {(() => {
                   const groupId = `experience-${index}-outcomes`;
                   const ids = getInlineIds(groupId, (job.outcomes || []).length);
                   return (job.outcomes || []).map((achievement, achIndex) => (
                   <li key={ids[achIndex] ?? achIndex} className={styles.achievement} data-inline-group={groupId} data-inline-order={achIndex}>
                     {inlineEditable ? (
                       <InlineText
                         text={achievement}
                         inlineEditable
                         isBullet
                         bulletId={ids[achIndex]}
                         navOrder={sectionBase + index * 10000 + 100 + achIndex}
                         highlightType={
                           highlightForPath?.(
                             `experience[${index}].outcomes[${achIndex}]`,
                             achIndex
                           )
                         }
                         previewOriginal={
                           getPreviewValueForPath?.(
                             `experience[${index}].outcomes[${achIndex}]`
                           )?.before
                         }
                         previewReplaceWith={
                           getPreviewValueForPath?.(
                             `experience[${index}].outcomes[${achIndex}]`
                           )?.after
                         }
                         onAddBullet={() =>
                           onInlineChange?.({
                             action: 'addBullet',
                             path: `experience[${index}].outcomes`,
                             index: achIndex,
                           })
                         }
                         onRemoveBullet={() =>
                           onInlineChange?.({
                             action: 'removeBullet',
                             path: `experience[${index}].outcomes`,
                             bulletId: ids[achIndex],
                           })
                         }
                         onChange={(t) =>
                           onInlineChange?.({
                             path: `experience[${index}].outcomes[${achIndex}]`,
                             value: t,
                           })
                         }
                       />
                     ) : (
                       highlightText(achievement, annotations)
                     )}
                   </li>
                 ))
                 })()}
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
                <h3 className={styles.company}>
                  {inlineEditable ? (
                    <InlineText
                      text={job.company}
                      inlineEditable
                      navOrder={sectionBase + index * 10000 + 10}
                      highlightType={highlightForPath?.(`experience[${index}].company`)}
                      previewOriginal={getPreviewValueForPath?.(`experience[${index}].company`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].company`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `experience[${index}].company`, value: t })}
                    />
                  ) : (
                    highlightText(job.company, annotations)
                  )}
                </h3>
                 <span className={styles.period}>
                  {inlineEditable ? (
                    <InlineText
                      text={job.period}
                      inlineEditable
                      navOrder={sectionBase + index * 10000 + 20}
                      highlightType={highlightForPath?.(`experience[${index}].period`)}
                      previewOriginal={getPreviewValueForPath?.(`experience[${index}].period`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].period`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `experience[${index}].period`, value: t })}
                    />
                  ) : (
                    highlightText(job.period, annotations)
                  )}
                 </span>
              </div>
               <p className={cn(styles.jobTitle, 'italic')}>
                {inlineEditable ? (
                  <InlineText
                    text={job.title}
                    inlineEditable
                    navOrder={sectionBase + index * 10000 + 30}
                    highlightType={highlightForPath?.(`experience[${index}].title`)}
                    previewOriginal={getPreviewValueForPath?.(`experience[${index}].title`)?.before}
                    previewReplaceWith={getPreviewValueForPath?.(`experience[${index}].title`)?.after}
                    onChange={(t) => onInlineChange?.({ path: `experience[${index}].title`, value: t })}
                  />
                ) : (
                  highlightText(job.title, annotations)
                )}
               </p>
            </div>
            <ul className={styles.achievementList}>
              {(() => {
                const groupId = `experience-${index}-outcomes`;
                const ids = getInlineIds(groupId, (job.outcomes || []).length);
                return (job.outcomes || []).map((achievement, achIndex) => (
                <li key={ids[achIndex] ?? achIndex} className={styles.achievement} data-inline-group={groupId} data-inline-order={achIndex}>
                  {inlineEditable ? (
                    <InlineText
                      text={achievement}
                      inlineEditable
                      isBullet
                      bulletId={ids[achIndex]}
                      navOrder={sectionBase + index * 10000 + 100 + achIndex}
                      highlightType={
                        highlightForPath?.(
                          `experience[${index}].outcomes[${achIndex}]`,
                          achIndex
                        )
                      }
                      previewOriginal={
                        getPreviewValueForPath?.(
                          `experience[${index}].outcomes[${achIndex}]`
                        )?.before
                      }
                      previewReplaceWith={
                        getPreviewValueForPath?.(
                          `experience[${index}].outcomes[${achIndex}]`
                        )?.after
                      }
                      onAddBullet={() =>
                        onInlineChange?.({
                          action: 'addBullet',
                          path: `experience[${index}].outcomes`,
                          index: achIndex,
                        })
                      }
                      onRemoveBullet={() =>
                        onInlineChange?.({
                          action: 'removeBullet',
                          path: `experience[${index}].outcomes`,
                          bulletId: ids[achIndex],
                        })
                      }
                      onChange={(t) =>
                        onInlineChange?.({
                          path: `experience[${index}].outcomes[${achIndex}]`,
                          value: t,
                        })
                      }
                    />
                  ) : (
                    highlightText(achievement, annotations)
                  )}
                </li>
              ))
              })()}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}