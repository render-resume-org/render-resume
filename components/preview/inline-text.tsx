import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

interface InlineTextProps {
  text: string;
  className?: string;
  inlineEditable?: boolean;
  onChange?: (next: string) => void;
  // Highlight for preview/diff
  highlightType?: 'set';
  // Optional git-like diff rendering when previewing a replacement
  previewOriginal?: string;
  previewReplaceWith?: string;
  // Bullet behavior (only for list items)
  isBullet?: boolean;
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
  // Navigation grouping
  groupId?: string;
}

export default function InlineText({ text, className, inlineEditable, onChange, highlightType, previewOriginal, previewReplaceWith, isBullet, onAddBullet, onRemoveBullet, groupId = 'resume-inline' }: InlineTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);

  // Update local text when prop changes (but not during editing)
  useEffect(() => {
    if (!isEditing && localText !== text) {
      setLocalText(text);
    }
  }, [text, isEditing, localText]);

  // Sync local text with DOM when not editing
  useEffect(() => {
    if (ref.current && !isEditing && ref.current.innerText !== localText) {
      ref.current.innerText = localText || '';
    }
  }, [localText, isEditing]);

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<{ groupId: string; index: number; position?: 'start' | 'end' }>).detail;
      if (!detail) return;
      if (detail.groupId !== groupId) return;
      const el = ref.current;
      if (!el) return;
      // Find my index within siblings of same group
      const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`));
      const idx = nodes.indexOf(el);
      if (idx === detail.index) {
        // focus this element
        focusElement(el, detail.position || 'start');
      }
    };
    document.addEventListener('resume-inline-focus', handler as EventListener);
    return () => document.removeEventListener('resume-inline-focus', handler as EventListener);
  }, [groupId]);

  const handleInput = () => {
    if (!ref.current) return;

    const newText = ref.current.innerText;
    setLocalText(newText);
    onChange?.(newText);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    // Ensure the final text is synced
    if (ref.current && ref.current.innerText !== localText) {
      const finalText = ref.current.innerText;
      setLocalText(finalText);
      onChange?.(finalText);
    }
  };

  const isCaretAtStart = (): boolean => {
    const el = ref.current;
    if (!el) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer)) return false;
    const pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.startContainer, range.startOffset);
    return pre.toString().length === 0;
  };

  const isCaretAtEnd = (): boolean => {
    const el = ref.current;
    if (!el) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.endContainer)) return false;
    const post = range.cloneRange();
    post.selectNodeContents(el);
    post.setStart(range.endContainer, range.endOffset);
    return post.toString().length === 0;
  };

  const focusElement = (el: HTMLElement, position: 'start' | 'end') => {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(position === 'start');
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const moveToSibling = (direction: 'prev' | 'next') => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`));
    const idx = nodes.indexOf(el);
    const target = direction === 'prev' ? nodes[idx - 1] : nodes[idx + 1];
    if (target) {
      focusElement(target, direction === 'prev' ? 'end' : 'start');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (!inlineEditable) return;

    if (e.key === 'ArrowUp' && isCaretAtStart()) {
      e.preventDefault();
      moveToSibling('prev');
      return;
    }
    if (e.key === 'ArrowDown' && isCaretAtEnd()) {
      e.preventDefault();
      moveToSibling('next');
      return;
    }

    if (isBullet && e.key === 'Enter') {
      if (isCaretAtEnd()) {
        e.preventDefault();
        onAddBullet?.();
        return;
      }
      // Insert a line break without resetting contenteditable state
      e.preventDefault();
      const el = ref.current;
      if (!el) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const br = document.createElement('br');
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    if (isBullet && e.key === 'Backspace') {
      if (isCaretAtStart() && (localText.trim() === '' || (ref.current?.innerText?.trim() ?? '') === '')) {
        e.preventDefault();
        onRemoveBullet?.();
        return;
      }
    }
  };

  return (
    <>
      {(highlightType === 'set' && previewOriginal !== undefined && previewReplaceWith !== undefined) ? (
        <span className={cn('inline-flex flex-col gap-3', className)} data-inline-group={groupId}>
          <span className={cn('cursor-text bg-red-50 decoration-red-400 decoration-2 underline-offset-2  text-red-700 dark:text-red-300 dark:bg-red-900/20 p-1 px-2 rounded-md')}>
            {previewOriginal}
          </span>
          {/* Only show green "after" block if there's content to show */}
          {previewReplaceWith && previewReplaceWith.trim() !== '' && (
            <span
              ref={ref}
              suppressContentEditableWarning
              contentEditable={true}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              data-inline-group={groupId}
              className={cn('cursor-text bg-green-50 decoration-green-500 decoration-2 underline-offset-2 text-green-800 dark:text-green-200 dark:bg-green-900/20 p-1 px-2 rounded-md outline-none')}
              title={'Click to edit'}
            >
              {previewReplaceWith}
            </span>
          )}
        </span>
      ) : (
        <span
          ref={ref}
          suppressContentEditableWarning
          contentEditable={!!inlineEditable}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          data-inline-group={groupId}
          className={cn(
            'outline-none',
            inlineEditable && 'cursor-text hover:bg-blue-50 hover:border-b-2 hover:border-blue-200 transition-all duration-200',
            highlightType === 'set' && 'bg-yellow-50 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-600 rounded-sm',
            className
          )}
          title={inlineEditable ? 'Click to edit' : undefined}
        >
          {text}
        </span>
      )}
    </>
  );
}
