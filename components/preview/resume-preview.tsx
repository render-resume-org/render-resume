import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEditDialogManager } from './edit-dialogs';
import ResumeHeader from './resume-header';
import { renderSection } from './section-registry';

interface ResumePreviewProps {
  resumeData: OptimizedResume;
  template: ResumeTemplate;
  onUpdateResume?: (updatedResume: OptimizedResume) => void;
}

export default function ResumePreview({ resumeData, template, onUpdateResume }: ResumePreviewProps) {
  const { font, colors } = template;

  // Initialize edit dialog manager
  const { openEditDialog, renderEditDialog } = useEditDialogManager({
    resumeData,
    onUpdateResume: onUpdateResume || (() => {}),
  });

  // Create edit handlers for each section
  const createEditHandler = (sectionName: string) => () => {
    if (['summary', 'skills', 'experience', 'projects', 'education'].includes(sectionName)) {
      openEditDialog(sectionName as 'summary' | 'skills' | 'experience' | 'projects' | 'education');
    }
  };

  return (
    <>
      {/* A4 預覽容器 */}
      <div className="resume-preview-container">
        <div 
          className={cn('resume-content', font.family, colors.background)} 
          id="resume-content"
          style={{ 
            backgroundColor: 'white',
            color: '#000000'
          }}
        >
          <ResumeHeader personalInfo={resumeData.personalInfo} template={template} />

          {template.layout.sections.map(sectionName => (
            <div key={sectionName}>
              {renderSection({ 
                sectionName, 
                resumeData, 
                template,
                onEdit: createEditHandler(sectionName),
              })}
            </div>
          ))}
          
          <footer className="flex w-full items-center justify-center gap-1 mt-12 text-xs text-black text-center select-none print:mt-8" style={{ letterSpacing: '0.04em' }}>
            <Link href="https://www.render-resume.com" target="_blank" className="flex items-center gap-1">
              <p>Powered by</p>
              <p className={cn('font-semibold text-black')}>RenderResume</p>
              <p>・</p>
              <p className={cn('font-semibold text-black')}>www.render-resume.com</p>
            </Link>
          </footer>
        </div>
      </div>

      {/* Render edit dialogs */}
      {renderEditDialog()}
    </>
  );
} 