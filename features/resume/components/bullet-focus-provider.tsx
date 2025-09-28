import React, { createContext, useCallback, useContext, useRef } from 'react';

interface BulletFocusContextValue {
  registerBulletRef: (groupId: string, bulletId: string, ref: HTMLElement) => void;
  unregisterBulletRef: (groupId: string, bulletId: string) => void;
  focusBullet: (groupId: string, bulletId: string, position?: 'start' | 'end') => boolean;
  focusNextBullet: (groupId: string, currentBulletId: string) => boolean;
  focusPrevBullet: (groupId: string, currentBulletId: string) => boolean;
  getBulletIds: (groupId: string) => string[];
  // Coordinated removal and focus
  removeAndFocusPrevious: (groupId: string, bulletId: string, onRemove: () => void) => void;
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

  const removeAndFocusPrevious = useCallback((groupId: string, bulletId: string, onRemove: () => void) => {
    const groupOrder = bulletOrderRef.current.get(groupId);
    if (!groupOrder) {
      onRemove();
      return;
    }

    const currentIndex = groupOrder.indexOf(bulletId);
    if (currentIndex === -1) {
      onRemove();
      return;
    }

    // Determine focus target before removal
    let focusTarget: { type: 'bullet' | 'fallback'; bulletId?: string } | null = null;

    if (currentIndex > 0) {
      // Focus previous bullet
      const prevBulletId = groupOrder[currentIndex - 1];
      focusTarget = { type: 'bullet', bulletId: prevBulletId };
    } else {
      // No previous bullet, use fallback strategy (focus last field)
      focusTarget = { type: 'fallback' };
    }

    // Remove the bullet from our tracking immediately
    groupOrder.splice(currentIndex, 1);
    const groupRefs = bulletRefsRef.current.get(groupId);
    if (groupRefs) {
      groupRefs.delete(bulletId);
    }

    // Execute the actual removal
    onRemove();

    // Schedule focus after React has updated the DOM
    setTimeout(() => {
      if (focusTarget?.type === 'bullet' && focusTarget.bulletId) {
        const success = focusBullet(groupId, focusTarget.bulletId, 'end');
        if (!success) {
          // Fallback: try to focus any available previous bullet
          const updatedOrder = bulletOrderRef.current.get(groupId) || [];
          if (updatedOrder.length > 0) {
            focusBullet(groupId, updatedOrder[updatedOrder.length - 1], 'end');
          }
        }
      } else {
        // Fallback strategy: focus last available field
        // Try to find the last non-bullet inline field first, then fall back to last bullet

        // Look for inline text fields with higher navOrder (non-bullet fields typically have different navOrder patterns)
        const allInlineElements = document.querySelectorAll<HTMLElement>('[data-inline-group]');
        const sortedElements = Array.from(allInlineElements)
          .map(el => ({
            element: el,
            navOrder: parseInt(el.dataset.inlineOrder || '0'),
            groupId: el.dataset.inlineGroup || '',
          }))
          .sort((a, b) => b.navOrder - a.navOrder); // Sort by navOrder descending

        // Try to focus the highest navOrder non-bullet field
        let focused = false;
        for (const item of sortedElements) {
          // Skip bullet groups - they typically end with '-outcomes'
          if (!item.groupId.endsWith('-outcomes')) {
            item.element.focus();
            focused = true;
            break;
          }
        }

        // If no non-bullet field found, focus the last available bullet
        if (!focused) {
          const allGroups = Array.from(bulletOrderRef.current.keys());
          for (let i = allGroups.length - 1; i >= 0; i--) {
            const group = allGroups[i];
            const bullets = bulletOrderRef.current.get(group) || [];
            if (bullets.length > 0) {
              focusBullet(group, bullets[bullets.length - 1], 'end');
              break;
            }
          }
        }
      }
    }, 50);
  }, [focusBullet]);

  const value: BulletFocusContextValue = {
    registerBulletRef,
    unregisterBulletRef,
    focusBullet,
    focusNextBullet,
    focusPrevBullet,
    getBulletIds,
    removeAndFocusPrevious,
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