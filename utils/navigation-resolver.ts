import type { CaretPosition } from './caret-detection';

export enum NavigationAction {
  MOVE_TO_LINE_START = 'line_start',
  MOVE_TO_LINE_END = 'line_end',
  MOVE_TO_PREVIOUS_FIELD = 'prev_field',
  MOVE_TO_NEXT_FIELD = 'next_field',
  // New multi-line navigation actions
  MOVE_TO_PREVIOUS_LINE_END = 'prev_line_end',
  MOVE_TO_NEXT_LINE_START = 'next_line_start',
  NO_ACTION = 'none'
}

export interface NavigationContext {
  key: string;
  caretPosition: CaretPosition;
  isBullet: boolean;
  isFirstBulletInGroup?: boolean;
  isLastBulletInGroup?: boolean;
}

/**
 * Navigation action resolver that determines what navigation action to take
 * based on key press and current caret position
 */
export class NavigationResolver {
  
  /**
   * Resolve navigation action based on context
   */
  static resolveAction(context: NavigationContext): NavigationAction {
    const { key, caretPosition, isBullet, isFirstBulletInGroup, isLastBulletInGroup } = context;
    
    switch (key) {
      case 'ArrowUp':
        return this.resolveUpArrow(caretPosition, isBullet, isFirstBulletInGroup);
        
      case 'ArrowDown':
        return this.resolveDownArrow(caretPosition, isBullet, isLastBulletInGroup);
        
      case 'ArrowLeft':
        return this.resolveLeftArrow(caretPosition, isBullet, isFirstBulletInGroup);
        
      case 'ArrowRight':
        return this.resolveRightArrow(caretPosition, isBullet, isLastBulletInGroup);
        
      default:
        return NavigationAction.NO_ACTION;
    }
  }

  /**
   * Resolve Up arrow navigation
   * - If in middle of line → Move to line start
   * - If at line start AND has previous line → Move to previous line end
   * - If at element start (first line) → Move to previous field
   */
  private static resolveUpArrow(
    caretPosition: CaretPosition, 
    isBullet: boolean, 
    isFirstBulletInGroup?: boolean
  ): NavigationAction {
    // If in middle of line, move to line start
    if (caretPosition.isInMiddle) {
      return NavigationAction.MOVE_TO_LINE_START;
    }
    
    // If at line start and has previous line, move to previous line end
    if (caretPosition.isAtLineStart && caretPosition.lineNumber > 0) {
      return NavigationAction.MOVE_TO_PREVIOUS_LINE_END;
    }
    
    // If at element start (first line start), move to previous field
    if (caretPosition.isAtStart) {
      // For bullets, check if this is the first bullet in group
      if (isBullet && !isFirstBulletInGroup) {
        return NavigationAction.NO_ACTION; // Let bullet system handle it
      }
      return NavigationAction.MOVE_TO_PREVIOUS_FIELD;
    }
    
    return NavigationAction.NO_ACTION;
  }

  /**
   * Resolve Down arrow navigation  
   * - If in middle of line → Move to line end
   * - If at line end AND has next line → Move to next line start
   * - If at element end (last line) → Move to next field
   */
  private static resolveDownArrow(
    caretPosition: CaretPosition, 
    isBullet: boolean, 
    isLastBulletInGroup?: boolean
  ): NavigationAction {
    // If in middle of line, move to line end
    if (caretPosition.isInMiddle) {
      return NavigationAction.MOVE_TO_LINE_END;
    }
    
    // If at line end and has next line, move to next line start
    if (caretPosition.isAtLineEnd && caretPosition.lineNumber < caretPosition.totalLines - 1) {
      return NavigationAction.MOVE_TO_NEXT_LINE_START;
    }
    
    // If at element end (last line end), move to next field
    if (caretPosition.isAtEnd) {
      // For bullets, check if this is the last bullet in group
      if (isBullet && !isLastBulletInGroup) {
        return NavigationAction.NO_ACTION; // Let bullet system handle it
      }
      return NavigationAction.MOVE_TO_NEXT_FIELD;
    }
    
    return NavigationAction.NO_ACTION;
  }

  /**
   * Resolve Left arrow navigation
   * - If at line start AND has previous line → Move to previous line end
   * - If at element start → Move to previous field
   */
  private static resolveLeftArrow(
    caretPosition: CaretPosition, 
    isBullet: boolean, 
    isFirstBulletInGroup?: boolean
  ): NavigationAction {
    // If at line start and has previous line, move to previous line end
    if (caretPosition.isAtLineStart && caretPosition.lineNumber > 0) {
      return NavigationAction.MOVE_TO_PREVIOUS_LINE_END;
    }
    
    // If at element start, move to previous field
    if (caretPosition.isAtStart) {
      // For bullets, check if this is the first bullet in group
      if (isBullet && !isFirstBulletInGroup) {
        return NavigationAction.NO_ACTION; // Let bullet system handle it
      }
      return NavigationAction.MOVE_TO_PREVIOUS_FIELD;
    }
    
    return NavigationAction.NO_ACTION;
  }

  /**
   * Resolve Right arrow navigation
   * - If at line end AND has next line → Move to next line start
   * - If at element end → Move to next field
   */
  private static resolveRightArrow(
    caretPosition: CaretPosition, 
    isBullet: boolean, 
    isLastBulletInGroup?: boolean
  ): NavigationAction {
    // If at line end and has next line, move to next line start
    if (caretPosition.isAtLineEnd && caretPosition.lineNumber < caretPosition.totalLines - 1) {
      return NavigationAction.MOVE_TO_NEXT_LINE_START;
    }
    
    // If at element end, move to next field
    if (caretPosition.isAtEnd) {
      // For bullets, check if this is the last bullet in group
      if (isBullet && !isLastBulletInGroup) {
        return NavigationAction.NO_ACTION; // Let bullet system handle it
      }
      return NavigationAction.MOVE_TO_NEXT_FIELD;
    }
    
    return NavigationAction.NO_ACTION;
  }

  /**
   * Check if action should be handled by this system
   */
  static shouldHandle(action: NavigationAction): boolean {
    return action !== NavigationAction.NO_ACTION;
  }

  /**
   * Check if action is a field navigation (cross-element)
   */
  static isFieldNavigation(action: NavigationAction): boolean {
    return action === NavigationAction.MOVE_TO_PREVIOUS_FIELD || 
           action === NavigationAction.MOVE_TO_NEXT_FIELD;
  }

  /**
   * Check if action is a line navigation (within element)
   */
  static isLineNavigation(action: NavigationAction): boolean {
    return action === NavigationAction.MOVE_TO_LINE_START || 
           action === NavigationAction.MOVE_TO_LINE_END ||
           action === NavigationAction.MOVE_TO_PREVIOUS_LINE_END ||
           action === NavigationAction.MOVE_TO_NEXT_LINE_START;
  }
}