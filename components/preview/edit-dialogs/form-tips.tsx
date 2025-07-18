import { Edit3 } from "lucide-react";

interface FormTipsProps {
  title: string;
  tips: string[];
}

export default function FormTips({ title, tips }: FormTipsProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">{title}</p>
          <ul className="space-y-1 text-xs">
            {tips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 