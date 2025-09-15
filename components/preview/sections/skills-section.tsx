import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import type { InlineChangeHandler } from '@/lib/types/inline-edit';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { Code } from 'lucide-react';
import { useResumeEditor } from '../../smart-chat/context/resume-editor-context';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface SkillsSectionProps {
  data: OptimizedResume['skills'];
  template: ResumeTemplate;
  onEdit?: () => void;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function SkillsSection({ data, template, onEdit, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: SkillsSectionProps) {
  const resumeEditor = useResumeEditor();
  const { addSkillCategory, removeSkillCategory } = resumeEditor || {};

  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getSkillStyle(template);
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('skills');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

  const shouldDeleteCategory = (categoryIndex: number): boolean => {
    const skillGroup = data[categoryIndex];
    if (!skillGroup) return false;
    // delete when both category and items are empty
    return (!skillGroup.category || skillGroup.category.trim() === '') && (!skillGroup.items || skillGroup.items.trim() === '');
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === 'Enter' && isCaretAtEnd(e)) {
      e.preventDefault();
      addSkillCategory?.();
    }
    // Right arrow at end of category - focus to first item or create one
    if (e.key === 'ArrowRight' && isCaretAtEnd(e)) {
      e.preventDefault();
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('resume-inline-focus', { 
          detail: { 
            groupId: `skills-${categoryIndex}-items`, 
            index: 0, 
            position: 'start' 
          } 
        }));
      }, 10);
    }
    // Handle backspace at start of category
    if (e.key === 'Backspace' && isCaretAtStart(e)) {
      e.preventDefault();
      // If category should be deleted (empty category with no/empty items), delete it
      if (shouldDeleteCategory(categoryIndex)) {
        removeSkillCategory?.(categoryIndex);
      }
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === 'Enter' && isCaretAtEnd(e)) {
      e.preventDefault();
      const isLastCategory = categoryIndex === data.length - 1;
      if (isLastCategory) {
        addSkillCategory?.();
      }
    } else if (e.key === 'ArrowLeft' && isCaretAtStart(e)) {
      // Left arrow at start - focus back to category
      e.preventDefault();
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('resume-inline-focus', { 
          detail: { 
            groupId: `skills-${categoryIndex}-category`, 
            index: 0, 
            position: 'end' 
          } 
        }));
      }, 10);
    } else if (e.key === 'Backspace' && isCaretAtStart(e)) {
      const currentText = (e.target as HTMLElement).innerText;
      if (currentText.trim() === '') {
        e.preventDefault();
        // If items empty and category also empty, remove the category
        setTimeout(() => {
          if (shouldDeleteCategory(categoryIndex)) {
            removeSkillCategory?.(categoryIndex);
          }
        }, 50);
      }
    }
  };

  const isCaretAtEnd = (e: React.KeyboardEvent) => {
    const el = e.target as HTMLElement;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.endContainer)) return false;
    const post = range.cloneRange();
    post.selectNodeContents(el);
    post.setStart(range.endContainer, range.endOffset);
    return post.toString().length === 0;
  };

  const isCaretAtStart = (e: React.KeyboardEvent) => {
    const el = e.target as HTMLElement;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer)) return false;
    const pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.startContainer, range.startOffset);
    return pre.toString().length === 0;
  };

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
                    groupId={`skills-${index}-category`}
                    navOrder={sectionBase + index * 10000 + 10}
                    highlightType={highlightForPath?.(`skills[${index}].category`)}
                    previewOriginal={getPreviewValueForPath?.(`skills[${index}].category`)?.before}
                    previewReplaceWith={getPreviewValueForPath?.(`skills[${index}].category`)?.after}
                    onChange={(t) => onInlineChange?.({ path: `skills[${index}].category`, value: t })}
                    onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                  />
                ) : (
                  skillGroup.category
                )}
              </span>
              <span className="select-none" contentEditable={false}>: </span>
              {inlineEditable ? (
                <InlineText
                  text={skillGroup.items}
                  inlineEditable
                  groupId={`skills-${index}-items`}
                  navOrder={sectionBase + index * 10000 + 100}
                  highlightType={highlightForPath?.(`skills[${index}].items`)}
                  previewOriginal={getPreviewValueForPath?.(`skills[${index}].items`)?.before}
                  previewReplaceWith={getPreviewValueForPath?.(`skills[${index}].items`)?.after}
                  onChange={(t) => onInlineChange?.({ path: `skills[${index}].items`, value: t })}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                />
              ) : (
                skillGroup.items
              )}
            </p>
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 