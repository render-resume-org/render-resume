import { useCallback, useRef } from 'react';
import { CaretDetector } from '../utils/caret-detection';
import { NavigationResolver, NavigationAction, type NavigationContext } from '../utils/navigation-resolver';
import type { InlineGroupId, EnhancedCaretPosition } from '../types/inline-editor';

export interface NavigationManagerOptions {
  elementRef: React.RefObject<HTMLElement | null>;
  groupId: InlineGroupId;
  navOrder?: number;
  isBullet?: boolean;
  onNavigateToField?: (direction: 'prev' | 'next') => void;
}

export interface NavigationManagerHandlers {
  handleNavigation: (e: React.KeyboardEvent) => boolean;
  moveToLineStart: () => void;
  moveToLineEnd: () => void;
  getCaretPosition: () => EnhancedCaretPosition | null;
}

/**
 * Unified navigation manager that coordinates caret detection,
 * action resolution, and navigation execution
 */
export function useNavigationManager(options: NavigationManagerOptions): NavigationManagerHandlers {
  const { elementRef, groupId, navOrder, isBullet, onNavigateToField } = options;
  const lastNavigationRef = useRef<{ action: NavigationAction; timestamp: number } | null>(null);

  /**
   * Get enhanced caret position information
   */
  const getCaretPosition = useCallback((): EnhancedCaretPosition | null => {
    const element = elementRef.current;
    if (!element) return null;
    
    return CaretDetector.getCaretPosition(element);
  }, [elementRef]);

  /**
   * Move caret to line start
   */
  const moveToLineStart = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    
    CaretDetector.moveCaretTo(element, 'line-start');
  }, [elementRef]);

  /**
   * Move caret to line end
   */
  const moveToLineEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    
    CaretDetector.moveCaretTo(element, 'line-end');
  }, [elementRef]);

  /**
   * Navigate to previous field using navOrder
   */
  const navigateToPreviousField = useCallback(() => {
    if (onNavigateToField) {
      onNavigateToField('prev');
      return;
    }

    // Fallback to global navigation using navOrder
    const element = elementRef.current;
    if (!element || navOrder === undefined) return;

    const allNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-inline-order]'))
      .filter(node => node.dataset.inlineOrder !== undefined)
      .map((node, i) => ({
        node,
        i,
        order: Number(node.dataset.inlineOrder)
      }))
      .sort((a, b) => (a.order - b.order) || (a.i - b.i))
      .map(n => n.node);

    const currentIndex = allNodes.indexOf(element);
    const targetElement = allNodes[currentIndex - 1];
    
    if (targetElement) {
      CaretDetector.moveCaretTo(targetElement, 'end');
      targetElement.focus();
    }
  }, [elementRef, navOrder, onNavigateToField]);

  /**
   * Navigate to next field using navOrder
   */
  const navigateToNextField = useCallback(() => {
    if (onNavigateToField) {
      onNavigateToField('next');
      return;
    }

    // Fallback to global navigation using navOrder
    const element = elementRef.current;
    if (!element || navOrder === undefined) return;

    const allNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-inline-order]'))
      .filter(node => node.dataset.inlineOrder !== undefined)
      .map((node, i) => ({
        node,
        i,
        order: Number(node.dataset.inlineOrder)
      }))
      .sort((a, b) => (a.order - b.order) || (a.i - b.i))
      .map(n => n.node);

    const currentIndex = allNodes.indexOf(element);
    const targetElement = allNodes[currentIndex + 1];
    
    if (targetElement) {
      CaretDetector.moveCaretTo(targetElement, 'start');
      targetElement.focus();
    }
  }, [elementRef, navOrder, onNavigateToField]);

  /**
   * Get bullet context information
   */
  const getBulletContext = useCallback(() => {
    if (!isBullet || !elementRef.current) {
      return { isFirstBulletInGroup: false, isLastBulletInGroup: false };
    }

    const element = elementRef.current;
    const bulletElements = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`)
    );
    
    const currentIndex = bulletElements.indexOf(element);
    const isFirstBulletInGroup = currentIndex === 0;
    const isLastBulletInGroup = currentIndex === bulletElements.length - 1;

    return { isFirstBulletInGroup, isLastBulletInGroup };
  }, [isBullet, elementRef, groupId]);

  /**
   * Move caret to previous line end
   */
  const moveToPreviousLineEnd = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    
    CaretDetector.moveCaretTo(element, 'prev-line-end');
  }, [elementRef]);

  /**
   * Move caret to next line start
   */
  const moveToNextLineStart = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;
    
    CaretDetector.moveCaretTo(element, 'next-line-start');
  }, [elementRef]);

  /**
   * Execute navigation action
   */
  const executeAction = useCallback((action: NavigationAction) => {
    switch (action) {
      case NavigationAction.MOVE_TO_LINE_START:
        moveToLineStart();
        break;
        
      case NavigationAction.MOVE_TO_LINE_END:
        moveToLineEnd();
        break;
        
      case NavigationAction.MOVE_TO_PREVIOUS_LINE_END:
        moveToPreviousLineEnd();
        break;
        
      case NavigationAction.MOVE_TO_NEXT_LINE_START:
        moveToNextLineStart();
        break;
        
      case NavigationAction.MOVE_TO_PREVIOUS_FIELD:
        navigateToPreviousField();
        break;
        
      case NavigationAction.MOVE_TO_NEXT_FIELD:
        navigateToNextField();
        break;
        
      default:
        return false;
    }
    
    return true;
  }, [moveToLineStart, moveToLineEnd, moveToPreviousLineEnd, moveToNextLineStart, navigateToPreviousField, navigateToNextField]);

  /**
   * Handle navigation with enhanced logic
   */
  const handleNavigation = useCallback((e: React.KeyboardEvent): boolean => {
    // Only handle arrow keys
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      return false;
    }

    const caretPosition = getCaretPosition();
    if (!caretPosition) return false;

    // Get bullet context
    const { isFirstBulletInGroup, isLastBulletInGroup } = getBulletContext();

    // Create navigation context
    const context: NavigationContext = {
      key: e.key,
      caretPosition,
      isBullet: Boolean(isBullet),
      isFirstBulletInGroup,
      isLastBulletInGroup
    };

    // Resolve navigation action
    const action = NavigationResolver.resolveAction(context);
    
    // Check if we should handle this action
    if (!NavigationResolver.shouldHandle(action)) {
      return false;
    }

    // Prevent default browser behavior
    e.preventDefault();

    // Execute the action
    const handled = executeAction(action);
    
    // Track last navigation for debugging
    if (handled) {
      lastNavigationRef.current = {
        action,
        timestamp: Date.now()
      };
    }

    return handled;
  }, [getCaretPosition, getBulletContext, isBullet, executeAction]);

  return {
    handleNavigation,
    moveToLineStart,
    moveToLineEnd,
    getCaretPosition
  };
}