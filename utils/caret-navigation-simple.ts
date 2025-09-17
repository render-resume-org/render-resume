/**
 * Simplified Robust Caret Navigation
 * Direct implementation of the 6 requirements with error handling
 */

// Simplified types
interface CaretInfo {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  isInMiddle: boolean;
  lineNumber: number;
  totalLines: number;
  textContent: string;
}

// Simple result wrapper
type SimpleResult<T> = { success: true; data: T } | { success: false; error: string };

export class SimpleCaretNavigation {
  private static instance: SimpleCaretNavigation | null = null;
  private registeredElements = new Map<HTMLElement, { navOrder: number; groupId: string; isBullet: boolean }>();

  static getInstance(): SimpleCaretNavigation {
    if (!SimpleCaretNavigation.instance) {
      SimpleCaretNavigation.instance = new SimpleCaretNavigation();
    }
    return SimpleCaretNavigation.instance;
  }

  private constructor() {}

  registerElement(element: HTMLElement, options: { navOrder?: number; groupId?: string; isBullet?: boolean } = {}): void {
    const navOrder = options.navOrder ?? parseInt(element.getAttribute('data-inline-order') || '0');
    const groupId = options.groupId ?? (element.getAttribute('data-inline-group') || 'default');
    const isBullet = options.isBullet ?? false;

    this.registeredElements.set(element, { navOrder, groupId, isBullet });
  }

  unregisterElement(element: HTMLElement): void {
    this.registeredElements.delete(element);
  }

  /**
   * Handle keyboard navigation with all 6 requirements
   */
  handleNavigation(element: HTMLElement, key: string): SimpleResult<boolean> {
    try {
      const caretInfo = this.getCaretInfo(element);
      if (!caretInfo.success) {
        return { success: false, error: caretInfo.error };
      }

      const caret = caretInfo.data;
      const elementInfo = this.registeredElements.get(element);

      switch (key) {
        case 'ArrowUp':
          return this.handleUpArrow(element, caret, elementInfo);
        case 'ArrowDown':
          return this.handleDownArrow(element, caret, elementInfo);
        case 'ArrowLeft':
          return this.handleLeftArrow(element, caret, elementInfo);
        case 'ArrowRight':
          return this.handleRightArrow(element, caret, elementInfo);
        default:
          return { success: true, data: false }; // Not handled
      }
    } catch (error) {
      return { success: false, error: `Navigation failed: ${error}` };
    }
  }

  private handleUpArrow(
    element: HTMLElement, 
    caret: CaretInfo, 
    elementInfo?: { navOrder: number; groupId: string; isBullet: boolean }
  ): SimpleResult<boolean> {
    // Requirement 1: 行間 ↑ → 行首 (In-line Up → Line Start)
    if (caret.isInMiddle) {
      return this.moveToLineStart(element);
    }

    // Requirement 3: 行首 ↑ → 上一行末 (Line Start Up → Previous Line End)
    if (caret.isAtLineStart && caret.lineNumber > 0) {
      return this.moveToPreviousLineEnd(element);
    }

    // Requirement 5: 第一個列點的行首 ↑ → 上一個欄位 (First Bullet Line Start → Previous Field)
    if (caret.isAtStart) {
      if (elementInfo?.isBullet && !this.isFirstInGroup(element, elementInfo.groupId)) {
        return { success: true, data: false }; // Let bullet system handle
      }
      return this.moveToPreviousField(element);
    }

    return { success: true, data: false };
  }

  private handleDownArrow(
    element: HTMLElement, 
    caret: CaretInfo, 
    elementInfo?: { navOrder: number; groupId: string; isBullet: boolean }
  ): SimpleResult<boolean> {
    // Requirement 2: 行間 ↓ → 行末 (In-line Down → Line End)
    if (caret.isInMiddle) {
      return this.moveToLineEnd(element);
    }

    // Requirement 4: 行末 ↓ → 下一行首 (Line End Down → Next Line Start)
    if (caret.isAtLineEnd && caret.lineNumber < caret.totalLines - 1) {
      return this.moveToNextLineStart(element);
    }

    // Requirement 6: 最後一個列點的行末 ↓ → 下一個欄位 (Last Bullet Line End → Next Field)
    if (caret.isAtEnd) {
      if (elementInfo?.isBullet && !this.isLastInGroup(element, elementInfo.groupId)) {
        return { success: true, data: false }; // Let bullet system handle
      }
      return this.moveToNextField(element);
    }

    return { success: true, data: false };
  }

