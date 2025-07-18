import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import BaseEditDialog from "./base-edit-dialog";
import EditableItemWrapper from "./editable-item-wrapper";
import FormTips from "./form-tips";

interface Education {
  degree: string;
  school: string;
  period: string;
  details?: string[];
}

interface EducationEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education[]) => void;
  currentEducation: Education[];
}

export default function EducationEditDialog({
  isOpen,
  onClose,
  onSave,
  currentEducation,
}: EducationEditDialogProps) {
  const [education, setEducation] = useState<Education[]>(currentEducation);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(education);
      onClose();
    } catch (error) {
      console.error('Failed to save education:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEducation(currentEducation); // Reset to original value
    onClose();
  };

  const addEducation = () => {
    setEducation([...education, { degree: '', school: '', period: '', details: [] }]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: string | string[]) => {
    const newEducation = [...education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEducation(newEducation);
  };

  const addDetail = (educationIndex: number) => {
    const newEducation = [...education];
    if (!newEducation[educationIndex].details) {
      newEducation[educationIndex].details = [];
    }
    newEducation[educationIndex].details!.push('');
    setEducation(newEducation);
  };

  const removeDetail = (educationIndex: number, detailIndex: number) => {
    const newEducation = [...education];
    if (newEducation[educationIndex].details) {
      newEducation[educationIndex].details!.splice(detailIndex, 1);
    }
    setEducation(newEducation);
  };

  const updateDetail = (educationIndex: number, detailIndex: number, detail: string) => {
    const newEducation = [...education];
    if (newEducation[educationIndex].details) {
      newEducation[educationIndex].details![detailIndex] = detail;
    }
    setEducation(newEducation);
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newEducation = [...education];
    const item = newEducation[index];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    if (swapIndex < 0 || swapIndex >= newEducation.length) {
      return;
    }

    newEducation[index] = newEducation[swapIndex];
    newEducation[swapIndex] = item;
    setEducation(newEducation);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      title="編輯教育背景"
      description="管理您的教育背景，包括學位、學校、時間和相關細節。"
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {education.map((edu, eduIndex) => (
          <EditableItemWrapper
            key={eduIndex}
            title={`教育背景 #${eduIndex + 1}`}
            onRemove={() => removeEducation(eduIndex)}
            onMoveUp={() => moveEducation(eduIndex, 'up')}
            onMoveDown={() => moveEducation(eduIndex, 'down')}
            isFirst={eduIndex === 0}
            isLast={eduIndex === education.length - 1}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  學位/證書
                </label>
                <Input
                  value={edu.degree}
                  onChange={(e) => updateEducation(eduIndex, 'degree', e.target.value)}
                  placeholder="例如: 資訊工程學士"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  學校名稱
                </label>
                <Input
                  value={edu.school}
                  onChange={(e) => updateEducation(eduIndex, 'school', e.target.value)}
                  placeholder="例如: 國立台灣大學"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  就學期間
                </label>
                <Input
                  value={edu.period}
                  onChange={(e) => updateEducation(eduIndex, 'period', e.target.value)}
                  placeholder="例如: 2018年9月 - 2022年6月"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  相關細節
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addDetail(eduIndex)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增細節
                </Button>
              </div>

              {edu.details && edu.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex items-start space-x-2">
                  <Textarea
                    value={detail}
                    onChange={(e) => updateDetail(eduIndex, detailIndex, e.target.value)}
                    placeholder="例如: GPA 3.8/4.0、主修課程、相關專案..."
                    className="flex-1 min-h-[60px]"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDetail(eduIndex, detailIndex)}
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
          onClick={addEducation}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增教育背景
        </Button>

        <FormTips
          title="教育背景撰寫建議："
          tips={[
            "包含完整的學位名稱和學校名稱",
            "列出相關的課程、專案或成就",
            "突出與目標職位相關的學術背景",
            "按時間順序排列，最新的學歷在前",
          ]}
        />
      </div>
    </BaseEditDialog>
  );
} 