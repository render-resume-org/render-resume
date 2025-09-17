import { useResumeEditor } from '@/components/smart-chat/context/resume-editor-context';
import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/utils/template-styling';
import type { InlineChangeHandler } from '@/types/inline-edit';
import { OptimizedResume } from '@/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/types/resume-unified';
import { cn } from '@/utils';
import { FolderOpen } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface ProjectsSectionProps {
  data: OptimizedResume['projects'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: InlineChangeHandler;
  highlightForPath?: (path: string, index?: number) => 'set' | 'insert' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function ProjectsSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: ProjectsSectionProps) {
  const resumeEditor = useResumeEditor();
  const getInlineIds = resumeEditor?.getInlineIds || ((groupId: string, length: number) => Array.from({ length }, (_, i) => `fallback-${groupId}-${i}`));

  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');
  const annotations = buildAnnotationsFromAnalysis(analysisResult);
  const sectionIndex = template.layout.sections.indexOf('projects');
  const sectionBase = Math.max(0, sectionIndex) * 1000000;

  if (isLatex) {
    return (
      <ResumeSection
        title="Projects"
        icon={FolderOpen}
        className={styles.container}
        titleClassName={styles.title}
        iconClassName={styles.icon}
        showIcon={template.styles.showSectionIcons}
        onEdit={onEdit}
      >
        <div className="space-y-3">
          {data.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                 <h4 className={styles.projectName}>
                   {inlineEditable ? (
                     <InlineText
                       text={project.name}
                       inlineEditable
                       navOrder={sectionBase + index * 10000 + 20}
                       highlightType={highlightForPath?.(`projects[${index}].name`)}
                       previewOriginal={getPreviewValueForPath?.(`projects[${index}].name`)?.before}
                       previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].name`)?.after}
                       onChange={(t) => onInlineChange?.({ path: `projects[${index}].name`, value: t })}
                     />
                   ) : (
                     highlightText(project.name, annotations)
                   )}
                 </h4>
                 {project.period && (
                   <span className={styles.period}>
                     {inlineEditable ? (
                       <InlineText
                         text={project.period}
                         inlineEditable
                         navOrder={sectionBase + index * 10000 + 10}
                         highlightType={highlightForPath?.(`projects[${index}].period`)}
                         previewOriginal={getPreviewValueForPath?.(`projects[${index}].period`)?.before}
                         previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].period`)?.after}
                         onChange={(t) => onInlineChange?.({ path: `projects[${index}].period`, value: t })}
                       />
                     ) : (
                       highlightText(project.period, annotations)
                     )}
                   </span>
                 )}
              </div>
              {project.outcomes && project.outcomes.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'mt-1 list-disc list-inside')}>
                   {(() => {
                     const groupId = `projects-${index}-outcomes`;
                     const ids = getInlineIds(groupId, (project.outcomes || []).length);
                     return (project.outcomes || []).map((achievement, achievementIndex) => (
                     <li key={ids[achievementIndex] ?? achievementIndex} data-inline-group={groupId} data-inline-order={achievementIndex}>
                       {inlineEditable ? (
                         <InlineText
                           text={achievement}
                           inlineEditable
                           isBullet
                           bulletId={ids[achievementIndex]}
                           navOrder={sectionBase + index * 10000 + 100 + achievementIndex}
                           highlightType={highlightForPath?.(`projects[${index}].outcomes[${achievementIndex}]`)}
                           previewOriginal={getPreviewValueForPath?.(`projects[${index}].outcomes[${achievementIndex}]`)?.before}
                           previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].outcomes[${achievementIndex}]`)?.after}
                           onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `projects[${index}].outcomes`, index: achievementIndex })}
                           onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `projects[${index}].outcomes`, bulletId: ids[achievementIndex] })}
                           onChange={(t) => onInlineChange?.({ path: `projects[${index}].outcomes[${achievementIndex}]`, value: t })}
                         />
                       ) : (
                         highlightText(achievement, annotations)
                       )}
                     </li>
                   ));
                   })()}
                </ul>
              )}
            </div>
          ))}
        </div>
      </ResumeSection>
    );
  }

  // Standard template
  return (
    <ResumeSection
      title="PROJECTS"
      icon={FolderOpen}
      className={styles.container}
      titleClassName={cn(template.font.family, styles.title)}
      iconClassName={styles.icon}
      showIcon={template.styles.showSectionIcons}
      onEdit={onEdit}
    >
      <div className={styles.projectList}>
        {data.map((project, index) => (
          <div key={index} className={styles.projectContainer}>
            <div className="mb-1">
              <div className="flex justify-between items-center">
                 <h3 className={styles.projectName}>
                  {inlineEditable ? (
                    <InlineText
                      text={project.name}
                      inlineEditable
                      navOrder={sectionBase + index * 10000 + 10}
                      onChange={(t) => onInlineChange?.({ path: `projects[${index}].name`, value: t })}
                    />
                  ) : (
                    highlightText(project.name, annotations)
                  )}
                 </h3>
                 {project.period && (
                   <span className={styles.period}>
                     {inlineEditable ? (
                       <InlineText
                         text={project.period}
                         inlineEditable
                         navOrder={sectionBase + index * 10000 + 20}
                         highlightType={highlightForPath?.(`projects[${index}].period`)}
                         previewOriginal={getPreviewValueForPath?.(`projects[${index}].period`)?.before}
                         previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].period`)?.after}
                         onChange={(t) => onInlineChange?.({ path: `projects[${index}].period`, value: t })}
                       />
                     ) : (
                       highlightText(project.period, annotations)
                     )}
                   </span>
                 )}
              </div>
            </div>
               {project.outcomes && project.outcomes.length > 0 && (
               <ul className={styles.achievementList}>
                {(() => {
                  const groupId = `projects-${index}-outcomes`;
                  const ids = getInlineIds(groupId, (project.outcomes || []).length);
                  return (project.outcomes || []).map((achievement, achIndex) => (
                  <li key={ids[achIndex] ?? achIndex} className={styles.achievement} data-inline-group={groupId} data-inline-order={achIndex}>
                     {inlineEditable ? (
                       <InlineText
                         text={achievement}
                         inlineEditable
                         isBullet
                         bulletId={ids[achIndex]}
                         groupId={groupId}
                         navOrder={sectionBase + index * 10000 + 100 + achIndex}
                         highlightType={highlightForPath?.(`projects[${index}].outcomes[${achIndex}]`)}
                         previewOriginal={getPreviewValueForPath?.(`projects[${index}].outcomes[${achIndex}]`)?.before}
                         previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].outcomes[${achIndex}]`)?.after}
                         onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `projects[${index}].outcomes`, index: achIndex })}
                         onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `projects[${index}].outcomes`, bulletId: ids[achIndex] })}
                         onChange={(t) => onInlineChange?.({ path: `projects[${index}].outcomes[${achIndex}]`, value: t })}
                       />
                     ) : (
                       highlightText(achievement, annotations)
                     )}
                   </li>
                ))
                })()}
               </ul>
             )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 