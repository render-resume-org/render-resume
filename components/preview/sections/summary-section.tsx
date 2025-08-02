import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import { UserCircle } from 'lucide-react';
import ResumeSection from '../resume-section';

interface SummarySectionProps {
  data: OptimizedResume['summary'];
  template: ResumeTemplate;
  onEdit?: () => void;
}

export default function SummarySection({ data, template, onEdit }: SummarySectionProps) {
  const { font, styles } = template;

  if (!data) return null;

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
      <p className={cn(font.sizes.body, 'text-black leading-relaxed')}>{data}</p>
    </ResumeSection>
  );
} 