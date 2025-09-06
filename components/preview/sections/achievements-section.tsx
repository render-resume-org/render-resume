import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface AchievementsSectionProps {
  data: OptimizedResume['achievements'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string } | { action: 'addBullet' | 'removeBullet'; path: string; index: number }) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
}

export default function AchievementsSection({ data, template, onEdit, inlineEditable, onInlineChange, highlightForPath }: AchievementsSectionProps) {
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
                      onChange={(t) => onInlineChange?.({ path: `achievements[${i}].organization`, value: t })} 
                    />
                  ) : (
                    a.organization
                  )}
                </p>
              )}
              {a.outcomes && a.outcomes.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                  {a.outcomes.map((d, idx) => (
                    <li key={idx}>
                      {inlineEditable ? (
                        <InlineText 
                          text={d} 
                          inlineEditable 
                          isBullet 
                          groupId={`achievements-${i}-outcomes`} 
                          navOrder={sectionBase + i * 10000 + 100 + idx}
                          highlightType={highlightForPath?.(`achievements[${i}].outcomes[${idx}]`, idx)}
                          onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `achievements[${i}].outcomes`, index: idx })} 
                          onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `achievements[${i}].outcomes`, index: idx })} 
                          onChange={(t) => onInlineChange?.({ path: `achievements[${i}].outcomes[${idx}]`, value: t })} 
                        />
                      ) : (
                        d
                      )}
                    </li>
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
              <h3 className={styles.projectName}>
                {inlineEditable ? (
                  <InlineText text={a.title} inlineEditable navOrder={sectionBase + i * 10000 + 10} onChange={(t) => onInlineChange?.({ path: `achievements[${i}].title`, value: t })} />
                ) : (
                  a.title
                )}
              </h3>
              {a.period && (
                <span className={styles.period}>
                  {inlineEditable ? (
                    <InlineText text={a.period} inlineEditable navOrder={sectionBase + i * 10000 + 20} onChange={(t) => onInlineChange?.({ path: `achievements[${i}].period`, value: t })} />
                  ) : (
                    a.period
                  )}
                </span>
              )}
            </div>
            {a.organization && (
              <p className={cn(TemplateStylingService.getCaptionStyle(template))}>
                {inlineEditable ? (
                  <InlineText text={a.organization} inlineEditable navOrder={sectionBase + i * 10000 + 30} onChange={(t) => onInlineChange?.({ path: `achievements[${i}].organization`, value: t })} />
                ) : (
                  a.organization
                )}
              </p>
            )}
            {a.outcomes && a.outcomes.length > 0 && (
              <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'list-disc list-inside mt-1')}>
                {a.outcomes.map((d, idx) => (
                  <li key={idx}>
                    {inlineEditable ? (
                      <InlineText text={d} inlineEditable isBullet groupId={`achievements-${i}-outcomes`} navOrder={sectionBase + i * 10000 + 100 + idx} onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `achievements[${i}].outcomes`, index: idx })} onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `achievements[${i}].outcomes`, index: idx })} onChange={(t) => onInlineChange?.({ path: `achievements[${i}].outcomes[${idx}]`, value: t })} />
                    ) : (
                      d
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
}


