import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useState, useCallback, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Education } from "@/lib/upload-utils";

const DEGREE_OPTIONS = ["學士", "碩士", "博士"];
const MONTH_OPTIONS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const YEAR_OPTIONS = Array.from({ length: 80 }, (_, i) => `${2030 - i}`);

type Props = {
  value: Education[];
  onChange: (value: Education[]) => void;
};

export const EducationInput: React.FC<Props> = React.memo(({ value, onChange }) => {
  // 新增錯誤狀態
  const [errors, setErrors] = useState<{ school: boolean; major: boolean; degree: boolean }[]>([]);

  const handleFieldChange = useCallback((idx: number, field: keyof Education, fieldValue: string | boolean) => {
    const newValue = value.map((item, i) => {
      if (i === idx) {
        const updatedItem = { ...item, [field]: fieldValue };
        // 如果勾選了「目前在此學校就讀」，清空結束時間
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
      }
      return newErrors;
    });
  }, [value, onChange]);

  const handleAdd = useCallback(() => {
    // 檢查所有學歷欄位
    const newErrors = value.map(edu => ({
      school: !edu.school || !edu.school.trim(),
      major: !edu.major || !edu.major.trim(),
      degree: !edu.degree || !edu.degree.trim(),
    }));
    const hasError = newErrors.some(e => e.school || e.major || e.degree);
    setErrors(newErrors);
    if (hasError) return;
    // 若無錯誤才新增
    onChange([
      ...value,
      { school: "", major: "", degree: "", gpa: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false }
    ]);
    setErrors([...newErrors, { school: false, major: false, degree: false }]);
  }, [value, onChange]);

  const handleRemove = useCallback((idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  }, [value, onChange]);

  // 統一 input/Select 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 mb-1";

  // 新增學歷按鈕是否可點擊
  const canAdd = useMemo(() => {
    return value.every(
      (edu) => edu.school.trim() && edu.major.trim() && edu.degree && edu.degree.trim()
    );
  }, [value]);

  return (
    <div className="mb-8">
      {value.map((edu, idx) => (
        <Card key={idx} className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-900">學歷 {idx + 1}</span>
              {value.length > 1 && (
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => handleRemove(idx)}
                  aria-label="Remove education"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {/* School Name */}
            <div className="mb-4">
              <label className={labelClass}>學校名稱</label>
              <input
                className={fieldClass}
                value={edu.school}
                onChange={e => handleFieldChange(idx, "school", e.target.value)}
                required
                placeholder="學校名稱"
              />
              {errors[idx]?.school && (
                <div className="text-red-500 text-sm mt-1">必須填寫</div>
              )}
            </div>
            {/* Major, Degree, GPA row */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>主修</label>
                <input
                  className={fieldClass}
                  value={edu.major}
                  onChange={e => handleFieldChange(idx, "major", e.target.value)}
                  required
                  placeholder="主修"
                />
                {errors[idx]?.major && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelClass}>學位類型</label>
                <Select
                  value={edu.degree || ""}
                  onValueChange={v => handleFieldChange(idx, "degree", v)}
                >
                  <SelectTrigger className={fieldClass}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEGREE_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[idx]?.degree && (
                  <div className="text-red-500 text-sm mt-1">必須填寫</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelClass}>GPA</label>
                <input
                  className={fieldClass}
                  value={edu.gpa}
                  onChange={e => handleFieldChange(idx, "gpa", e.target.value)}
                  placeholder="GPA"
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                />
              </div>
            </div>
            {/* Current Education Checkbox */}
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={edu.isCurrent || false}
                  onChange={e => handleFieldChange(idx, "isCurrent", e.target.checked)}
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">目前在此學校就讀</span>
              </label>
            </div>
            {/* Dates row */}
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <label className={labelClass}>開始月份</label>
                <Select
                  value={edu.startMonth || ""}
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
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelClass}>開始年份</label>
                <Select
                  value={edu.startYear || ""}
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
              </div>
              <div className="flex-1 min-w-0">
                <label className={cn(labelClass, edu.isCurrent && "text-gray-500 dark:text-gray-400")}>結束月份</label>
                <Select
                  value={edu.endMonth || ""}
                  onValueChange={v => handleFieldChange(idx, "endMonth", v)}
                  disabled={edu.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, edu.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <label className={cn(labelClass, edu.isCurrent && "text-gray-500 dark:text-gray-400")}>結束年份</label>
                <Select
                  value={edu.endYear || ""}
                  onValueChange={v => handleFieldChange(idx, "endYear", v)}
                  disabled={edu.isCurrent}
                >
                  <SelectTrigger className={cn(fieldClass, edu.isCurrent && "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed")}>
                    <SelectValue placeholder="請選擇" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEAR_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        <Plus className="w-5 h-5" /> 新增學歷
      </Button>
    </div>
  );
});