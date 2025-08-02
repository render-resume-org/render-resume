import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import BaseEditDialog from "./base-edit-dialog";
import EditableItemWrapper from "./editable-item-wrapper";
import FormTips from "./form-tips";

interface Experience {
  title: string;
  company: string;
  period: string;
  achievements: string[];
}

interface ExperienceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience[]) => void;
  currentExperience: Experience[];
}

export default function ExperienceEditDialog({
  isOpen,
  onClose,
  onSave,
  currentExperience,
}: ExperienceEditDialogProps) {
  const [experience, setExperience] = useState<Experience[]>(currentExperience);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(experience);
      onClose();
    } catch (error) {
      console.error('Failed to save experience:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setExperience(currentExperience); // Reset to original value
    onClose();
  };

  const addExperience = () => {
    setExperience([...experience, { title: '', company: '', period: '', achievements: [] }]);
  };

  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    const newExperience = [...experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setExperience(newExperience);
  };

  const addAchievement = (experienceIndex: number) => {
    const newExperience = [...experience];
    newExperience[experienceIndex].achievements.push('');
    setExperience(newExperience);
  };

  const removeAchievement = (experienceIndex: number, achievementIndex: number) => {
    const newExperience = [...experience];
    newExperience[experienceIndex].achievements.splice(achievementIndex, 1);
    setExperience(newExperience);
  };

  const updateAchievement = (experienceIndex: number, achievementIndex: number, achievement: string) => {
    const newExperience = [...experience];
    newExperience[experienceIndex].achievements[achievementIndex] = achievement;
    setExperience(newExperience);
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newExperience = [...experience];
    const item = newExperience[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newExperience.length) {
      return;
    }

    newExperience[index] = newExperience[swapIndex];
    newExperience[swapIndex] = item;
    setExperience(newExperience);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      title="編輯工作經驗"
      description="管理您的工作經驗，包括職位、公司、時間和成就。"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {experience.map((exp, expIndex) => (
          <EditableItemWrapper
            key={expIndex}
            title={`工作經驗 #${expIndex + 1}`}
            onRemove={() => removeExperience(expIndex)}
            onMoveUp={() => moveExperience(expIndex, 'up')}
            onMoveDown={() => moveExperience(expIndex, 'down')}
            isFirst={expIndex === 0}
            isLast={expIndex === experience.length - 1}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  職位名稱
                </label>
                <Input
                  value={exp.title}
                  onChange={(e) => updateExperience(expIndex, 'title', e.target.value)}
                  placeholder="例如: 前端工程師"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  公司名稱
                </label>
                <Input
                  value={exp.company}
                  onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
                  placeholder="例如: Google Inc."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  工作期間
                </label>
                <Input
                  value={exp.period}
                  onChange={(e) => updateExperience(expIndex, 'period', e.target.value)}
                  placeholder="例如: 2020年3月 - 2023年6月"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  工作成就
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addAchievement(expIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增成就
                </Button>
              </div>

              {exp.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex items-start space-x-2">
                  <Textarea
                    value={achievement}
                    onChange={(e) => updateAchievement(expIndex, achievementIndex, e.target.value)}
                    placeholder="描述您的工作成就和貢獻..."
                    className="flex-1 min-h-[80px]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAchievement(expIndex, achievementIndex)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 mt-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </EditableItemWrapper>
        ))}

        <Button
          variant="outline"
          onClick={addExperience}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增工作經驗
        </Button>

        <FormTips
          tips={[
            "使用具體的數字和成果來描述成就",
            "突出與目標職位相關的經驗",
            "使用積極的動詞開頭（如：開發、管理、提升）",
            "按時間順序排列，最新的經驗在前",
          ]}
        />
      </div>
    </BaseEditDialog>
  );
} 