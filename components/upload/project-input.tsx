import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/lib/upload-utils";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import React, { useCallback, useState } from "react";

const MONTH_OPTIONS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const YEAR_OPTIONS = Array.from({ length: 80 }, (_, i) => `${2030 - i}`);

type Props = {
  value: Project[];
  onChange: (value: Project[]) => void;
};

const ProjectInputComponent: React.FC<Props> = ({ value, onChange }) => {
  // 新增錯誤狀態
  const [errors, setErrors] = useState<{ name: boolean; description: boolean; startMonth: boolean; startYear: boolean; endMonth: boolean; endYear: boolean }[]>([]);

  const handleFieldChange = useCallback((idx: number, field: keyof Project, fieldValue: string | boolean) => {
    const newValue = value.map((item, i) => {
      if (i === idx) {
        const updatedItem = { ...item, [field]: fieldValue };
        // 如果勾選了「專案進行中」，清空結束時間
        if (field === 'isCurrent' && fieldValue === true) {
          updatedItem.endMonth = "";
          updatedItem.endYear = "";
        }
        return updatedItem;
      }
      return item;
    });
    onChange(newValue);
    // 清除該欄位錯誤
    setErrors(prev => {
      const newErrors = [...prev];
      if (newErrors[idx]) {
        newErrors[idx] = { ...newErrors[idx], [field]: false };
        // 如果勾選了「專案進行中」，同時清除結束時間的錯誤
        if (field === 'isCurrent' && fieldValue === true) {
          newErrors[idx] = { ...newErrors[idx], endMonth: false, endYear: false };
        }
      }
      return newErrors;
    });
  }, [value, onChange]);

  const handleAdd = useCallback(() => {
    // 檢查所有專案欄位
    const newErrors = value.map(project => ({
      name: !project.name || !project.name.trim(),
      description: !project.description || !project.description.trim(),
      startMonth: !project.startMonth || !project.startMonth.trim(),
      startYear: !project.startYear || !project.startYear.trim(),
      endMonth: project.isCurrent ? false : (!project.endMonth || !project.endMonth.trim()),
      endYear: project.isCurrent ? false : (!project.endYear || !project.endYear.trim()),
    }));
    const hasError = newErrors.some(e => e.name || e.description || e.startMonth || e.startYear || e.endMonth || e.endYear);
    setErrors(newErrors);
    if (hasError) return;
    // 若無錯誤才新增
    onChange([
      ...value,
      { 
        name: "", 
        description: "", 
        startMonth: "", 
        startYear: "", 
        endMonth: "", 
        endYear: "", 
        isCurrent: false 
      }
    ]);
    setErrors([...newErrors, { name: false, description: false, startMonth: false, startYear: false, endMonth: false, endYear: false }]);
  }, [value, onChange]);

  const handleRemove = useCallback((idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  }, [value, onChange]);

  // 統一 input/Select 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 mb-1";

  return (
    <div className="mb-8">
      {value.map((project, idx) => (
        <Card key={idx} className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-900">專案經歷 {idx + 1}</span>
              {value.length > 1 && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleRemove(idx)}
                  aria-label="Remove project"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Project Name */}
            <div className="mb-4">
              <label className={labelClass}>專案名稱 <span className="text-red-500">*</span></label>
              <input
                className={fieldClass}
                value={project.name}
                onChange={e => handleFieldChange(idx, "name", e.target.value)}
                required
                placeholder="專案名稱"
              />
              {errors[idx]?.name && (
                <div className="text-red-500 text-sm mt-1">必須填寫</div>
              )}
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className={labelClass}>經歷描述 <span className="text-red-500">*</span></label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base min-h-[80px] resize-vertical"
                value={project.description}
                onChange={e => handleFieldChange(idx, "description", e.target.value)}
                required
                placeholder="請描述您的專案內容和成果"
              />
              {errors[idx]?.description && (
                <div className="text-red-500 text-sm mt-1">必須填寫</div>
              )}
            </div>
            {/* Current Project Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={project.isCurrent}
                  onChange={e => handleFieldChange(idx, "isCurrent", e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">專案進行中</span>
              </label>
            </div>
            {/* Dates row */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>開始月份 <span className="text-red-500">*</span></label>
                <Select
                  value={project.startMonth || ""}
                  onValueChange={v => handleFieldChange(idx, "startMonth", v)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[idx]?.startMonth && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelClass}>開始年份 <span className="text-red-500">*</span></label>
                <Select
                  value={project.startYear || ""}
                  onValueChange={v => handleFieldChange(idx, "startYear", v)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[idx]?.startYear && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={cn(labelClass, project.isCurrent && "text-gray-500 dark:text-gray-400")}>結束月份</label>
                <Select
                  value={project.endMonth || ""}
                  onValueChange={v => handleFieldChange(idx, "endMonth", v)}
                  disabled={project.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, project.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[idx]?.endMonth && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={cn(labelClass, project.isCurrent && "text-gray-500 dark:text-gray-400")}>結束年份</label>
                <Select
                  value={project.endYear || ""}
                  onValueChange={v => handleFieldChange(idx, "endYear", v)}
                  disabled={project.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, project.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[idx]?.endYear && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-2 border-gray-300 text-gray-700 mt-2 flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
        onClick={handleAdd}
      >
        <Plus className="w-5 h-5" /> 新增專案經歷
      </Button>
    </div>
  );
};

export const ProjectInput = React.memo(ProjectInputComponent); 