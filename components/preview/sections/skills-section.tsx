import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface SkillsSectionProps {
  data: OptimizedResume['skills'];
  template: ResumeTemplate;
  onEdit?: () => void;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string }) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function SkillsSection({ data, template, onEdit, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: SkillsSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getSkillStyle(template);
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('skills');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

  return (
    <ResumeSection
      title="SKILLS"
      icon={Code}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className={styles.skillList}>
        {data.map((skillGroup, index) => (
          <div key={index}>
            <p className={TemplateStylingService.getBodyTextStyle(template)}>
              <span className={cn(styles.categoryName, 'font-bold')}>
                {inlineEditable ? (
                  <InlineText
                    text={skillGroup.category}
                    inlineEditable
                    navOrder={sectionBase + index * 10000 + 10}
                    highlightType={highlightForPath?.(`skills[${index}].category`)}
                    previewOriginal={getPreviewValueForPath?.(`skills[${index}].category`)?.before}
                    previewReplaceWith={getPreviewValueForPath?.(`skills[${index}].category`)?.after}
                    onChange={(t) => onInlineChange?.({ path: `skills[${index}].category`, value: t })}
                  />
                ) : (
                  skillGroup.category
                )}
              </span>
              {': '}
              {skillGroup.items.map((item, itemIdx) => (
                <span key={itemIdx}>
                  {inlineEditable ? (
                    <InlineText
                      text={item}
                      inlineEditable
                      navOrder={sectionBase + index * 10000 + 100 + itemIdx}
                      highlightType={highlightForPath?.(`skills[${index}].items[${itemIdx}]`)}
                      previewOriginal={getPreviewValueForPath?.(`skills[${index}].items[${itemIdx}]`)?.before}
                      previewReplaceWith={getPreviewValueForPath?.(`skills[${index}].items[${itemIdx}]`)?.after}
                      onChange={(t) => onInlineChange?.({ path: `skills[${index}].items[${itemIdx}]`, value: t })}
                    />
                  ) : (
                    item
                  )}
                  {itemIdx < skillGroup.items.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 