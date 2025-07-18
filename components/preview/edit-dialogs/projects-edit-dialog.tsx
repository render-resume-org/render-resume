import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import BaseEditDialog from "./base-edit-dialog";
import EditableItemWrapper from "./editable-item-wrapper";
import FormTips from "./form-tips";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
  duration?: string;
}

interface ProjectsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projects: Project[]) => void;
  currentProjects: Project[];
}

export default function ProjectsEditDialog({
  isOpen,
  onClose,
  onSave,
  currentProjects,
}: ProjectsEditDialogProps) {
  const [projects, setProjects] = useState<Project[]>(currentProjects);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(projects);
      onClose();
    } catch (error) {
      console.error('Failed to save projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setProjects(currentProjects); // Reset to original value
    onClose();
  };

  const addProject = () => {
    setProjects([...projects, { name: '', description: '', technologies: [], achievements: [] }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const addTechnology = (projectIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies.push('');
    setProjects(newProjects);
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies.splice(techIndex, 1);
    setProjects(newProjects);
  };

  const updateTechnology = (projectIndex: number, techIndex: number, technology: string) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies[techIndex] = technology;
    setProjects(newProjects);
  };

  const addAchievement = (projectIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].achievements.push('');
    setProjects(newProjects);
  };

  const removeAchievement = (projectIndex: number, achievementIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].achievements.splice(achievementIndex, 1);
    setProjects(newProjects);
  };

  const updateAchievement = (projectIndex: number, achievementIndex: number, achievement: string) => {
    const newProjects = [...projects];
    newProjects[projectIndex].achievements[achievementIndex] = achievement;
    setProjects(newProjects);
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const item = newProjects[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newProjects.length) {
      return;
    }

    newProjects[index] = newProjects[swapIndex];
    newProjects[swapIndex] = item;
    setProjects(newProjects);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      title="編輯專案經驗"
      description="管理您的專案經驗，包括專案名稱、描述、技術棧和成就。"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {projects.map((project, projectIndex) => (
          <EditableItemWrapper
            key={projectIndex}
            title={`專案 #${projectIndex + 1}`}
            onRemove={() => removeProject(projectIndex)}
            onMoveUp={() => moveProject(projectIndex, 'up')}
            onMoveDown={() => moveProject(projectIndex, 'down')}
            isFirst={projectIndex === 0}
            isLast={projectIndex === projects.length - 1}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  專案名稱
                </label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(projectIndex, 'name', e.target.value)}
                  placeholder="例如: 電商網站"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  專案時長
                </label>
                <Input
                  value={project.duration || ''}
                  onChange={(e) => updateProject(projectIndex, 'duration', e.target.value)}
                  placeholder="例如: 3個月"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  專案描述
                </label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(projectIndex, 'description', e.target.value)}
                  placeholder="簡要描述專案的目的、功能和您的角色..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    使用技術
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTechnology(projectIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新增技術
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <div key={techIndex} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                      <Input
                        value={tech}
                        onChange={(e) => updateTechnology(projectIndex, techIndex, e.target.value)}
                        placeholder="技術名稱"
                        className="w-20 h-6 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTechnology(projectIndex, techIndex)}
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    專案成就
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(projectIndex)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    新增成就
                  </Button>
                </div>

                {project.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-start space-x-2">
                    <Textarea
                      value={achievement}
                      onChange={(e) => updateAchievement(projectIndex, achievementIndex, e.target.value)}
                      placeholder="描述您在專案中的具體貢獻和成果..."
                      className="flex-1 min-h-[80px]"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAchievement(projectIndex, achievementIndex)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </EditableItemWrapper>
        ))}

        <Button
          variant="outline"
          onClick={addProject}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增專案
        </Button>

        <FormTips
          title="專案經驗撰寫建議："
          tips={[
            "突出您在專案中的具體角色和貢獻",
            "包含使用的技術棧和工具",
            "描述專案的成果和影響",
            "展示您的技術能力和解決問題的能力",
          ]}
        />
      </div>
    </BaseEditDialog>
  );
} 