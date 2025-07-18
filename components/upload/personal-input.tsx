import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PersonalInfo } from "@/lib/upload-utils";
import React, { useCallback } from "react";

type Props = {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
};

export const PersonalInput: React.FC<Props> = React.memo(({ value, onChange }) => {
  const handleFieldChange = useCallback((field: keyof PersonalInfo, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  }, [value, onChange]);

  // 統一 input 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 mb-1";

  return (
    <div className="mb-8">
      <Card>
        <CardContent>
          <div className="mb-4">
            <span className="text-xl font-bold text-gray-900">個人資訊</span>
          </div>
          
          {/* Address */}
          <div className="mb-4">
            <label className={labelClass}>地址</label>
            <input
              className={fieldClass}
              value={value.address}
              onChange={e => handleFieldChange("address", e.target.value)}
              placeholder="請輸入您的地址"
            />
          </div>

          {/* Phone and Email row */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <label className={labelClass}>電話</label>
              <input
                className={fieldClass}
                value={value.phone}
                onChange={e => handleFieldChange("phone", e.target.value)}
                placeholder="請輸入您的電話號碼"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelClass}>電子郵件</label>
              <input
                className={fieldClass}
                type="email"
                value={value.email}
                onChange={e => handleFieldChange("email", e.target.value)}
                placeholder="請輸入您的電子郵件"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}); 