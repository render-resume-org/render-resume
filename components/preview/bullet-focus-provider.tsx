import React, { createContext, useCallback, useContext, useRef } from 'react';

interface BulletFocusContextValue {
  registerBulletRef: (groupId: string, bulletId: string, ref: HTMLElement) => void;
  unregisterBulletRef: (groupId: string, bulletId: string) => void;
  focusBullet: (groupId: string, bulletId: string, position?: 'start' | 'end') => boolean;
  focusNextBullet: (groupId: string, currentBulletId: string) => boolean;
  focusPrevBullet: (groupId: string, currentBulletId: string) => boolean;
  getBulletIds: (groupId: string) => string[];
}

const BulletFocusContext = createContext<BulletFocusContextValue | null>(null);

export interface BulletFocusProviderProps {
  children: React.ReactNode;
}

export function BulletFocusProvider({ children }: BulletFocusProviderProps) {
  // Map of groupId -> bulletId -> HTMLElement
  const bulletRefsRef = useRef<Map<string, Map<string, HTMLElement>>>(new Map());
  // Track ordered bullet IDs per group
  const bulletOrderRef = useRef<Map<string, string[]>>(new Map());

  const registerBulletRef = useCallback((groupId: string, bulletId: string, ref: HTMLElement) => {
    if (!bulletRefsRef.current.has(groupId)) {
      bulletRefsRef.current.set(groupId, new Map());
      bulletOrderRef.current.set(groupId, []);
    }

    const groupRefs = bulletRefsRef.current.get(groupId)!;
    const groupOrder = bulletOrderRef.current.get(groupId)!;

    // Register the ref
    groupRefs.set(bulletId, ref);

    // Add to order if not already present
    if (!groupOrder.includes(bulletId)) {
      groupOrder.push(bulletId);
    }
  }, []);

  const unregisterBulletRef = useCallback((groupId: string, bulletId: string) => {
    const groupRefs = bulletRefsRef.current.get(groupId);
    const groupOrder = bulletOrderRef.current.get(groupId);

    if (groupRefs) {
      groupRefs.delete(bulletId);
    }

    if (groupOrder) {
      const index = groupOrder.indexOf(bulletId);
      if (index !== -1) {
        groupOrder.splice(index, 1);
      }
    }
  }, []);

  const focusElement = useCallback((element: HTMLElement, position: 'start' | 'end' = 'start') => {
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(position === 'start');
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, []);

  const focusBullet = useCallback((groupId: string, bulletId: string, position: 'start' | 'end' = 'start'): boolean => {
    const groupRefs = bulletRefsRef.current.get(groupId);
    const element = groupRefs?.get(bulletId);

    if (element) {
      focusElement(element, position);
      return true;
    }

    return false;
  }, [focusElement]);

  const focusNextBullet = useCallback((groupId: string, currentBulletId: string): boolean => {
    const groupOrder = bulletOrderRef.current.get(groupId);
    if (!groupOrder) return false;

    const currentIndex = groupOrder.indexOf(currentBulletId);
    if (currentIndex === -1 || currentIndex >= groupOrder.length - 1) return false;

    const nextBulletId = groupOrder[currentIndex + 1];
    return focusBullet(groupId, nextBulletId, 'start');
  }, [focusBullet]);

  const focusPrevBullet = useCallback((groupId: string, currentBulletId: string): boolean => {
    const groupOrder = bulletOrderRef.current.get(groupId);
    if (!groupOrder) return false;

    const currentIndex = groupOrder.indexOf(currentBulletId);
    if (currentIndex <= 0) return false;

    const prevBulletId = groupOrder[currentIndex - 1];
    return focusBullet(groupId, prevBulletId, 'end');
  }, [focusBullet]);

  const getBulletIds = useCallback((groupId: string): string[] => {
    return bulletOrderRef.current.get(groupId) || [];
  }, []);

  const value: BulletFocusContextValue = {
    registerBulletRef,
    unregisterBulletRef,
    focusBullet,
    focusNextBullet,
    focusPrevBullet,
    getBulletIds,
  };

  return (
    <BulletFocusContext.Provider value={value}>
      {children}
    </BulletFocusContext.Provider>
  );
}

export function useBulletFocus() {
  const context = useContext(BulletFocusContext);
  if (!context) {
    throw new Error('useBulletFocus must be used within a BulletFocusProvider');
  }
  return context;
}

export function useOptionalBulletFocus() {
  return useContext(BulletFocusContext);
}