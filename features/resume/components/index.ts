// Upload form components
export { AdditionalTextInput } from "./additional-text-input";
export { EducationInput } from "./education-input";
export { ExperienceInput } from "./experience-input";
export { LinksInput } from "./links-input";
export { PersonalInput } from "./personal-input";
export { ProjectInput } from "./project-input";
export { SkillsInput } from "./skills-input";
export { UploadDropzone } from "./upload-dropzone";
export { UploadedFilesList, UploadedFileCard, FullscreenImagePreview } from "./uploaded-files-list";

// Service selection components
export { ServiceCard } from "./service-card";

// Results components
export { ResumeGrade } from "./resume-grade";
export { ResumeComment } from "./resume-comment";
export { ResumeHighlightsIssuesSection } from './resume-highlights-issues-section';

// Preview components
export { default as ResumePreview } from "./resume-preview";
export { default as ResumeHeader } from "./resume-header";
export { default as ResumeSection } from "./resume-section";
export { renderSection, SECTION_REGISTRY, registerSection, getSectionComponent, isSectionRegistered, getRegisteredSections } from "./section-registry";
export { ActionSidebar } from "./action-sidebar";
export { BulletFocusProvider } from "./bullet-focus-provider";
export { default as InlineText } from "./inline-text";

// Section components
export { default as EducationSection } from "./education-section";
export { default as ExperienceSection } from "./experience-section";
export { default as ProjectsSection } from "./projects-section";
export { default as SkillsSection } from "./skills-section";
export { default as SummarySection } from "./summary-section";
export { default as AchievementsSection } from "./achievements-section";

// Edit dialogs - base components
export { default as BaseEditDialog } from './base-edit-dialog';
export { default as EditableItemWrapper } from './editable-item-wrapper';
export { default as FormTips } from './form-tips';

// Edit dialogs - specific dialogs
export { default as EducationEditDialog } from './education-edit-dialog';
export { default as ExperienceEditDialog } from './experience-edit-dialog';
export { default as ProjectsEditDialog } from './projects-edit-dialog';
export { default as SkillsEditDialog } from './skills-edit-dialog';
export { default as SummaryEditDialog } from './summary-edit-dialog';

// Edit dialog manager
export { useEditDialogManager } from './edit-dialog-manager';
export type { SectionName, EditDialogManagerProps } from './edit-dialog-manager';

// Bullet system
export { default as BulletText } from './bullet-text';
export { BulletManager } from '../lib/bullet-manager';
export { useBulletPoint } from '../hooks/use-bullet-point';
export type { BulletPoint, BulletGroup } from '../lib/bullet-manager';

// Highlights
export { default as InlineHighlightPreview } from "./inline-highlight-preview";