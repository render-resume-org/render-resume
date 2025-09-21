import { ResumeTemplate } from '@/features/resume/lib/resume-templates';
import { OptimizedResume } from '@/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import { cn } from '@/utils/cn';
import Link from 'next/link';
import { useEditDialogManager } from './edit-dialog-manager';
import ResumeHeader from './resume-header';
import { renderSection } from './section-registry';
import { BulletFocusProvider } from './bullet-focus-provider';

interface ResumePreviewProps {
  resumeData: OptimizedResume;
  template: ResumeTemplate;
  onUpdateResume?: (updatedResume: OptimizedResume) => void;
  editable?: boolean;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (path: string, next: unknown) => void;
  // Diff preview: list of paths to highlight; for 'set', show before (red) and after (green); for 'insert', show only green
  previewHighlights?: { type: 'set' | 'insert'; path: string }[];
  // Optional map of path -> {before, after} to render git-like diff
  previewDiffs?: Record<string, { before?: string; after?: string }>;
}

export default function ResumePreview({ resumeData, template, onUpdateResume, editable = true, analysisResult, inlineEditable, onInlineChange, previewHighlights, previewDiffs }: ResumePreviewProps) {
  const { font, colors } = template;
  const highlightMap: Record<string, 'set' | 'insert'> = (previewHighlights || []).reduce((acc, h) => {
    acc[h.path] = h.type;
    return acc;
  }, {} as Record<string, 'set' | 'insert'>);
  
  // Helper: generate ancestor paths in bracket-notation from a full path
  const getAncestorPaths = (path: string): string[] => {
    const ancestors: string[] = [];
    let cursor = path;
    while (true) {
      // remove last [n]
      if (/\[\d+\]$/.test(cursor)) {
        cursor = cursor.replace(/\[\d+\]$/, '');
        ancestors.push(cursor);
        continue;
      }
      // remove trailing .segment
      if (/\.[^.\[]+$/.test(cursor)) {
        cursor = cursor.replace(/\.[^.\[]+$/, '');
        ancestors.push(cursor);
        continue;
      }
      break;
    }
    return ancestors;
  };

  // Helper: read a value from current resumeData by bracket path
  const getValueByPath = (root: unknown, path: string): unknown => {
    try {
      const arrPath = path.replace(/\[(\d+)\]/g, '.$1');
      const segments = arrPath.split('.').filter(Boolean);
      let cursor: unknown = root;
      for (let i = 0; i < segments.length; i++) {
        const key = segments[i] as keyof unknown as string;
        if (cursor && typeof cursor === 'object' && key in (cursor as Record<string, unknown>)) {
          cursor = (cursor as Record<string, unknown>)[key];
        } else {
          return undefined;
        }
      }
      return cursor;
    } catch {
      return undefined;
    }
  };

  const highlightForPath = (path: string): 'set' | 'insert' | undefined => {
    // direct match first
    if (highlightMap[path]) return highlightMap[path];
    // inherit from ancestors (e.g., experience[0] -> experience[0].title)
    const ancestors = getAncestorPaths(path);
    for (const anc of ancestors) {
      if (highlightMap[anc]) return highlightMap[anc];
    }
    return undefined;
  };

  const getPreviewValueForPath = (path: string): { before?: string; after?: string } | undefined => {
    // direct diff match
    if (previewDiffs && previewDiffs[path]) return previewDiffs[path];
    
    // Check if any ancestor has a highlight and synthesize appropriate diff
    const ancestors = getAncestorPaths(path);
    for (const anc of ancestors) {
      const ancestorHighlight = highlightMap[anc];
      if (ancestorHighlight === 'insert') {
        // If ancestor is inserted, show green highlight for this child field
        const val = getValueByPath(resumeData, path);
        return { before: '', after: String(val ?? '') };
      } else if (ancestorHighlight === 'set') {
        // If ancestor is set/removed, check if it's actually a remove (after is empty)
        const ancestorDiff = previewDiffs?.[anc];
        if (ancestorDiff && ancestorDiff.after === '') {
          // Parent is being removed, show red highlight for this child field
          const val = getValueByPath(resumeData, path);
          return { before: String(val ?? ''), after: '' };
        }
      }
    }
    
    return undefined;
  };

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
        <BulletFocusProvider>
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
            onInlineChange={(p) => {
              if ('value' in p) {
                onInlineChange?.(p.path, p.value);
              }
            }}
            highlightForPath={highlightForPath}
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
                onInlineChange: onInlineChange 
                  ? (next) => onInlineChange(sectionName, next)
                  : undefined,
                analysisResult,
                highlightForPath,
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
        </BulletFocusProvider>
      </div>

      {renderEditDialog()}
    </>
  );
} 

