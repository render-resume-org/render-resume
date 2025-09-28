import { useCallback, useRef, useState } from 'react';

export function useInputManager() {
  const [currentInput, setCurrentInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefMobile = useRef<HTMLTextAreaElement>(null);

  // 自動調整 textarea 高度的函數
  const adjustTextareaHeight = useCallback((value: string) => {
    // 手機版不自動調整高度
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const textareas = [textareaRef.current, textareaRefMobile.current].filter(Boolean);
    textareas.forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
        const lineHeight = 24;
        const lines = value.split('\n').length;
        const contentHeight = Math.max(40, lines * lineHeight);
        const maxHeight = 120;
        textarea.style.height = Math.min(contentHeight, maxHeight) + 'px';
      }
    });
  }, []);

  const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCurrentInput(value);
    adjustTextareaHeight(value);
  }, [setCurrentInput, adjustTextareaHeight]);

  const resetTextareaHeight = useCallback(() => {
    [textareaRef.current, textareaRefMobile.current].forEach(textarea => {
      if (textarea) {
        textarea.style.height = 'auto';
      }
    });
  }, []);

  return {
    currentInput,
    setCurrentInput,
    textareaRef,
    textareaRefMobile,
    adjustTextareaHeight,
    handleTextareaChange,
    resetTextareaHeight
  };
}