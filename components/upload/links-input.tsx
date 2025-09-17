import { Card, CardContent } from "@/components/ui/card";
import { Links } from "@/utils/upload-utils";
import React, { useCallback } from "react";

type Props = {
  value: Links;
  onChange: (value: Links) => void;
};

const LinksInputComponent: React.FC<Props> = ({ value, onChange }) => {
  const handleFieldChange = useCallback((field: keyof Links, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  }, [value, onChange]);

  // 統一 input 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 dark:text-gray-200 mb-1";

  return (
    <div className="mb-8">
      <Card>
        <CardContent>
          <div className="mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">連結</span>
          </div>
          
          {/* LinkedIn */}
          <div className="mb-4">
            <label className={labelClass}>LinkedIn</label>
            <input
              className={fieldClass}
              value={value.linkedin}
              onChange={e => handleFieldChange("linkedin", e.target.value)}
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>

          {/* GitHub */}
          <div className="mb-4">
            <label className={labelClass}>GitHub</label>
            <input
              className={fieldClass}
              value={value.github}
              onChange={e => handleFieldChange("github", e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          {/* Portfolio */}
          <div className="mb-4">
            <label className={labelClass}>作品集</label>
            <input
              className={fieldClass}
              value={value.portfolio}
              onChange={e => handleFieldChange("portfolio", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const LinksInput = React.memo(LinksInputComponent); 