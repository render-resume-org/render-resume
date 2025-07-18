"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdditionalTextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdditionalTextInput({ value, onChange }: AdditionalTextInputProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">額外資訊</CardTitle>
        <CardDescription>
          提供任何額外的背景資訊或特殊需求
        </CardDescription>
      </CardHeader>
      <CardContent>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例如：應徵職位、特殊需求等..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          rows={4}
        />
      </CardContent>
    </Card>
  );
} 