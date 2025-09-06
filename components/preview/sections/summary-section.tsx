import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface SummarySectionProps {
  data: OptimizedResume['summary'];
  template: ResumeTemplate;
  onEdit?: () => void;
  inlineEditable?: boolean;
  onInlineChange?: (next: string) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function SummarySection({ data, template, onEdit, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: SummarySectionProps) {
  const { font, styles } = template;
  // Global navigation ordering base for this section
  const sectionIndex = template.layout.sections.indexOf('summary');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

  return (
    <ResumeSection
      title="SUMMARY"
      icon={UserCircle}
      className={template.spacing.section}
      titleClassName={cn(font.sizes.heading, 'text-black', styles.sectionTitle)}
      iconClassName={cn('text-black w-5 h-5')}
      showIcon={styles.showSectionIcons}
      onEdit={onEdit}
    >
      {data ? (
        <p className={cn(font.sizes.body, 'text-black leading-relaxed')}>
          <InlineText 
            text={data} 
            inlineEditable={inlineEditable} 
            navOrder={sectionBase + 10}
            onChange={onInlineChange} 
            highlightType={highlightForPath?.('summary')} 
            previewOriginal={getPreviewValueForPath?.('summary')?.before}
            previewReplaceWith={getPreviewValueForPath?.('summary')?.after}
          />
        </p>
      ) : null}
    </ResumeSection>
  );
} 