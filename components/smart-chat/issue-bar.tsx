"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, ChevronDown as DownIcon, Trash2, ChevronUp as UpIcon } from "lucide-react";
import { useMemo, useState } from "react";
import type { SuggestionTemplate } from "./ai-suggestions-sidebar";

interface IssueBarProps {
  suggestionTemplates: SuggestionTemplate[];
  onQuoteTemplate: (t: SuggestionTemplate) => void;
  onRemoveTemplate: (id: string) => void;
  className?: string;
}

const getIndicatorBarColor = (status?: SuggestionTemplate['status']) => {
  if (!status) return 'bg-transparent';
  switch (status) {
    case 'pending':
      return 'bg-gray-300';
    case 'in_progress':
      return 'bg-orange-300';
    case 'completed':
      return 'bg-cyan-500';
  }
};

const getStatusText = (status?: SuggestionTemplate['status']) => {
  if (!status) return '';
  switch (status) {
    case 'pending':
      return '未完成';
    case 'in_progress':
      return '進行中';
    case 'completed':
      return '已完成';
  }
};

export default function IssueBar({ suggestionTemplates, onQuoteTemplate, onRemoveTemplate, className }: IssueBarProps) {
  const [index, setIndex] = useState(0);

  const total = suggestionTemplates?.length || 0;
  const clampedIndex = Math.max(0, Math.min(index, Math.max(0, total - 1)));
  const current = useMemo(() => suggestionTemplates?.[clampedIndex], [suggestionTemplates, clampedIndex]);

  if (!suggestionTemplates || suggestionTemplates.length === 0 || !current) return null;

  const prev = () => setIndex(i => Math.max(0, i - 1));
  const next = () => setIndex(i => Math.min(total - 1, i + 1));

  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <div className="px-4 py-4">
        <div className="relative">
          {/* Left-side controls (static, seamless) */}
          {total > 1 && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-0 shadow-none"
                onClick={prev}
                aria-label="上一個"
                disabled={clampedIndex === 0}
              >
                <UpIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-0 shadow-none"
                onClick={next}
                aria-label="下一個"
                disabled={clampedIndex === total - 1}
              >
                <DownIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          {/* Single issue card viewport */}
          <div className="pl-9">
            <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-center gap-3 min-h-[6.5rem]">
              <div className={cn("w-1.5 self-stretch rounded-full", getIndicatorBarColor(current.status))} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{current.title}</div>
                <div className="text-xs text-gray-500 line-clamp-2 min-h-[2.5rem]">{current.description}</div>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={current.status === 'completed' ? 'default' : current.status === 'in_progress' ? 'secondary' : 'outline'} className="text-[10px]">
                    {getStatusText(current.status)}
                  </Badge>
                  <span className="text-xs text-gray-400">#{clampedIndex + 1}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-gray-700"
                  onClick={() => onQuoteTemplate(current)}
                  title="引用此問題進行討論"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  onClick={() => onRemoveTemplate(current.id)}
                  title="移除此問題"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
