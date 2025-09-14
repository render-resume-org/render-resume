import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import InlineHighlightPreview from './highlights/inline-highlight-preview';
import { useOptionalBulletFocus } from './bullet-focus-provider';

interface InlineTextProps {
  text: string;
  className?: string;
  inlineEditable?: boolean;
  onChange?: (next: string) => void;
  // Highlight for preview/diff
  highlightType?: 'set' | 'insert';
  // Optional git-like diff rendering when previewing a replacement
  previewOriginal?: string;
  previewReplaceWith?: string;
  // Bullet behavior (only for list items)
  isBullet?: boolean;
  bulletId?: string; // Stable ID for bullet identification
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
  // Navigation grouping
  groupId?: string;
  // Global navigation order across resume; smaller first. When omitted, DOM order is used
  navOrder?: number;
  // Custom key down handler
  onKeyDown?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
}

export default function InlineText({ text, className, inlineEditable, onChange, highlightType, previewOriginal, previewReplaceWith, isBullet, bulletId, onAddBullet, onRemoveBullet, groupId = 'resume-inline', navOrder, onKeyDown: customOnKeyDown }: InlineTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(text);
  const [previewEditableText, setPreviewEditableText] = useState(previewReplaceWith || '');
  const [isComposing, setIsComposing] = useState(false);
  const ignoreNextBlurRef = useRef(false);

  // Enhanced bullet focus management
  const bulletFocusContext = useOptionalBulletFocus();
  const pendingFocusActionRef = useRef<{ type: 'next'; bulletId: string } | null>(null);

  // Update local text when prop changes (but not during editing)
  useEffect(() => {
    if (!isEditing && localText !== text) {
      setLocalText(text);
    }
  }, [text, isEditing, localText]);

  // Register bullet with context
  useEffect(() => {
    const element = ref.current;
    if (isBullet && bulletFocusContext && element && bulletId) {
      bulletFocusContext.registerBulletRef(groupId, bulletId, element);
      return () => {
        bulletFocusContext.unregisterBulletRef(groupId, bulletId);
      };
    }
  }, [isBullet, bulletFocusContext, groupId, bulletId]);

  // Handle pending focus actions after DOM updates
  useEffect(() => {
    const action = pendingFocusActionRef.current;
    if (!action || !isBullet || !bulletFocusContext) return;

    const timer = setTimeout(() => {
      if (action.type === 'next') {
        bulletFocusContext.focusNextBullet(groupId, action.bulletId);
      }
      pendingFocusActionRef.current = null;
    }, 50);

    return () => clearTimeout(timer);
  }, [localText, isBullet, bulletFocusContext, groupId]); // Re-run when text changes (indicating DOM update)

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
      const detail = (ev as CustomEvent<{ groupId: string; index: number; position?: 'start' | 'end'; bulletId?: string }>).detail;
      if (!detail) return;
      if (detail.groupId !== groupId) return;
      const el = ref.current;
      if (!el) return;
      
      // Check if this element should be focused
      let shouldFocus = false;
      
      if (detail.bulletId) {
        // Use bulletId matching (preferred for stable identification)
        const containerEl = el.closest('[data-inline-group]') as HTMLElement;
        if (containerEl && containerEl.dataset.inlineOrder !== undefined) {
          const order = Number(containerEl.dataset.inlineOrder);
          const targetOrder = detail.index;
          shouldFocus = order === targetOrder;
        }
      } else {
        // Fallback to index-based matching
        const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`));
        const idx = nodes.indexOf(el);
        shouldFocus = idx === detail.index;
      }
      
      if (shouldFocus) {
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
    // Global navigation across all inline nodes respecting explicit navOrder
    const allNodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group]`))
      .filter((node) => node.dataset.inlineOrder !== undefined);
    const nodes = allNodes
      .map((node, i) => ({
        node,
        i,
        order: Number(node.dataset.inlineOrder)
      }))
      .sort((a, b) => (a.order - b.order) || (a.i - b.i))
      .map(n => n.node);
    const idx = nodes.indexOf(el);
    const target = direction === 'prev' ? nodes[idx - 1] : nodes[idx + 1];
    if (target) {
      focusElement(target, direction === 'prev' ? 'end' : 'start');
    }
  };

  const dispatchFocusEvent = (targetGroupId: string, index: number, position: 'start' | 'end') => {
    document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: targetGroupId, index, position } }));
  };

  const focusAfterMutation = (deltaIndex: number, position: 'start' | 'end') => {
    const el = ref.current;
    if (!el) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`));
    const idx = nodes.indexOf(el);
    const targetIndex = idx + deltaIndex;
    // Use longer delay to ensure React state update and DOM insertion/removal are complete
    setTimeout(() => dispatchFocusEvent(groupId, targetIndex, position), 50);
  };

  const triggerRemoveBullet = () => {
    ignoreNextBlurRef.current = true;
    try {
      onRemoveBullet?.();
    } finally {
      // Reset after the DOM/react updates have occurred
      setTimeout(() => { ignoreNextBlurRef.current = false; }, 0);
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

    // Call custom key down handler first
    if (customOnKeyDown) {
      customOnKeyDown(e);
      if (e.defaultPrevented) return;
    }

    // Don't handle Enter key during Chinese composition
    if (isComposing && e.key === 'Enter') {
      return;
    }

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

    // Left arrow at beginning of line - move to previous line
    if (e.key === 'ArrowLeft' && isCaretAtStart()) {
      e.preventDefault();
      moveToSibling('prev');
      return;
    }
    // Right arrow at end of line - move to next line
    if (e.key === 'ArrowRight' && isCaretAtEnd()) {
      e.preventDefault();
      moveToSibling('next');
      return;
    }

    if (isBullet && e.key === 'Enter') {
      if (isCaretAtEnd()) {
        e.preventDefault();
        onAddBullet?.();
        // Enhanced: Schedule focus to next bullet after DOM update
        if (bulletId && bulletFocusContext) {
          pendingFocusActionRef.current = { type: 'next', bulletId };
        } else {
          // Fallback to old method if no bulletId
          focusAfterMutation(1, 'start');
        }
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
      // Remove bullet when empty regardless of caret position to avoid cross-line deletion
      const isEmpty = (localText.trim() === '' || (ref.current?.innerText?.trim() ?? '') === '');
      if (isEmpty) {
        e.preventDefault();

        // Enhanced: Use coordinated removal and focus
        if (bulletId && bulletFocusContext && bulletFocusContext.removeAndFocusPrevious) {
          bulletFocusContext.removeAndFocusPrevious(groupId, bulletId, () => {
            triggerRemoveBullet();
          });
        } else {
          // Fallback to old method if no bulletId or context
          triggerRemoveBullet();
          setTimeout(() => focusAfterMutation(-1, 'end'), 10);
        }
        return;
      }
    }
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
          onKeyDown: handleKeyDown as unknown as React.KeyboardEventHandler<HTMLSpanElement>,
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