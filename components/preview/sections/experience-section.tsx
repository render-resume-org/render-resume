import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { Briefcase } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface ExperienceSectionProps {
  data: OptimizedResume['experience'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string } | { action: 'addBullet' | 'removeBullet'; path: string; index: number }) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function ExperienceSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: ExperienceSectionProps) {
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
                <span className={styles.jobTitle}>
                  {inlineEditable ? (
                    <InlineText
                      text={job.title}
                      inlineEditable
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
                        highlightType={highlightForPath?.(`experience[${index}].company`, undefined)}
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
                        highlightType={highlightForPath?.(`experience[${index}].period`, undefined)}
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
                 {job.outcomes.map((achievement, achIndex) => (
                   <li key={achIndex} className={styles.achievement}>
                     {inlineEditable ? (
                       <InlineText
                         text={achievement}
                         inlineEditable
                         isBullet
                         groupId={`experience-${index}-outcomes`}
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
                             index: achIndex,
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
                <h3 className={styles.company}>
                  {inlineEditable ? (
                    <InlineText
                      text={job.company}
                      inlineEditable
                      highlightType={highlightForPath?.(`experience[${index}].company`, undefined)}
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
                      highlightType={highlightForPath?.(`experience[${index}].period`, undefined)}
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
                    highlightType={highlightForPath?.(`experience[${index}].title`, undefined)}
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
              {job.outcomes.map((achievement, achIndex) => (
                <li key={achIndex} className={styles.achievement}>
                  {inlineEditable ? (
                    <InlineText
                      text={achievement}
                      inlineEditable
                      isBullet
                      groupId={`experience-${index}-outcomes`}
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
                          index: achIndex,
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
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}