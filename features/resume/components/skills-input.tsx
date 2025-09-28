import { Card, CardContent } from "@/components/ui/card";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const SkillsInputComponent: React.FC<Props> = ({ value, onChange }) => {
  // 統一 input 樣式
  const fieldClass = "w-full !h-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base";
  const labelClass = "block text-base font-semibold text-gray-800 dark:text-gray-200 mb-1";

  return (
    <div className="mb-8">
      <Card>
        <CardContent>
          <div className="mb-4">
            <span className="text-xl font-bold text-gray-900 dark:text-white">專業技能</span>
          </div>
          
          {/* Skills */}
          <div className="mb-4">
            <label className={labelClass}>技能</label>
            <input
              className={fieldClass}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="請輸入您的專業技能，例如：JavaScript, React, Python, SQL, Figma, Microsoft Office"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const SkillsInput = React.memo(SkillsInputComponent); 