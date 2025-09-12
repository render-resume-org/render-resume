// Shared types for inline editing components
export type InlineGroupId = string;
export type NavOrder = number;
export type HighlightType = 'set' | 'insert';
export type CaretPositionType = 'start' | 'end';

// Enhanced caret position from navigation system
export interface EnhancedCaretPosition {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  lineNumber: number;
  totalLines: number;
  isInMiddle: boolean;
}
export type NavigationDirection = 'prev' | 'next';

export interface InlineFocusDetail {
  groupId: InlineGroupId;
  index: number;
  position?: CaretPosition;
}

export interface InlineEditableProps {
  text: string;
  className?: string;
  inlineEditable?: boolean;
  onChange?: (next: string) => void;
  // Highlight for preview/diff
  highlightType?: HighlightType;
  // Optional git-like diff rendering when previewing a replacement
  previewOriginal?: string;
  previewReplaceWith?: string;
  // Navigation grouping
  groupId?: InlineGroupId;
  // Global navigation order across resume; smaller first. When omitted, DOM order is used
  navOrder?: NavOrder;
}

export interface BulletEditableProps extends InlineEditableProps {
  // Bullet behavior
  isBullet?: boolean;
  onAddBullet?: () => void;
  onRemoveBullet?: () => void;
}

export interface KeyboardNavigationHandlers {
  isCaretAtStart: () => boolean;
  isCaretAtEnd: () => boolean;
  focusElement: (el: HTMLElement, position: CaretPositionType) => void;
  moveToSibling: (direction: NavigationDirection) => void;
}