import { useCallback, useState } from 'react';
import { getRandomCannedMessages } from '../lib/resume-editor-config';

export function useCannedMessages() {
  const [cannedOptions, setCannedOptions] = useState<string[]>([]);

  const initializeCannedMessages = useCallback(() => {
    setCannedOptions(getRandomCannedMessages());
  }, []);

  const updateCannedOptions = useCallback((quickResponses?: string[], hasSuggestion: boolean = false) => {
    if (quickResponses && Array.isArray(quickResponses)) {
      if (hasSuggestion) {
        // 有 suggestion 時，不顯示「下一題！」
        setCannedOptions(['好呀！', ...quickResponses]);
      } else {
        // 沒有 suggestion 時，顯示「下一題！」在最前面
        setCannedOptions(['下一題！', ...quickResponses]);
      }
    } else {
      setCannedOptions(getRandomCannedMessages());
    }
  }, []);

  return {
    cannedOptions,
    setCannedOptions,
    initializeCannedMessages,
    updateCannedOptions
  };
}