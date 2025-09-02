import { buildAnnotationsFromAnalysis, highlightText } from '@/lib/client/annotations';
import { ResumeTemplate } from '@/lib/config/resume-templates';
import { TemplateStylingService } from '@/lib/template-styling';
import { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResumeAnalysisResult } from '@/lib/types/resume-unified';
import { cn } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import InlineText from '../inline-text';
import ResumeSection from '../resume-section';

interface ProjectsSectionProps {
  data: OptimizedResume['projects'];
  template: ResumeTemplate;
  onEdit?: () => void;
  analysisResult?: UnifiedResumeAnalysisResult | null;
  inlineEditable?: boolean;
  onInlineChange?: (payload: { path: string; value: string } | { action: 'addBullet' | 'removeBullet'; path: string; index: number }) => void;
  highlightForPath?: (path: string, index?: number) => 'set' | undefined;
  getPreviewValueForPath?: (path: string) => { before?: string; after?: string } | undefined;
}

export default function ProjectsSection({ data, template, onEdit, analysisResult, inlineEditable, onInlineChange, highlightForPath, getPreviewValueForPath }: ProjectsSectionProps) {
  if (!data || data.length === 0) return null;

  const styles = TemplateStylingService.getProjectStyle(template);
  const isLatex = TemplateStylingService.isTemplateType(template, 'latex');
  const annotations = buildAnnotationsFromAnalysis(analysisResult);

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
              {project.achievements && project.achievements.length > 0 && (
                <ul className={cn(TemplateStylingService.getCaptionStyle(template), 'mt-1 list-disc list-inside')}>
                   {project.achievements.map((achievement, achievementIndex) => (
                     <li key={achievementIndex}>
                       {inlineEditable ? (
                         <InlineText
                           text={
                             highlightForPath?.(`projects[${index}].achievements[${achievementIndex}]`) === 'set' && 
                             getPreviewValueForPath?.(`projects[${index}].achievements[${achievementIndex}]`)?.after
                               ? getPreviewValueForPath?.(`projects[${index}].achievements[${achievementIndex}]`)?.after || ''
                               : achievement
                           }
                           inlineEditable
                           isBullet
                           groupId={`projects-${index}-achievements`}
                           highlightType={highlightForPath?.(`projects[${index}].achievements[${achievementIndex}]`)}
                           previewOriginal={getPreviewValueForPath?.(`projects[${index}].achievements[${achievementIndex}]`)?.before}
                           previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].achievements[${achievementIndex}]`)?.after}
                           onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `projects[${index}].achievements`, index: achievementIndex })}
                           onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `projects[${index}].achievements`, index: achievementIndex })}
                           onChange={(t) => onInlineChange?.({ path: `projects[${index}].achievements[${achievementIndex}]`, value: t })}
                         />
                       ) : (
                         highlightText(achievement, annotations)
                       )}
                     </li>
                   ))}
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
               {project.achievements && project.achievements.length > 0 && (
               <ul className={styles.achievementList}>
                 {project.achievements.map((achievement, achIndex) => (
                   <li key={achIndex} className={styles.achievement}>
                     {inlineEditable ? (
                       <InlineText
                         text={achievement}
                         inlineEditable
                         isBullet
                         groupId={`projects-${index}-achievements`}
                         highlightType={highlightForPath?.(`projects[${index}].achievements[${achIndex}]`)}
                         previewOriginal={getPreviewValueForPath?.(`projects[${index}].achievements[${achIndex}]`)?.before}
                         previewReplaceWith={getPreviewValueForPath?.(`projects[${index}].achievements[${achIndex}]`)?.after}
                         onAddBullet={() => onInlineChange?.({ action: 'addBullet', path: `projects[${index}].achievements`, index: achIndex })}
                         onRemoveBullet={() => onInlineChange?.({ action: 'removeBullet', path: `projects[${index}].achievements`, index: achIndex })}
                         onChange={(t) => onInlineChange?.({ path: `projects[${index}].achievements[${achIndex}]`, value: t })}
                       />
                     ) : (
                       highlightText(achievement, annotations)
                     )}
                   </li>
                 ))}
               </ul>
             )}
          </div>
        ))}
      </div>
    </ResumeSection>
  );
} 