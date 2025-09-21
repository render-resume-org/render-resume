import { useResumeEditor } from '@/features/smart-chat/components/resume-editor-context';
import { ResumeTemplate } from '@/features/resume/lib/resume-templates';
import { TemplateStylingService } from '@/features/resume/utils/template-styling';
import type { InlineChangeHandler } from '@/types/inline-edit';
import { OptimizedResume } from '@/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import { cn } from '@/utils/cn';
import { Award } from 'lucide-react';
import InlineText from './inline-text';
import ResumeSection from './resume-section';

interface AchievementsSectionProps {
  data: OptimizedResume['achievements'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function AchievementsSection({ data, template, onEdit, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: AchievementsSectionProps) {
  const resumeEditor = useResumeEditor();
  const getInlineIds = resumeEditor?.getInlineIds || ((groupId: string, length: number) => Array.from({ length }, (_, i) => `fallback-${groupId}-${i}`));

  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('achievements');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

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
                <h4 className={styles.projectName}>
                  {inlineEditable ? (
                    <InlineText 
                      text={a.title} 
                      inlineEditable 
                      navOrder={sectionBase + i * 10000 + 10}
                      highlightType={highlightForPath?.(`achievements[${i}].title`)}
                      previewOriginal={getPreviewValueForPath?.(`achievements[${i}].title`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].title`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `achievements[${i}].title`, value: t })} 
                    />
                  ) : (
                    a.title
                  )}
                </h4>
                {a.period && (
                  <span className={styles.period}>
                    {inlineEditable ? (
                      <InlineText 
                        text={a.period} 
                        inlineEditable 
                        navOrder={sectionBase + i * 10000 + 20}
                        highlightType={highlightForPath?.(`achievements[${i}].period`)}
                        previewOriginal={getPreviewValueForPath?.(`achievements[${i}].period`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].period`)?.after}
                        onChange={(t) => onInlineChange?.({ path: `achievements[${i}].period`, value: t })} 
                      />
                    ) : (
                      a.period
                    )}
                  </span>
                )}
              </div>
              {a.organization && (
                <p className={cn(TemplateStylingService.getCaptionStyle(template))}>
                  {inlineEditable ? (
                    <InlineText 
                      text={a.organization} 
                      inlineEditable 
                      navOrder={sectionBase + i * 10000 + 30}
                      highlightType={highlightForPath?.(`achievements[${i}].organization`)}
                      previewOriginal={getPreviewValueForPath?.(`achievements[${i}].organization`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].organization`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `achievements[${i}].organization`, value: t })} 
                    />
                  ) : (
                    a.organization
                  )}
                </p>
              )}
              {a.outcomes && a.outcomes.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                  {(() => {
                    const groupId = `achievements-${i}-outcomes`;
                    const ids = getInlineIds(groupId, (a.outcomes || []).length);
                    return (a.outcomes || []).map((d, idx) => (
                    <li key={ids[idx] ?? idx} data-inline-group={groupId} data-inline-order={idx}>
                      {inlineEditable ? (
                        <InlineText 
                          text={d} 
                          inlineEditable 
                          isBullet
                          bulletId={ids[idx]}
                          groupId={groupId} 
                          navOrder={sectionBase + i * 10000 + 100 + idx}
                          highlightType={highlightForPath?.(`achievements[${i}].outcomes[${idx}]`)}
                          previewOriginal={getPreviewValueForPath?.(`achievements[${i}].outcomes[${idx}]`)?.before}
                          previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].outcomes[${idx}]`)?.after}
                          onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `achievements[${i}].outcomes`, index: idx })} 
                          onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `achievements[${i}].outcomes`, bulletId: ids[idx] })} 
                          onChange={(t) => onInlineChange?.({ path: `achievements[${i}].outcomes[${idx}]`, value: t })} 
                        />
                      ) : (
                        d
                      )}
                    </li>
                  ));
                  })()}
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
              <h3 className={styles.projectName}>
                {inlineEditable ? (
                  <InlineText 
                    text={a.title} 
                    inlineEditable 
                    navOrder={sectionBase + i * 10000 + 10}
                    highlightType={highlightForPath?.(`achievements[${i}].title`)}
                    previewOriginal={getPreviewValueForPath?.(`achievements[${i}].title`)?.before}
                    previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].title`)?.after}
                    onChange={(t) => onInlineChange?.({ path: `achievements[${i}].title`, value: t })} 
                  />
                ) : (
                  a.title
                )}
              </h3>
              {a.period && (
                <span className={styles.period}>
                  {inlineEditable ? (
                    <InlineText 
                      text={a.period} 
                      inlineEditable 
                      navOrder={sectionBase + i * 10000 + 20}
                      highlightType={highlightForPath?.(`achievements[${i}].period`)}
                      previewOriginal={getPreviewValueForPath?.(`achievements[${i}].period`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].period`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `achievements[${i}].period`, value: t })} 
                    />
                  ) : (
                    a.period
                  )}
                </span>
              )}
            </div>
            {a.organization && (
              <p className={cn(TemplateStylingService.getCaptionStyle(template))}>
                {inlineEditable ? (
                  <InlineText 
                    text={a.organization} 
                    inlineEditable 
                    navOrder={sectionBase + i * 10000 + 30}
                    highlightType={highlightForPath?.(`achievements[${i}].organization`)}
                    previewOriginal={getPreviewValueForPath?.(`achievements[${i}].organization`)?.before}
                    previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].organization`)?.after}
                    onChange={(t) => onInlineChange?.({ path: `achievements[${i}].organization`, value: t })} 
                  />
                ) : (
                  a.organization
                )}
              </p>
            )}
            {a.outcomes && a.outcomes.length > 0 && (
              <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                {(() => {
                  const groupId = `achievements-${i}-outcomes`;
                  const ids = getInlineIds(groupId, (a.outcomes || []).length);
                  return (a.outcomes || []).map((d, idx) => (
                  <li key={ids[idx] ?? idx} data-inline-group={groupId} data-inline-order={idx}>
                    {inlineEditable ? (
                      <InlineText 
                        text={d} 
                        inlineEditable 
                        isBullet
                        bulletId={ids[idx]}
                        groupId={groupId} 
                        navOrder={sectionBase + i * 10000 + 100 + idx}
                        highlightType={highlightForPath?.(`achievements[${i}].outcomes[${idx}]`)}
                        previewOriginal={getPreviewValueForPath?.(`achievements[${i}].outcomes[${idx}]`)?.before}
                        previewReplaceWith={getPreviewValueForPath?.(`achievements[${i}].outcomes[${idx}]`)?.after}
                        onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `achievements[${i}].outcomes`, index: idx })} 
                        onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `achievements[${i}].outcomes`, bulletId: ids[idx] })} 
                        onChange={(t) => onInlineChange?.({ path: `achievements[${i}].outcomes[${idx}]`, value: t })} 
                      />
                    ) : (
                      d
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


