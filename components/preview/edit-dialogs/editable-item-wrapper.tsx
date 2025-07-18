import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import React from "react";

interface EditableItemWrapperProps {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export default function EditableItemWrapper({
  title,
  onRemove,
  children,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: EditableItemWrapperProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          {title}
        </h4>
        <div className="flex items-center space-x-1">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={isFirst}
              className="h-8 w-8 p-0"
              aria-label="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={isLast}
              className="h-8 w-8 p-0"
              aria-label="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
} 