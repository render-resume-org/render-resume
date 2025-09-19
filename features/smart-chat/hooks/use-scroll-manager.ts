import { useCallback, useRef } from 'react';
import { SuggestionRecord } from '../types/resume-editor';

export function useScrollManager() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaRefMobile = useRef<HTMLDivElement>(null);
  const suggestionsScrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRefMobile = useRef<HTMLDivElement>(null);

  // 改進的自動滾動函數 - 專門針對 Radix UI ScrollArea
  const scrollToBottom = useCallback((
    scrollAreaRef: React.RefObject<HTMLDivElement | null>,
    messagesEndRef: React.RefObject<HTMLDivElement | null> | null,
    smooth: boolean = false
  ) => {
    console.log('[ScrollToBottom] Attempting to scroll, refs:', {
      scrollAreaRef: !!scrollAreaRef.current,
      messagesEndRef: !!messagesEndRef?.current,
      smooth
    });

    if (!scrollAreaRef.current) {
      console.warn('[ScrollToBottom] No scrollAreaRef available');
      return;
    }

    // 查找 Radix UI ScrollArea 的 viewport
    const viewport = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement;

    if (!viewport) {
      console.warn('[ScrollToBottom] No viewport found in ScrollArea');
      return;
    }

    console.log('[ScrollToBottom] Found viewport:', viewport, 'scrollHeight:', viewport.scrollHeight, 'clientHeight:', viewport.clientHeight);

    // 方法1: 優先使用 messagesEndRef 的 scrollIntoView
    if (messagesEndRef?.current) {
      try {
        console.log('[ScrollToBottom] Trying scrollIntoView on messagesEndRef');
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end',
          inline: 'nearest'
        });
        console.log('[ScrollToBottom] scrollIntoView successful');
        return;
      } catch (error) {
        console.warn('[ScrollToBottom] scrollIntoView failed:', error);
      }
    }

    // 方法2: 直接設置 viewport 的 scrollTop
    try {
      const maxScroll = viewport.scrollHeight - viewport.clientHeight;
      console.log('[ScrollToBottom] Setting scrollTop to:', maxScroll);

      if (smooth) {
        viewport.scrollTo({
          top: maxScroll,
          behavior: 'smooth'
        });
      } else {
        viewport.scrollTop = maxScroll;
      }

      console.log('[ScrollToBottom] Manual scroll completed, actual scrollTop:', viewport.scrollTop);

      // 使用 requestAnimationFrame 確保滾動
      requestAnimationFrame(() => {
        viewport.scrollTop = maxScroll;
        console.log('[ScrollToBottom] RAF scroll, final scrollTop:', viewport.scrollTop);
      });

    } catch (error) {
      console.warn('[ScrollToBottom] Manual scroll failed:', error);
    }
  }, []);

  // 智能滾動函數 - 根據當前螢幕尺寸選擇正確的容器
  const smartScrollToBottom = useCallback((smooth: boolean = false, suggestions: SuggestionRecord[] = []) => {
    // 檢查當前是否為手機版視窗
    const isMobile = window.innerWidth < 1024; // lg 斷點

    console.log(`[SmartScroll] Screen width: ${window.innerWidth}, isMobile: ${isMobile}, suggestions: ${suggestions.length}`);

    if (isMobile) {
      // 手機版滾動
      console.log('[SmartScroll] Using mobile scroll');
      scrollToBottom(scrollAreaRefMobile, messagesEndRefMobile, smooth);
    } else {
      // 桌面版滾動
      console.log('[SmartScroll] Using desktop scroll');
      scrollToBottom(scrollAreaRef, messagesEndRef, smooth);

      // 桌面版額外確保 - 建議面板可能影響布局
      if (suggestions.length > 0) {
        console.log('[SmartScroll] Desktop with suggestions - additional scroll attempts');
        setTimeout(() => {
          scrollToBottom(scrollAreaRef, messagesEndRef, false);
        }, 100);
      }
    }
  }, [scrollToBottom]);

  return {
    scrollAreaRef,
    scrollAreaRefMobile,
    suggestionsScrollAreaRef,
    messagesEndRef,
    messagesEndRefMobile,
    scrollToBottom,
    smartScrollToBottom
  };
}