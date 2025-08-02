import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';

interface ResumeHeaderProps {
  personalInfo: OptimizedResume['personalInfo'];
  template: ResumeTemplate;
}

export default function ResumeHeader({ personalInfo, template }: ResumeHeaderProps) {
  const { font, styles } = template;

  if (template.id === 'latex') {
    return (
      <header className={cn(styles.header)}>
        <h1 className={cn(font.sizes.title, 'text-black')}>
          {personalInfo.fullName || '姓名未提供'}
        </h1>
        <div className={cn(font.sizes.subtitle, 'text-black flex justify-center items-center space-x-2')}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>{'//'}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.linkedin && (
            <>
              <span>{'//'}</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>{'//'}</span>
              <span>{personalInfo.github}</span>
            </>
          )}
          {personalInfo.website && (
            <>
              <span>{'//'}</span>
              <span>{personalInfo.website}</span>
            </>
          )}
        </div>
      </header>
    );
  }



  // Standard template
  return (
    <header className={cn(styles.header)}>
      <h1 className={cn(font.sizes.title, 'text-black text-center mb-1')}>
        {personalInfo.fullName || '姓名未提供'}
      </h1>
      
      <div className={cn('text-center', font.sizes.body, 'text-black')}>
        {[
          personalInfo.location,
          personalInfo.phone,
          personalInfo.email,
          personalInfo.linkedin,
          personalInfo.github,
          personalInfo.website
        ].filter(Boolean).join('・')}
      </div>
    </header>
  );
} 