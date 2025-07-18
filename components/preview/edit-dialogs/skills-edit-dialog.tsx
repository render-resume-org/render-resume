import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import BaseEditDialog from "./base-edit-dialog";
import FormTips from "./form-tips";

interface SkillCategory {
  category: string;
  items: string[];
}

interface SkillsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skills: SkillCategory[]) => void;
  currentSkills: SkillCategory[];
}

export default function SkillsEditDialog({
  isOpen,
  onClose,
  onSave,
  currentSkills,
}: SkillsEditDialogProps) {
  const [skills, setSkills] = useState<SkillCategory[]>(currentSkills);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(skills);
      onClose();
    } catch (error) {
      console.error('Failed to save skills:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSkills(currentSkills); // Reset to original value
    onClose();
  };

  const addCategory = () => {
    setSkills([...skills, { category: '', items: [] }]);
  };

  const removeCategory = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, category: string) => {
    const newSkills = [...skills];
    newSkills[index].category = category;
    setSkills(newSkills);
  };

  const addSkill = (categoryIndex: number) => {
    const newSkills = [...skills];
    newSkills[categoryIndex].items.push('');
    setSkills(newSkills);
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const newSkills = [...skills];
    newSkills[categoryIndex].items.splice(skillIndex, 1);
    setSkills(newSkills);
  };

  const updateSkill = (categoryIndex: number, skillIndex: number, skill: string) => {
    const newSkills = [...skills];
    newSkills[categoryIndex].items[skillIndex] = skill;
    setSkills(newSkills);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      title="編輯技能"
      description="管理您的技能分類和具體技能項目。"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {skills.map((category, categoryIndex) => (
          <div key={categoryIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <Input
                value={category.category}
                onChange={(e) => updateCategory(categoryIndex, e.target.value)}
                placeholder="技能分類 (例如: 程式語言、框架、工具...)"
                className="flex-1 mr-2"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCategory(categoryIndex)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {category.items.map((skill, skillIndex) => (
                <div key={skillIndex} className="flex items-center space-x-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(categoryIndex, skillIndex, e.target.value)}
                    placeholder="技能名稱"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(categoryIndex, skillIndex)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSkill(categoryIndex)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                新增技能
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCategory}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增技能分類
        </Button>

        <FormTips
          title="技能管理建議："
          tips={[
            "按技術領域或熟練程度分類",
            "包含相關的技術、工具和框架",
            "突出與目標職位相關的技能",
            "保持技能列表的時效性和準確性",
          ]}
        />
      </div>
    </BaseEditDialog>
  );
} 