  private handleLeftArrow(
    element: HTMLElement, 
    caret: CaretInfo, 
    elementInfo?: { navOrder: number; groupId: string; isBullet: boolean }
  ): SimpleResult<boolean> {
    // Requirement 3: 行首 ← → 上一行末 (Line Start Left → Previous Line End)
    if (caret.isAtLineStart && caret.lineNumber > 0) {
      return this.moveToPreviousLineEnd(element);
    }

    // Requirement 5: 第一個列點的行首 ← → 上一個欄位 (First Bullet Line Start → Previous Field)
    if (caret.isAtStart) {
      if (elementInfo?.isBullet && !this.isFirstInGroup(element, elementInfo.groupId)) {
        return { success: true, data: false }; // Let bullet system handle
      }
      return this.moveToPreviousField(element);
    }

    return { success: true, data: false };
  }

  private handleRightArrow(
    element: HTMLElement, 
    caret: CaretInfo, 
    elementInfo?: { navOrder: number; groupId: string; isBullet: boolean }
  ): SimpleResult<boolean> {
    // Requirement 4: 行末 → → 下一行首 (Line End Right → Next Line Start)
    if (caret.isAtLineEnd && caret.lineNumber < caret.totalLines - 1) {
      return this.moveToNextLineStart(element);
    }

    // Requirement 6: 最後一個列點的行末 → → 下一個欄位 (Last Bullet Line End → Next Field)
    if (caret.isAtEnd) {
      if (elementInfo?.isBullet && !this.isLastInGroup(element, elementInfo.groupId)) {
        return { success: true, data: false }; // Let bullet system handle
      }
      return this.moveToNextField(element);
    }

    return { success: true, data: false };
  }

  /**
   * Get caret information
   */
  private getCaretInfo(element: HTMLElement): SimpleResult<CaretInfo> {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) {
        return { success: false, error: 'No selection found' };
      }

      const range = selection.getRangeAt(0);
      if (!element.contains(range.startContainer)) {
        return { success: false, error: 'Selection not in element' };
      }

      const textContent = element.textContent || '';
      const preRange = range.cloneRange();
      preRange.selectNodeContents(element);
      preRange.setEnd(range.startContainer, range.startOffset);
      const caretOffset = preRange.toString().length;

      const lines = textContent.split('\n');
      let lineNumber = 0;
      let lineStart = 0;
      let currentOffset = 0;

      for (let i = 0; i < lines.length; i++) {
        const lineEnd = currentOffset + lines[i].length;
        if (caretOffset >= currentOffset && caretOffset <= lineEnd) {
          lineNumber = i;
          lineStart = currentOffset;
          break;
        }
        currentOffset = lineEnd + 1; // +1 for newline
      }

      const lineEnd = lineStart + lines[lineNumber].length;

