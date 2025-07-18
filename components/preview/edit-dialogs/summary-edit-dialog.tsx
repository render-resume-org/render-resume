import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import BaseEditDialog from "./base-edit-dialog";
import FormTips from "./form-tips";

interface SummaryEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (summary: string) => void;
  currentSummary: string;
}

export default function SummaryEditDialog({
  isOpen,
  onClose,
  onSave,
  currentSummary,
}: SummaryEditDialogProps) {
  const [summary, setSummary] = useState(currentSummary);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(summary);
      onClose();
    } catch (error) {
      console.error('Failed to save summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSummary(currentSummary); // Reset to original value
    onClose();
  };

  return (
    <BaseEditDialog
      isOpen={isOpen}
      onClose={handleClose}
      onSave={handleSave}
      title="編輯個人簡介"
      description="修改您的個人簡介，讓它更符合您的職業目標和經驗。"
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            個人簡介
          </label>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="請輸入您的個人簡介..."
            className="min-h-[120px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>簡潔明瞭地描述您的專業背景和職業目標</span>
            <span>{summary.length}/500</span>
          </div>
        </div>

        <FormTips 
          title="撰寫建議："
          tips={[
            "控制在 2-3 句話內",
            "突出您的核心技能和經驗",
            "說明您能為雇主帶來的價值",
            "使用積極的動詞和具體的成就",
          ]}
        />
      </div>
    </BaseEditDialog>
  );
} 