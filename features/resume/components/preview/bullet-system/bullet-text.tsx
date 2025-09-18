import { cn } from '@/utils';
import { useEffect, useState } from 'react';
import { useBulletPoint } from './use-bullet-point';

interface BulletTextProps {
  text: string;
  groupId: string;
  index: number;
  className?: string;
  onChange?: (text: string) => void;
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
  // 預覽相關（保留現有功能）
  highlightType?: 'set' | 'insert';
  previewOriginal?: string;
  previewReplaceWith?: string;
}

/**
 * BulletText - 專門用於列點編輯的組件
 * 
 * 特點：
 * - 自動處理鍵盤導航（Enter、Backspace）
 * - 簡潔的 API，無需手動管理焦點
 * - 與現有的高亮預覽功能兼容
 */
export default function BulletText({
  text,
  groupId,
  index,
  className,
  onChange,
  onAddBullet,
  onRemoveBullet,
  highlightType,
  previewOriginal,
  previewReplaceWith
}: BulletTextProps) {
  const [localText, setLocalText] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  
  // 使用新的 bullet point hook
  const {
    elementRef,
    handleKeyDown,
    handleInput
  } = useBulletPoint({
    groupId,
    index,
    onAddBullet,
    onRemoveBullet,
    onChange: (newText) => {
      setLocalText(newText);
      onChange?.(newText);
    }
  });
  
  // 同步外部文本變化
  useEffect(() => {
    if (!isEditing && text !== localText) {
      setLocalText(text);
    }
  }, [text, isEditing, localText]);
  
  // 預覽模式檢測
  const isPreviewMode = (highlightType === 'set' || highlightType === 'insert') && 
                        previewOriginal !== undefined && 
                        previewReplaceWith !== undefined;
  
  const displayText = isPreviewMode ? (previewReplaceWith || '') : localText;
  
  const handleFocus = () => {
    setIsEditing(true);
  };
  
  const handleBlur = () => {
    setIsEditing(false);
    // 確保最終文本同步
    if (elementRef.current) {
      const finalText = elementRef.current.innerText || '';
      if (finalText !== localText) {
        setLocalText(finalText);
        onChange?.(finalText);
      }
    }
  };
  
  // 同步 DOM 內容（防止外部更新時內容不一致）
  useEffect(() => {
    const element = elementRef.current;
    if (element && !isEditing && element.innerText !== displayText) {
      element.innerText = displayText;
    }
  }, [displayText, isEditing, elementRef]);
  
  return (
    <span
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      className={cn(
        'outline-none',
        'cursor-text hover:bg-blue-50 hover:border-b-2 hover:border-blue-200 transition-all duration-200',
        // 預覽高亮
        highlightType === 'set' && 'bg-yellow-50 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-600 rounded-sm',
        highlightType === 'insert' && 'bg-green-50 ring-1 ring-green-300 dark:bg-green-900/30 dark:ring-green-600 rounded-sm',
        className
      )}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      title="Click to edit"
    />
  );
}