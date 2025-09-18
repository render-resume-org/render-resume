import { Edit3 } from 'lucide-react';

interface FormTipsProps {
  tips: string[];
}

export default function FormTips({ tips }: FormTipsProps) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <Edit3 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">撰寫建議：</p>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm">
                • {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 