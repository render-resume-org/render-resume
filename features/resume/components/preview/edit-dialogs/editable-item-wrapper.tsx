import { cn } from '@/utils';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EditableItemWrapperProps {
  children: React.ReactNode;
  title?: string;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
}

export default function EditableItemWrapper({
  children,
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  className,
}: EditableItemWrapperProps) {
  return (
    <div className={cn('border border-gray-200 rounded-lg p-4', className)}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-gray-900">
          {title}
        </h4>
        <div className="flex space-x-2">
          {onMoveUp && !isFirst && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              className="h-8 w-8 p-0"
            >
              ↑
            </Button>
          )}
          {onMoveDown && !isLast && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              className="h-8 w-8 p-0"
            >
              ↓
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
} 