      return {
        success: true,
        data: {
          isAtStart: caretOffset === 0,
          isAtEnd: caretOffset === textContent.length,
          isAtLineStart: caretOffset === lineStart,
          isAtLineEnd: caretOffset === lineEnd,
          isInMiddle: caretOffset > lineStart && caretOffset < lineEnd,
          lineNumber,
          totalLines: lines.length,
          textContent
        }
      };
    } catch (error) {
      return { success: false, error: `Failed to get caret info: ${error}` };
    }
  }

  /**
   * Move to line start
   */
  private moveToLineStart(element: HTMLElement): SimpleResult<boolean> {
    try {
      const caretInfo = this.getCaretInfo(element);
      if (!caretInfo.success) return { success: false, error: caretInfo.error };

      const lines = caretInfo.data.textContent.split('\n');
      let targetOffset = 0;
      for (let i = 0; i < caretInfo.data.lineNumber; i++) {
        targetOffset += lines[i].length + 1;
      }

      return this.setCaretOffset(element, targetOffset);
    } catch (error) {
      return { success: false, error: `Move to line start failed: ${error}` };
    }
  }

  /**
   * Move to line end
   */
  private moveToLineEnd(element: HTMLElement): SimpleResult<boolean> {
    try {
      const caretInfo = this.getCaretInfo(element);
      if (!caretInfo.success) return { success: false, error: caretInfo.error };

      const lines = caretInfo.data.textContent.split('\n');
      let targetOffset = 0;
      for (let i = 0; i <= caretInfo.data.lineNumber; i++) {
        if (i === caretInfo.data.lineNumber) {
          targetOffset += lines[i].length;
          break;
        }
        targetOffset += lines[i].length + 1;
      }

      return this.setCaretOffset(element, targetOffset);
    } catch (error) {
      return { success: false, error: `Move to line end failed: ${error}` };
    }
  }

  /**
   * Move to previous line end
   */
  private moveToPreviousLineEnd(element: HTMLElement): SimpleResult<boolean> {
    try {
      const caretInfo = this.getCaretInfo(element);
      if (!caretInfo.success) return { success: false, error: caretInfo.error };

      if (caretInfo.data.lineNumber === 0) {
        return this.setCaretOffset(element, 0); // Move to start
      }

      const lines = caretInfo.data.textContent.split('\n');
      let targetOffset = 0;
      for (let i = 0; i < caretInfo.data.lineNumber - 1; i++) {
        targetOffset += lines[i].length + 1;
      }
      targetOffset += lines[caretInfo.data.lineNumber - 1].length;

      return this.setCaretOffset(element, targetOffset);
    } catch (error) {
      return { success: false, error: `Move to previous line end failed: ${error}` };
    }
  }

  /**
   * Move to next line start
   */
  private moveToNextLineStart(element: HTMLElement): SimpleResult<boolean> {
    try {
      const caretInfo = this.getCaretInfo(element);
      if (!caretInfo.success) return { success: false, error: caretInfo.error };

      if (caretInfo.data.lineNumber >= caretInfo.data.totalLines - 1) {
        return this.setCaretOffset(element, caretInfo.data.textContent.length); // Move to end
      }

      const lines = caretInfo.data.textContent.split('\n');
      let targetOffset = 0;
      for (let i = 0; i <= caretInfo.data.lineNumber; i++) {
        targetOffset += lines[i].length + 1;
      }

      return this.setCaretOffset(element, targetOffset);
    } catch (error) {
      return { success: false, error: `Move to next line start failed: ${error}` };
    }
  }

  /**
   * Move to previous field
   */
  private moveToPreviousField(element: HTMLElement): SimpleResult<boolean> {
    try {
      const orderedElements = this.getOrderedElements();
      const currentIndex = orderedElements.indexOf(element);
      
      if (currentIndex <= 0) {
        return { success: true, data: false }; // No previous field
      }

      const previousElement = orderedElements[currentIndex - 1];
      previousElement.focus();
      
      const textLength = (previousElement.textContent || '').length;
      return this.setCaretOffset(previousElement, textLength);
    } catch (error) {
      return { success: false, error: `Move to previous field failed: ${error}` };
    }
  }

  /**
   * Move to next field
   */
  private moveToNextField(element: HTMLElement): SimpleResult<boolean> {
    try {
      const orderedElements = this.getOrderedElements();
      const currentIndex = orderedElements.indexOf(element);
      
      if (currentIndex < 0 || currentIndex >= orderedElements.length - 1) {
        return { success: true, data: false }; // No next field
      }

      const nextElement = orderedElements[currentIndex + 1];
      nextElement.focus();
      
      return this.setCaretOffset(nextElement, 0);
    } catch (error) {
      return { success: false, error: `Move to next field failed: ${error}` };
    }
  }

  /**
   * Set caret at specific offset
   */
  private setCaretOffset(element: HTMLElement, offset: number): SimpleResult<boolean> {
    try {
      const selection = window.getSelection();
      if (!selection) return { success: false, error: 'No selection available' };

      const range = document.createRange();
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

      let currentOffset = 0;
      let targetNode: Node = element;
      let targetOffset = 0;

      let node = walker.nextNode();
      while (node) {
        const nodeLength = node.textContent?.length || 0;
        if (currentOffset + nodeLength >= offset) {
          targetNode = node;
          targetOffset = offset - currentOffset;
          break;
        }
        currentOffset += nodeLength;
        node = walker.nextNode();
      }

      if (targetNode === element && element.childNodes.length === 0) {
        range.setStart(element, 0);
      } else if (targetNode === element) {
        range.setStart(element, Math.min(targetOffset, element.childNodes.length));
      } else {
        range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
      }

      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: `Set caret offset failed: ${error}` };
    }
  }

  /**
   * Get ordered elements
   */
  private getOrderedElements(): HTMLElement[] {
    return Array.from(this.registeredElements.keys())
      .filter(element => element.isConnected)
      .sort((a, b) => {
        const infoA = this.registeredElements.get(a);
        const infoB = this.registeredElements.get(b);
        return (infoA?.navOrder || 0) - (infoB?.navOrder || 0);
      });
  }

  /**
   * Check if element is first in group
   */
  private isFirstInGroup(element: HTMLElement, groupId: string): boolean {
    const groupElements = Array.from(this.registeredElements.entries())
      .filter(([, info]) => info.groupId === groupId)
      .map(([el]) => el)
      .filter(el => el.isConnected)
      .sort((a, b) => {
        const infoA = this.registeredElements.get(a);
        const infoB = this.registeredElements.get(b);
        return (infoA?.navOrder || 0) - (infoB?.navOrder || 0);
      });
    
    return groupElements[0] === element;
  }

  /**
   * Check if element is last in group
   */
  private isLastInGroup(element: HTMLElement, groupId: string): boolean {
    const groupElements = Array.from(this.registeredElements.entries())
      .filter(([, info]) => info.groupId === groupId)
      .map(([el]) => el)
      .filter(el => el.isConnected)
      .sort((a, b) => {
        const infoA = this.registeredElements.get(a);
        const infoB = this.registeredElements.get(b);
        return (infoA?.navOrder || 0) - (infoB?.navOrder || 0);
      });
    
    return groupElements[groupElements.length - 1] === element;
  }
}