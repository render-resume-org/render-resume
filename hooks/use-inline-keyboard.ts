import { useCallback, useRef, useEffect } from 'react';
import type { InlineGroupId, CaretPositionType, NavigationDirection, KeyboardNavigationHandlers } from '@/types/inline-editor';
import { SimpleCaretNavigation } from '../lib/caret-navigation-simple';

export interface InlineKeyboardOptions {
  groupId: InlineGroupId;
  isBullet?: boolean;
  isComposing: boolean;
  localText: string;
  navOrder?: number;
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
  customOnKeyDown?: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
  // Enhanced navigation options
  enableEnhancedNavigation?: boolean;
  onNavigateToField?: (direction: 'prev' | 'next') => void;
}

export interface InlineKeyboardHandlers extends KeyboardNavigationHandlers {
  handleKeyDown: (e: React.KeyboardEvent<HTMLSpanElement>) => void;
}

export function useInlineKeyboard(
  elementRef: React.RefObject<HTMLSpanElement | null>,
  options: InlineKeyboardOptions
): InlineKeyboardHandlers {
  const ignoreNextBlurRef = useRef(false);
  
  // Robust caret navigation system
  const caretNavigationRef = useRef<SimpleCaretNavigation | null>(null);
  
  useEffect(() => {
    if (!caretNavigationRef.current) {
      caretNavigationRef.current = SimpleCaretNavigation.getInstance();
    }
    
    const element = elementRef.current;
    if (element && caretNavigationRef.current) {
      caretNavigationRef.current.registerElement(element, {
        navOrder: options.navOrder,
        groupId: options.groupId,
        isBullet: options.isBullet
      });
      
      return () => {
        if (caretNavigationRef.current && element) {
          caretNavigationRef.current.unregisterElement(element);
        }
      };
    }
  }, [elementRef, options.navOrder, options.groupId, options.isBullet]);

  // Legacy helpers for backward compatibility
  const isCaretAtStart = useCallback((): boolean => {
    const el = elementRef.current;
    if (!el) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.startContainer)) return false;
    const pre = range.cloneRange();
    pre.selectNodeContents(el);
    pre.setEnd(range.startContainer, range.startOffset);
    return pre.toString().length === 0;
  }, [elementRef]);

  const isCaretAtEnd = useCallback((): boolean => {
    const el = elementRef.current;
    if (!el) return false;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return false;
    const range = sel.getRangeAt(0);
    if (!el.contains(range.endContainer)) return false;
    const post = range.cloneRange();
    post.selectNodeContents(el);
    post.setStart(range.endContainer, range.endOffset);
    return post.toString().length === 0;
  }, [elementRef]);

  const focusElement = useCallback((el: HTMLElement, position: CaretPositionType) => {
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(position === 'start');
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);

  const moveToSibling = useCallback((direction: NavigationDirection) => {
    const el = elementRef.current;
    if (!el) return;
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
  }, [elementRef, focusElement]);

  const dispatchFocusEvent = useCallback((targetGroupId: InlineGroupId, index: number, position: CaretPositionType) => {
    document.dispatchEvent(new CustomEvent('resume-inline-focus', { detail: { groupId: targetGroupId, index, position } }));
  }, []);

  const focusAfterMutation = useCallback((deltaIndex: number, position: CaretPositionType) => {
    const el = elementRef.current;
    if (!el) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(`[data-inline-group="${options.groupId}"]`));
    const idx = nodes.indexOf(el);
    const targetIndex = idx + deltaIndex;
    setTimeout(() => dispatchFocusEvent(options.groupId, targetIndex, position), 50);
  }, [elementRef, options.groupId, dispatchFocusEvent]);

  const triggerRemoveBullet = useCallback(() => {
    ignoreNextBlurRef.current = true;
    try {
      options.onRemoveBullet?.();
    } finally {
      setTimeout(() => { ignoreNextBlurRef.current = false; }, 0);
    }
  }, [options]);

  // Robust navigation using the new CaretNavigationEngine

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (options.customOnKeyDown) {
      options.customOnKeyDown(e);
      if (e.defaultPrevented) return;
    }

    if (options.isComposing && e.key === 'Enter') {
      return;
    }

    // Use robust caret navigation for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const element = elementRef.current;
      if (element && caretNavigationRef.current) {
        const result = caretNavigationRef.current.handleNavigation(element, e.key);
        if (result.success && result.data) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }
    }

    if (options.isBullet && e.key === 'Enter') {
      if (isCaretAtEnd()) {
        e.preventDefault();
        options.onAddBullet?.();
        focusAfterMutation(1, 'start');
        return;
      }
      e.preventDefault();
      const el = elementRef.current;
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

    if (options.isBullet && e.key === 'Backspace') {
      const isEmpty = (options.localText.trim() === '' || (elementRef.current?.innerText?.trim() ?? '') === '');
      if (isEmpty) {
        e.preventDefault();
        triggerRemoveBullet();
        setTimeout(() => focusAfterMutation(-1, 'end'), 10);
        return;
      }
    }
  }, [
    options,
    isCaretAtEnd,
    elementRef,
    focusAfterMutation,
    triggerRemoveBullet
  ]);

  return {
    handleKeyDown,
    isCaretAtStart,
    isCaretAtEnd,
    focusElement,
    moveToSibling,
  };
}