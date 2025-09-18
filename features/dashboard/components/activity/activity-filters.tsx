'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils";
import { X } from "lucide-react";

export interface ActivityFilters {
  actionTypes: string[];
  timeRange: string;
}

export interface ActivityFiltersProps {
  filters: ActivityFilters;
  onFiltersChange: (filters: ActivityFilters) => void;
  className?: string;
}

const TIME_RANGE_OPTIONS = [
  { value: 'today', label: '今天' },
  { value: '7days', label: '最近 7 天' },
  { value: '1month', label: '近 1 個月' },
  { value: '3months', label: '近 3 個月' },
  { value: '6months', label: '近 6 個月' },
  { value: 'all', label: '全部時間' },
] as const;

const ACTION_TYPE_OPTIONS = [
  { value: 'build resume', label: '建立履歷' },
  { value: 'optimize resume', label: '優化履歷' },
  { value: 'download resume', label: '下載履歷' },
  { value: 'send smart chat message', label: '發送智能對話' },
  { value: 'upload smart chat attachment', label: '上傳附件' },
  { value: 'view announcement', label: '查看公告' },
  { value: 'view account settings', label: '查看帳戶設定' },
] as const;

export function ActivityFilters({ filters, onFiltersChange, className }: ActivityFiltersProps) {
  const handleActionTypeChange = (actionType: string) => {
    const newActionTypes = filters.actionTypes.includes(actionType)
      ? filters.actionTypes.filter(type => type !== actionType)
      : [...filters.actionTypes, actionType];
    
    onFiltersChange({
      ...filters,
      actionTypes: newActionTypes,
    });
  };

  const handleTimeRangeChange = (timeRange: string) => {
    onFiltersChange({
      ...filters,
      timeRange,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      actionTypes: [
        'build resume',
        'optimize resume', 
        'download resume',
        'send smart chat message',
        'upload smart chat attachment'
      ],
      timeRange: '7days',
    });
  };

  const hasActiveFilters = filters.actionTypes.length !== 5 || filters.timeRange !== '7days';

  return (
    <div className={cn("space-y-4", className)}>
      {/* Time Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          時間範圍
        </label>
        <Select value={filters.timeRange} onValueChange={handleTimeRangeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇時間範圍" />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Type Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          活動類型
        </label>
        <div className="flex flex-wrap gap-2">
          {ACTION_TYPE_OPTIONS.map((option) => (
            <Badge
              key={option.value}
              variant={filters.actionTypes.includes(option.value) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                filters.actionTypes.includes(option.value)
                  ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              )}
              onClick={() => handleActionTypeChange(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          點擊標籤來篩選特定類型的活動
        </p>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4 mr-1" />
            清除篩選
          </Button>
        </div>
      )}
    </div>
  );
} 