import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OptimizedResume } from '@/lib/types/resume';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import BaseEditDialog from './base-edit-dialog';

interface ProjectsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projects: OptimizedResume['projects']) => void;
  currentProjects: OptimizedResume['projects'];
}

export default function ProjectsEditDialog({
  isOpen,
  onClose,
  onSave,
  currentProjects,
}: ProjectsEditDialogProps) {
  const [projects, setProjects] = useState(currentProjects || []);

  const addProject = () => {
    setProjects([...projects, {
      name: '',
      period: '',
      achievements: [],
    }]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: string, value: unknown) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const addAchievement = (projectIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].achievements.push('');
    setProjects(updatedProjects);
  };

  const removeAchievement = (projectIndex: number, achievementIndex: number) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].achievements.splice(achievementIndex, 1);
    setProjects(updatedProjects);
  };

  const updateAchievement = (projectIndex: number, achievementIndex: number, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[projectIndex].achievements[achievementIndex] = value;
    setProjects(updatedProjects);
  };

  const handleSave = () => {
    const filteredProjects = projects.filter(project => 
      project.name.trim()
    );
    
    onSave(filteredProjects);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      title="編輯專案"
      onSave={handleSave}
      onClose={onClose}
    >
      <div className="space-y-6">
        {projects.map((project, projectIndex) => (
          <div key={projectIndex} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">專案 {projectIndex + 1}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(projectIndex)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`project-name-${projectIndex}`}>專案名稱</Label>
                <Input
                  id={`project-name-${projectIndex}`}
                  value={project.name}
                  onChange={(e) => updateProject(projectIndex, 'name', e.target.value)}
                  placeholder="例如：電商網站開發"
                />
              </div>

              <div>
                <Label htmlFor={`project-period-${projectIndex}`}>專案期間</Label>
                <Input
                  id={`project-period-${projectIndex}`}
                  value={project.period || ''}
                  onChange={(e) => updateProject(projectIndex, 'period', e.target.value)}
                  placeholder="例如：2023.01 - 2023.06"
                />
              </div>

              <div>
                <Label>主要成就</Label>
                <div className="space-y-2">
                  {project.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-center space-x-2">
                      <Textarea
                        value={achievement}
                        onChange={(e) => updateAchievement(projectIndex, achievementIndex, e.target.value)}
                        placeholder="描述您在專案中的具體貢獻和成果"
                        className="flex-1 min-h-[60px]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAchievement(projectIndex, achievementIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addAchievement(projectIndex)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增成就
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addProject}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增專案
        </Button>
      </div>
    </BaseEditDialog>
  );
} 