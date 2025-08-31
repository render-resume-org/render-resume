import { UnifiedResume } from '@/lib/types/resume-unified';
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for managing resume editing state with real-time sessionStorage updates
 * Provides seamless editing experience with automatic persistence
 */
export function useResumeEditor() {
  const [resumeData, setResumeData] = useState<UnifiedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load resume data from sessionStorage
  const loadResumeData = useCallback(() => {
    try {
      const storedResume = sessionStorage.getItem('resume');
      if (storedResume) {
        const parsed = JSON.parse(storedResume) as UnifiedResume;
        setResumeData(parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Failed to load resume data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update resume data with real-time sessionStorage persistence
  const updateResumeData = useCallback((updater: UnifiedResume | ((prev: UnifiedResume) => UnifiedResume)) => {
    setResumeData(prev => {
      const newData = typeof updater === 'function' ? updater(prev!) : updater;
      
      // Persist to sessionStorage immediately
      try {
        sessionStorage.setItem('resume', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save resume data to sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Update specific section of the resume
  const updateResumeSection = useCallback(<K extends keyof UnifiedResume>(
    section: K, 
    updater: UnifiedResume[K] | ((prev: UnifiedResume[K]) => UnifiedResume[K])
  ) => {
    setResumeData(prev => {
      if (!prev) return prev;
      
      const newSectionData = typeof updater === 'function' ? updater(prev[section]) : updater;
      const newData = { ...prev, [section]: newSectionData };
      
      // Persist to sessionStorage immediately
      try {
        sessionStorage.setItem('resume', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save resume section to sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Update specific item in an array section
  const updateResumeItem = useCallback(<K extends keyof UnifiedResume>(
    section: K,
    index: number,
    updater: Partial<UnifiedResume[K] extends Array<infer U> ? U : never>
  ) => {
    setResumeData(prev => {
      if (!prev || !Array.isArray(prev[section])) return prev;
      
      const sectionArray = prev[section] as Array<any>;
      if (index < 0 || index >= sectionArray.length) return prev;
      
      const updatedItem = { ...sectionArray[index], ...updater };
      const newSectionArray = [...sectionArray];
      newSectionArray[index] = updatedItem;
      
      const newData = { ...prev, [section]: newSectionArray };
      
      // Persist to sessionStorage immediately
      try {
        sessionStorage.setItem('resume', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to save resume item to sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Add new item to an array section
  const addResumeItem = useCallback(<K extends keyof UnifiedResume>(
    section: K,
    item: UnifiedResume[K] extends Array<infer U> ? U : never
  ) => {
    setResumeData(prev => {
      if (!prev || !Array.isArray(prev[section])) return prev;
      
      const sectionArray = prev[section] as Array<any>;
      const newSectionArray = [...sectionArray, item];
      const newData = { ...prev, [section]: newSectionArray };
      
      // Persist to sessionStorage immediately
      try {
        sessionStorage.setItem('resume', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to add resume item to sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Remove item from an array section
  const removeResumeItem = useCallback(<K extends keyof UnifiedResume>(
    section: K,
    index: number
  ) => {
    setResumeData(prev => {
      if (!prev || !Array.isArray(prev[section])) return prev;
      
      const sectionArray = prev[section] as Array<any>;
      if (index < 0 || index >= sectionArray.length) return prev;
      
      const newSectionArray = sectionArray.filter((_, i) => i !== index);
      const newData = { ...prev, [section]: newSectionArray };
      
      // Persist to sessionStorage immediately
      try {
        sessionStorage.setItem('resume', JSON.stringify(newData));
      } catch (error) {
        console.error('Failed to remove resume item from sessionStorage:', error);
      }
      
      return newData;
    });
  }, []);

  // Initialize on mount
  useEffect(() => {
    loadResumeData();
  }, [loadResumeData]);

  return {
    resumeData,
    isLoading,
    updateResumeData,
    updateResumeSection,
    updateResumeItem,
    addResumeItem,
    removeResumeItem,
    loadResumeData,
  };
}
