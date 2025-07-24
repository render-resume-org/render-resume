import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Experience } from "@/lib/upload-utils";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import React, { useCallback, useState } from "react";

const MONTH_OPTIONS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const YEAR_OPTIONS = Array.from({ length: 80 }, (_, i) => `${2030 - i}`);

type Props = {
  value: Experience[];
  onChange: (value: Experience[]) => void;
};

const ExperienceInputComponent: React.FC<Props> = ({ value, onChange }) => {
  // 新增錯誤狀態
  const [errors, setErrors] = useState<{ company: boolean; position: boolean; location: boolean; description: boolean; startMonth: boolean; startYear: boolean; endMonth: boolean; endYear: boolean }[]>([]);

  const handleFieldChange = useCallback((idx: number, field: keyof Experience, fieldValue: string | boolean) => {
    const newValue = value.map((item, i) => {
      if (i === idx) {
        const updatedItem = { ...item, [field]: fieldValue };
        // 如果勾選了「目前在此公司工作」，清空結束時間
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
        // 如果勾選了「目前在此公司工作」，同時清除結束時間的錯誤
        if (field === 'isCurrent' && fieldValue === true) {
          newErrors[idx] = { ...newErrors[idx], endMonth: false, endYear: false };
        }
      }
      return newErrors;
    });
  }, [value, onChange]);

  const handleAdd = useCallback(() => {
    // 檢查所有工作經歷欄位
    const newErrors = value.map(exp => ({
      company: !exp.company || !exp.company.trim(),
      position: !exp.position || !exp.position.trim(),
      location: !exp.location || !exp.location.trim(),
      description: !exp.description || !exp.description.trim(),
      startMonth: !exp.startMonth || !exp.startMonth.trim(),
      startYear: !exp.startYear || !exp.startYear.trim(),
      endMonth: exp.isCurrent ? false : (!exp.endMonth || !exp.endMonth.trim()),
      endYear: exp.isCurrent ? false : (!exp.endYear || !exp.endYear.trim()),
    }));
    const hasError = newErrors.some(e => e.company || e.position || e.location || e.description || e.startMonth || e.startYear || e.endMonth || e.endYear);
    setErrors(newErrors);
    if (hasError) return;
    // 若無錯誤才新增
    onChange([
      ...value,
      { 
        company: "", 
        position: "", 
        location: "",
        description: "", 
        startMonth: "", 
        startYear: "", 
        endMonth: "", 
        endYear: "", 
        isCurrent: false 
      }
    ]);
    setErrors([...newErrors, { company: false, position: false, location: false, description: false, startMonth: false, startYear: false, endMonth: false, endYear: false }]);
  }, [value, onChange]);

  const handleRemove = useCallback((idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  }, [value, onChange]);

  // 統一 input/Select 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 mb-1";

  return (
    <div className="mb-8">
      {value.map((exp, idx) => (
        <Card key={idx} className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-900">工作經歷 {idx + 1}</span>
              {value.length > 1 && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleRemove(idx)}
                  aria-label="Remove experience"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* Position */}
            <div className="mb-4">
              <label className={labelClass}>職稱 <span className="text-red-500">*</span></label>
              <input
                className={fieldClass}
                value={exp.position}
                onChange={e => handleFieldChange(idx, "position", e.target.value)}
                required
                placeholder="職稱"
              />
              {errors[idx]?.position && (
                <div className="text-red-500 text-sm mt-1">必須填寫</div>
              )}
            </div>
            {/* Company Name and Location */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>公司名稱 <span className="text-red-500">*</span></label>
                <input
                  className={fieldClass}
                  value={exp.company}
                  onChange={e => handleFieldChange(idx, "company", e.target.value)}
                  required
                  placeholder="公司名稱"
                />
                {errors[idx]?.company && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelClass}>地點 <span className="text-red-500">*</span></label>
                <input
                  className={fieldClass}
                  value={exp.location}
                  onChange={e => handleFieldChange(idx, "location", e.target.value)}
                  required
                  placeholder="地點"
                />
                {errors[idx]?.location && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
            </div>
            {/* Description */}
            <div className="mb-4">
              <label className={labelClass}>經歷描述 <span className="text-red-500">*</span></label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base min-h-[80px] resize-vertical"
                value={exp.description}
                onChange={e => handleFieldChange(idx, "description", e.target.value)}
                required
                placeholder="請描述您的工作內容和成果"
              />
              {errors[idx]?.description && (
                <div className="text-red-500 text-sm mt-1">必須填寫</div>
              )}
            </div>
            {/* Current Position Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={e => handleFieldChange(idx, "isCurrent", e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">目前在此公司工作</span>
              </label>
            </div>
            {/* Dates row */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>開始月份 <span className="text-red-500">*</span></label>
                <Select
                  value={exp.startMonth || ""}
                  onValueChange={v => handleFieldChange(idx, "startMonth", v)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
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
                  value={exp.startYear || ""}
                  onValueChange={v => handleFieldChange(idx, "startYear", v)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
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
                <label className={cn(labelClass, exp.isCurrent && "text-gray-500 dark:text-gray-400")}>結束月份 {!exp.isCurrent && <span className="text-red-500">*</span>}</label>
                <Select
                  value={exp.endMonth || ""}
                  onValueChange={v => handleFieldChange(idx, "endMonth", v)}
                  disabled={exp.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, exp.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
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
                <label className={cn(labelClass, exp.isCurrent && "text-gray-500 dark:text-gray-400")}>結束年份 {!exp.isCurrent && <span className="text-red-500">*</span>}</label>
                <Select
                  value={exp.endYear || ""}
                  onValueChange={v => handleFieldChange(idx, "endYear", v)}
                  disabled={exp.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, exp.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
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
        <Plus className="w-5 h-5" /> 新增工作經歷
      </Button>
    </div>
  );
};

export const ExperienceInput = React.memo(ExperienceInputComponent); 