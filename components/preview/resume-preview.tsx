import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import { cn } from '@/lib/utils';
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
      <div 
        className={cn('p-8 min-h-[1000px] h-fit', font.family, colors.background)} 
        id="resume-content"
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
        
        <footer className="flex w-full items-center justify-center gap-1 mt-12 text-xs text-gray-400 dark:text-gray-500 text-center select-none print:mt-8" style={{ letterSpacing: '0.04em' }}>
          <p>made with</p>
          <p className={cn('font-semibold', colors.primary)}>RenderResume</p>
        </footer>
        <div className="text-xs text-gray-400 w-full text-center">
          www.render-resume.com
        </div>
      </div>

      {/* Render edit dialogs */}
      {renderEditDialog()}
    </>
  );
} 