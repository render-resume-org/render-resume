import { useCallback, useEffect, useRef } from 'react';
import { BulletManager, type BulletPoint } from './bullet-manager';

interface UseBulletPointOptions {
  groupId: string;
  index: number;
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
  onChange?: (text: string) => void;
}

/**
 * useBulletPoint - React Hook for bullet point functionality
 * 
 * 提供：
 * - 自動註冊/註銷到 BulletManager
 * - 鍵盤事件處理（Enter, Backspace）
 * - 焦點管理
 */
export function useBulletPoint({
  groupId,
  index,
  onAddBullet,
  onRemoveBullet,
  onChange
}: UseBulletPointOptions) {
  const elementRef = useRef<HTMLElement>(null);
  const bulletIdRef = useRef(`${groupId}-${index}`);
  
  // 焦點管理函數
  const focusElement = useCallback((position: 'start' | 'end' = 'start') => {
    const element = elementRef.current;
    if (!element) return;
    
    element.focus();
    
    // 設置游標位置
    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(position === 'start');
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);
  
  // 檢查是否為空
  const isEmpty = useCallback(() => {
    const element = elementRef.current;
    return !element || element.innerText.trim() === '';
  }, []);
  
  // 檢查游標位置
  const isCaretAtStart = useCallback((): boolean => {
    const element = elementRef.current;
    if (!element) return false;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    
    const range = selection.getRangeAt(0);
    if (!element.contains(range.startContainer)) return false;
    
    const preRange = range.cloneRange();
    preRange.selectNodeContents(element);
    preRange.setEnd(range.startContainer, range.startOffset);
    
    return preRange.toString().length === 0;
  }, []);
  
  const isCaretAtEnd = useCallback((): boolean => {
    const element = elementRef.current;
    if (!element) return false;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
    
    const range = selection.getRangeAt(0);
    if (!element.contains(range.endContainer)) return false;
    
    const postRange = range.cloneRange();
    postRange.selectNodeContents(element);
    postRange.setStart(range.endContainer, range.endOffset);
    
    return postRange.toString().length === 0;
  }, []);
  
  // 鍵盤事件處理
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isCaretAtEnd()) {
        // 在末尾按 Enter：創建新列點
        e.preventDefault();
        onAddBullet?.();
        
        // 延遲焦點到新列點（等待 DOM 更新）
        setTimeout(() => {
          BulletManager.focusNext(groupId, index);
        }, 50);
      }
      // 在中間按 Enter：插入換行符（默認行為）
      return;
    }
    
    if (e.key === 'Backspace' && isEmpty()) {
      // 刪除空列點
      e.preventDefault();
      
      // 先移動焦點到上一個列點
      const moved = BulletManager.focusPrevious(groupId, index);
      
      // 再執行刪除
      if (moved) {
        onRemoveBullet?.();
      }
      return;
    }
    
    // 箭頭鍵導航
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      BulletManager.focusPrevious(groupId, index);
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      BulletManager.focusNext(groupId, index);
      return;
    }
    
    if (e.key === 'ArrowLeft' && isCaretAtStart()) {
      e.preventDefault();
      BulletManager.focusPrevious(groupId, index);
      return;
    }
    
    if (e.key === 'ArrowRight' && isCaretAtEnd()) {
      e.preventDefault();
      BulletManager.focusNext(groupId, index);
      return;
    }
  }, [groupId, index, isCaretAtStart, isCaretAtEnd, isEmpty, onAddBullet, onRemoveBullet]);
  
  // 註冊到 BulletManager
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const bulletPoint: BulletPoint = {
      id: bulletIdRef.current,
      groupId,
      index,
      element,
      isEmpty,
      focus: focusElement
    };
    
    BulletManager.register(bulletPoint);
    
    return () => {
      BulletManager.unregister(groupId, index);
    };
  }, [groupId, index, isEmpty, focusElement]);
  
  // 文本變化處理
  const handleInput = useCallback((e: React.FormEvent<HTMLElement>) => {
    const element = e.currentTarget;
    const text = element.innerText || '';
    onChange?.(text);
  }, [onChange]);
  
  return {
    elementRef,
    handleKeyDown,
    handleInput,
    focusElement,
    isEmpty,
    isCaretAtStart,
    isCaretAtEnd
  };
}