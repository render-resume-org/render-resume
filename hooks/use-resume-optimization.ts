import { useCallback, useEffect, useState } from 'react';

/**
 * 履歷模板相關狀態管理的自定義 Hook
 */
export function useResumeTemplate() {
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('standard');

  // 載入儲存的模板ID
  useEffect(() => {
    const savedTemplateId = localStorage.getItem('selectedTemplateId');
    if (savedTemplateId) {
      setCurrentTemplateId(savedTemplateId);
    }
  }, []);

  // 更新模板ID
  const updateTemplateId = useCallback((templateId: string) => {
    setCurrentTemplateId(templateId);
    localStorage.setItem('selectedTemplateId', templateId);
  }, []);

  return {
    currentTemplateId,
    updateTemplateId,
  };
}

/**
 * 複製履歷文字功能的自定義 Hook
 */
export function useResumeCopy() {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyResumeText = useCallback(async (elementId: string = 'resume-content') => {
    try {
      const resumeContent = document.getElementById(elementId)?.innerText || '';
      await navigator.clipboard.writeText(resumeContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
      return true;
    } catch (error) {
      console.error('複製失敗:', error);
      throw new Error('複製失敗，請手動選擇文字複製');
    }
  }, []);

  return {
    copySuccess,
    copyResumeText,
  };
}