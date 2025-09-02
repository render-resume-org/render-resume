import { ResumeTemplate } from '@/lib/config/resume-templates';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEditDialogManager } from './edit-dialogs';
import ResumeHeader from './resume-header';
import { renderSection } from './section-registry';

interface ResumePreviewProps {
  resumeData: OptimizedResume;
  template: ResumeTemplate;
  onUpdateResume?: (updatedResume: OptimizedResume) => void;
  editable?: boolean;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (path: string, next: unknown) => void;
  // Diff preview: list of paths to highlight; for 'set', show before (red) and after (green)
  previewHighlights?: { type: 'set'; path: string }[];
  // Optional map of path -> {before, after} to render git-like diff
  previewDiffs?: Record<string, { before?: string; after?: string }>;
}

export default function ResumePreview({ resumeData, template, onUpdateResume, editable = true, analysisResult, inlineEditable, onInlineChange, previewHighlights, previewDiffs }: ResumePreviewProps) {
  const { font, colors } = template;
  const highlightMap: Record<string, 'set'> = (previewHighlights || []).reduce((acc, h) => {
    acc[h.path] = h.type;
    return acc;
  }, {} as Record<string, 'set'>);
  const highlightForPath = (path: string): 'set' | undefined => highlightMap[path];
  const getPreviewValueForPath = (path: string) => previewDiffs?.[path];

  const { openEditDialog, renderEditDialog } = useEditDialogManager({
    resumeData,
    onUpdateResume: onUpdateResume || (() => {}),
  });

  const createEditHandler = (sectionName: string) => () => {
    if (!editable) return;
    if (['summary', 'skills', 'experience', 'projects', 'education'].includes(sectionName)) {
      openEditDialog(sectionName as 'summary' | 'skills' | 'experience' | 'projects' | 'education');
    }
  };

  return (
    <>
      <div className="resume-preview-container">
        <div 
          className={cn('resume-content', font.family, colors.background)} 
          id="resume-content"
          style={{ 
            backgroundColor: 'white',
            color: '#000000',
            WebkitTextSizeAdjust: 'none',
            textSizeAdjust: 'none',
            fontSize: '16px',
            lineHeight: '1.5', 
          }}
        >
          <ResumeHeader
            personalInfo={resumeData.personalInfo}
            template={template}
            inlineEditable={inlineEditable}
            onInlineChange={(p) => onInlineChange?.(p.path, p.value)}
            highlightForPath={(p) => highlightForPath(p)}
            getPreviewValueForPath={getPreviewValueForPath}
          />

          {template.layout.sections.map(sectionName => (
            <div key={sectionName}>
              {renderSection({ 
                sectionName, 
                resumeData, 
                template,
                onEdit: editable ? createEditHandler(sectionName) : undefined,
                inlineEditable,
                onInlineChange: onInlineChange && sectionName === 'summary'
                  ? (next) => onInlineChange('summary', next)
                  : onInlineChange && sectionName === 'experience'
                  ? (next) => onInlineChange('experience', next)
                  : onInlineChange && sectionName === 'projects'
                  ? (next) => onInlineChange('projects', next)
                  : undefined,
                analysisResult,
                highlightForPath: (p) => highlightForPath(p),
                getPreviewValueForPath,
              })}
            </div>
          ))}
          
          <footer 
            className="flex w-full items-center justify-center gap-1 mt-12 text-xs text-black text-center select-none print:mt-8" 
            style={{ 
              letterSpacing: '0.04em',
              // 確保 footer 樣式與 PDF 完全一致
              marginTop: '3rem',
              width: '100%',
            }}
          >
            <Link href="https://www.render-resume.com" target="_blank" className="flex items-center gap-1">
              <p>Powered by</p>
              <p className={cn('font-semibold text-black')}>RenderResume</p>
              <p>・</p>
              <p className={cn('font-semibold text-black')}>www.render-resume.com</p>
            </Link>
          </footer>
        </div>
      </div>

      {renderEditDialog()}
    </>
  );
} 

