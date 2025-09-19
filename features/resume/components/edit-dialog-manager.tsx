import { OptimizedResume } from "@/types/resume";
import { useState } from "react";
import { toast } from "sonner";
import EducationEditDialog from "./education-edit-dialog";
import ExperienceEditDialog from "./experience-edit-dialog";
import ProjectsEditDialog from "./projects-edit-dialog";
import SkillsEditDialog from "./skills-edit-dialog";
import SummaryEditDialog from "./summary-edit-dialog";

export type SectionName = 'summary' | 'skills' | 'experience' | 'projects' | 'education';

export interface EditDialogManagerProps {
  resumeData: OptimizedResume;
  onUpdateResume: (updatedResume: OptimizedResume) => void;
}

interface EditDialogState {
  isOpen: boolean;
  sectionName: SectionName | null;
}

export function useEditDialogManager({ resumeData, onUpdateResume }: EditDialogManagerProps) {
  const [editDialogState, setEditDialogState] = useState<EditDialogState>({
    isOpen: false,
    sectionName: null,
  });

  const openEditDialog = (sectionName: SectionName) => {
    setEditDialogState({ isOpen: true, sectionName });
  };

  const closeEditDialog = () => {
    setEditDialogState({ isOpen: false, sectionName: null });
  };

  const handleSave = async (
    sectionName: SectionName,
    data:
      | OptimizedResume['summary']
      | OptimizedResume['skills']
      | OptimizedResume['experience']
      | OptimizedResume['projects']
      | OptimizedResume['education']
  ) => {
    try {
      const updatedResume = { ...resumeData };

      switch (sectionName) {
        case 'summary':
          if (typeof data === 'string') {
            updatedResume.summary = data;
          }
          break;
        case 'skills':
          if (Array.isArray(data)) {
            updatedResume.skills = data as OptimizedResume['skills'];
          }
          break;
        case 'experience':
          if (Array.isArray(data)) {
            updatedResume.experience = data as OptimizedResume['experience'];
          }
          break;
        case 'projects':
          if (Array.isArray(data)) {
            updatedResume.projects = data as OptimizedResume['projects'];
          }
          break;
        case 'education':
          if (Array.isArray(data)) {
            updatedResume.education = data as OptimizedResume['education'];
          }
          break;
      }

      onUpdateResume(updatedResume);
      toast.success("區段內容已成功更新！");
    } catch (error) {
      console.error('Failed to update resume:', error);
      toast.error("更新失敗，請稍後再試");
    }
  };

  const renderEditDialog = () => {
    if (!editDialogState.isOpen || !editDialogState.sectionName) {
      return null;
    }

    const sectionName = editDialogState.sectionName;

    switch (sectionName) {
      case 'summary':
        return (
          <SummaryEditDialog
            isOpen={editDialogState.isOpen}
            onClose={closeEditDialog}
            onSave={(data) => handleSave(sectionName, data)}
            currentSummary={resumeData.summary}
          />
        );

      case 'skills':
        return (
          <SkillsEditDialog
            isOpen={editDialogState.isOpen}
            onClose={closeEditDialog}
            onSave={(data) => handleSave(sectionName, data)}
            currentSkills={resumeData.skills}
          />
        );

      case 'experience':
        return (
          <ExperienceEditDialog
            isOpen={editDialogState.isOpen}
            onClose={closeEditDialog}
            onSave={(data) => handleSave(sectionName, data)}
            currentExperience={resumeData.experience}
          />
        );

      case 'projects':
        return (
          <ProjectsEditDialog
            isOpen={editDialogState.isOpen}
            onClose={closeEditDialog}
            onSave={(data) => handleSave(sectionName, data)}
            currentProjects={resumeData.projects}
          />
        );

      case 'education':
        return (
          <EducationEditDialog
            isOpen={editDialogState.isOpen}
            onClose={closeEditDialog}
            onSave={(data) => handleSave(sectionName, data)}
            currentEducation={resumeData.education}
          />
        );

      default:
        return null;
    }
  };

  return {
    openEditDialog,
    closeEditDialog,
    renderEditDialog,
  };
}
