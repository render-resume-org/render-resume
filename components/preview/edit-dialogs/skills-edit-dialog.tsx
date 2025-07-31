import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OptimizedResume } from '@/lib/types/resume';
import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import BaseEditDialog from './base-edit-dialog';

interface SkillsEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skills: OptimizedResume['skills']) => void;
  currentSkills: OptimizedResume['skills'];
}

export default function SkillsEditDialog({
  isOpen,
  onClose,
  onSave,
  currentSkills,
}: SkillsEditDialogProps) {
  const [skills, setSkills] = useState(currentSkills || []);

  const addSkillGroup = () => {
    setSkills([...skills, { category: '', items: [] }]);
  };

  const removeSkillGroup = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const updateSkillGroup = (index: number, category: string, items: string[]) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = { category, items };
    setSkills(updatedSkills);
  };

  const addSkillItem = (groupIndex: number) => {
    const updatedSkills = [...skills];
    updatedSkills[groupIndex].items.push('');
    setSkills(updatedSkills);
  };

  const removeSkillItem = (groupIndex: number, itemIndex: number) => {
    const updatedSkills = [...skills];
    updatedSkills[groupIndex].items.splice(itemIndex, 1);
    setSkills(updatedSkills);
  };

  const updateSkillItem = (groupIndex: number, itemIndex: number, value: string) => {
    const updatedSkills = [...skills];
    updatedSkills[groupIndex].items[itemIndex] = value;
    setSkills(updatedSkills);
  };

  const handleSave = () => {
    const filteredSkills = skills.filter(group => 
      group.category.trim() && group.items.some(item => item.trim())
    );
    
    onSave(filteredSkills);
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      title="編輯技能"
      onSave={handleSave}
      onClose={onClose}
    >
      <div className="space-y-4">
        {skills.map((skillGroup, groupIndex) => (
          <Card key={groupIndex}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">技能分類 {groupIndex + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkillGroup(groupIndex)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor={`category-${groupIndex}`}>分類名稱</Label>
                <Input
                  id={`category-${groupIndex}`}
                  value={skillGroup.category}
                  onChange={(e) => updateSkillGroup(groupIndex, e.target.value, skillGroup.items)}
                  placeholder="例如：程式語言、工具軟體"
                />
              </div>
              
              <div>
                <Label>技能項目</Label>
                <div className="space-y-2">
                  {skillGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      <Input
                        value={item}
                        onChange={(e) => updateSkillItem(groupIndex, itemIndex, e.target.value)}
                        placeholder="輸入技能名稱"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkillItem(groupIndex, itemIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkillItem(groupIndex)}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    新增技能項目
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          variant="outline"
          onClick={addSkillGroup}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          新增技能分類
        </Button>
      </div>
    </BaseEditDialog>
  );
} 