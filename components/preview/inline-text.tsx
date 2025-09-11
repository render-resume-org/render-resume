import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import InlineHighlightPreview from './highlights/inline-highlight-preview';
import { useInlineKeyboard } from '../hooks/use-inline-keyboard';
import type { BulletEditableProps, CaretPositionType } from '../../types/inline-editor';

interface InlineTextProps extends BulletEditableProps {
  // Custom key down handler
  onKeyDown?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
}

export default function InlineText({ text, className, inlineEditable, onChange, highlightType, previewOriginal, previewReplaceWith, isBullet, onAddBullet, onRemoveBullet, groupId = 'resume-inline', navOrder, onKeyDown: customOnKeyDown }: InlineTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [previewEditableText, setPreviewEditableText] = useState(previewReplaceWith || '');
  const [isComposing, setIsComposing] = useState(false);
  const ignoreNextBlurRef = useRef(false);

  const { handleKeyDown: handleInlineKeyDown } = useInlineKeyboard(ref, {
    groupId,
    isBullet,
    isComposing,
    localText,
    navOrder,
    onAddBullet,
    onRemoveBullet,
    customOnKeyDown,
    enableEnhancedNavigation: false  // Using direct implementation in useInlineKeyboard
  });

  // Update local text when prop changes (but not during editing)
  useEffect(() => {
    if (!isEditing && localText !== text) {
      setLocalText(text);
    }
  }, [text, isEditing, localText]);

  // Update preview editable text when previewReplaceWith changes
  useEffect(() => {
    if (previewReplaceWith !== undefined) {
      // For insert mode, always sync with the synthesized value
      // For set mode, only sync when prop changes meaningfully to avoid overwriting user edits
      const isInsertMode = highlightType === 'insert';
      if (isInsertMode) {
        setPreviewEditableText(previewReplaceWith);
      } else {
        setPreviewEditableText(prev => (prev === previewReplaceWith ? prev : previewReplaceWith));
      }
    }
  }, [previewReplaceWith, highlightType]);

  // In preview mode, ensure no stray text nodes (e.g., unhighlighted duplicates) remain inside the container
  useEffect(() => {
    const isPreviewMode = (highlightType === 'set' || highlightType === 'insert') && previewOriginal !== undefined && previewReplaceWith !== undefined;
    const el = containerRef.current;
    if (!isPreviewMode || !el) return;
    // Remove any direct text nodes under the container to avoid duplicated base text
    try {
      const childNodes = Array.from(el.childNodes);
      for (const node of childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          el.removeChild(node);
        }
      }
    } catch {}
  }, [highlightType, previewOriginal, previewReplaceWith]);

  // Preserve cursor position when syncing DOM content
  const preserveCursorAndSyncContent = useCallback((element: HTMLElement, newContent: string) => {
    if (element.innerText === newContent) return; // No need to update

    // Save cursor position
    const selection = window.getSelection();
    let cursorOffset = 0;
    if (selection && selection.rangeCount > 0 && element.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(element);
      preRange.setEnd(range.startContainer, range.startOffset);
      cursorOffset = preRange.toString().length;
    }

    // Update content
    element.innerText = newContent;

    // Restore cursor position
    if (isEditing && document.activeElement === element) {
      const range = document.createRange();
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT
      );
      
      let currentOffset = 0;
      let targetNode: Node = element;
      let targetOffset = 0;

      let node;
      while (node = walker.nextNode()) {
        const nodeLength = node.textContent?.length || 0;
        if (currentOffset + nodeLength >= cursorOffset) {
          targetNode = node;
          targetOffset = cursorOffset - currentOffset;
          break;
        }
        currentOffset += nodeLength;
      }

      try {
        range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
        range.collapse(true);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      } catch {
        // Fallback to end of content if cursor restoration fails
        range.selectNodeContents(element);
        range.collapse(false);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }, [isEditing]);

  // Sync local text with DOM when not editing, preserving cursor position
  useEffect(() => {
    if (ref.current && !isEditing) {
      const isPreviewMode = (highlightType === 'set' || highlightType === 'insert') && previewOriginal !== undefined && previewReplaceWith !== undefined;
      const targetContent = isPreviewMode ? previewEditableText : localText;
      preserveCursorAndSyncContent(ref.current, targetContent || '');
    }
  }, [localText, previewEditableText, isEditing, highlightType, previewOriginal, previewReplaceWith, preserveCursorAndSyncContent]);

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
    const isPreviewMode = (highlightType === 'set' || highlightType === 'insert') && previewOriginal !== undefined && previewReplaceWith !== undefined;
    
    if (isPreviewMode) {
      setPreviewEditableText(newText);
    } else {
      setLocalText(newText);
    }
    onChange?.(newText);
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (ignoreNextBlurRef.current) {
      // Skip committing changes if this blur is caused by a bullet removal
      // Reset flag in the next tick to avoid swallowing subsequent blurs
      setTimeout(() => { ignoreNextBlurRef.current = false; }, 0);
      return;
    }
    // Ensure the final text is synced
    if (ref.current) {
      const finalText = ref.current.innerText;
      // Avoid no-op updates when content didn't change
      if (finalText === text) return;
      const isPreviewMode = (highlightType === 'set' || highlightType === 'insert') && previewOriginal !== undefined && previewReplaceWith !== undefined;
      
      if (isPreviewMode) {
        setPreviewEditableText(finalText);
      } else {
        setLocalText(finalText);
      }
      onChange?.(finalText);
    }
  };

  const focusElement = (el: HTMLElement, position: CaretPositionType) => {
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


  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (!inlineEditable) return;
    handleInlineKeyDown(e);
  };

  const isPreview = (highlightType === 'set' || highlightType === 'insert') && previewOriginal !== undefined && previewReplaceWith !== undefined;

  if (isPreview) {
    // Derive preview mode: insert => green only; set => red + green; remove => red only when after is empty
    const afterText = previewReplaceWith || '';
    const mode = highlightType === 'insert' ? 'insert' : (afterText.trim() === '' ? 'remove' : 'set');

    return (
      <InlineHighlightPreview
        mode={mode}
        beforeText={previewOriginal}
        afterText={previewEditableText}
        containerRef={containerRef as unknown as React.Ref<HTMLSpanElement>}
        afterRef={ref as unknown as React.Ref<HTMLSpanElement>}
        className={className}
        containerProps={{
          'data-inline-group': groupId,
          'data-inline-order': navOrder !== undefined ? String(navOrder) : undefined,
        }}
        afterProps={{
          onInput: handleInput as unknown as React.FormEventHandler<HTMLSpanElement>,
          onFocus: handleFocus as unknown as React.FocusEventHandler<HTMLSpanElement>,
          onBlur: handleBlur as unknown as React.FocusEventHandler<HTMLSpanElement>,
          onKeyDown: handleInlineKeyDown as unknown as React.KeyboardEventHandler<HTMLSpanElement>,
          onCompositionStart: handleCompositionStart as unknown as React.CompositionEventHandler<HTMLSpanElement>,
          onCompositionEnd: handleCompositionEnd as unknown as React.CompositionEventHandler<HTMLSpanElement>,
          title: 'Click to edit',
          'data-inline-group': groupId,
          'data-inline-order': navOrder !== undefined ? String(navOrder) : undefined,
        }}
      />
    );
  }

  return (
    <span
      ref={ref}
      suppressContentEditableWarning
      contentEditable={!!inlineEditable}
      onInput={handleInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      data-inline-group={groupId}
      data-inline-order={navOrder !== undefined ? String(navOrder) : undefined}
      className={cn(
        'outline-none',
        inlineEditable && 'cursor-text hover:bg-blue-50 hover:border-b-2 hover:border-blue-200 transition-all duration-200',
        highlightType === 'set' && 'bg-yellow-50 ring-1 ring-yellow-300 dark:bg-yellow-900/30 dark:ring-yellow-600 rounded-sm',
        className
      )}
      title={inlineEditable ? 'Click to edit' : undefined}
    />
  );
}