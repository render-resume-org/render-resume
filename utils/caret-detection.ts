export interface CaretPosition {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  lineNumber: number;
  totalLines: number;
  isInMiddle: boolean;
}

export interface LineInfo {
  startOffset: number;
  endOffset: number;
  text: string;
}

/**
 * Enhanced caret detection utilities for contentEditable elements
 * Supports multi-line text and line-level positioning
 */
export class CaretDetector {
  /**
   * Get comprehensive caret position information
   */
  static getCaretPosition(element: HTMLElement): CaretPosition | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);
    if (!element.contains(range.startContainer)) {
      return null;
    }

    const elementText = element.innerText || '';
    const lines = this.getLines(element);
    const caretOffset = this.getCaretOffset(element, range);
    
    // Basic start/end detection
    const isAtStart = caretOffset === 0;
    const isAtEnd = caretOffset === elementText.length;
    const isInMiddle = !isAtStart && !isAtEnd;
    
    // Line-level detection
    const lineInfo = this.getLineInfo(lines, caretOffset);
    const isAtLineStart = caretOffset === lineInfo.startOffset;
    const isAtLineEnd = caretOffset === lineInfo.endOffset;

    return {
      isAtStart,
      isAtEnd,
      isAtLineStart,
      isAtLineEnd,
      lineNumber: lineInfo.lineNumber,
      totalLines: lines.length,
      isInMiddle
    };
  }

  /**
   * Get all lines in the element with their offsets
   */
  private static getLines(element: HTMLElement): LineInfo[] {
    const text = element.innerText || '';
    const lines: LineInfo[] = [];
    let currentOffset = 0;
    
    // Split by line breaks, handling both \n and <br> elements
    const lineTexts = text.split('\n');
    
    for (let i = 0; i < lineTexts.length; i++) {
      const lineText = lineTexts[i];
      const startOffset = currentOffset;
      const endOffset = currentOffset + lineText.length;
      
      lines.push({
        startOffset,
        endOffset,
        text: lineText
      });
      
      // Account for newline character (except for last line)
      currentOffset = endOffset + (i < lineTexts.length - 1 ? 1 : 0);
    }
    
    return lines;
  }

  /**
   * Get the text offset of the caret within the element
   */
  private static getCaretOffset(element: HTMLElement, range: Range): number {
    const preRange = range.cloneRange();
    preRange.selectNodeContents(element);
    preRange.setEnd(range.startContainer, range.startOffset);
    return preRange.toString().length;
  }

  /**
   * Get line information for a given caret offset
   */
  private static getLineInfo(lines: LineInfo[], caretOffset: number): LineInfo & { lineNumber: number } {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (caretOffset >= line.startOffset && caretOffset <= line.endOffset) {
        return {
          ...line,
          lineNumber: i
        };
      }
    }
    
    // Fallback to last line if offset is beyond text
    const lastLine = lines[lines.length - 1] || {
      startOffset: 0,
      endOffset: 0,
      text: ''
    };
    
    return {
      ...lastLine,
      lineNumber: lines.length - 1
    };
  }

  /**
   * Move caret to specific position in element
   */
  static moveCaretTo(element: HTMLElement, position: 'start' | 'end' | 'line-start' | 'line-end' | 'prev-line-end' | 'next-line-start'): void {
    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();
    
    switch (position) {
      case 'start':
        range.selectNodeContents(element);
        range.collapse(true);
        break;
        
      case 'end':
        range.selectNodeContents(element);
        range.collapse(false);
        break;
        
      case 'line-start':
        this.moveToLineStart(element, range);
        break;
        
      case 'line-end':
        this.moveToLineEnd(element, range);
        break;
        
      case 'prev-line-end':
        this.moveToPreviousLineEnd(element, range);
        break;
        
      case 'next-line-start':
        this.moveToNextLineStart(element, range);
        break;
    }
    
    selection.removeAllRanges();
    selection.addRange(range);
  }

  /**
   * Move caret to start of current line
   */
  private static moveToLineStart(element: HTMLElement, range: Range): void {
    const currentPosition = this.getCaretPosition(element);
    if (!currentPosition) {
      range.selectNodeContents(element);
      range.collapse(true);
      return;
    }

    const lines = this.getLines(element);
    const currentLine = lines[currentPosition.lineNumber];
    if (currentLine) {
      this.setCaretAtOffset(element, range, currentLine.startOffset);
    }
  }

  /**
   * Move caret to end of current line
   */
  private static moveToLineEnd(element: HTMLElement, range: Range): void {
    const currentPosition = this.getCaretPosition(element);
    if (!currentPosition) {
      range.selectNodeContents(element);
      range.collapse(false);
      return;
    }

    const lines = this.getLines(element);
    const currentLine = lines[currentPosition.lineNumber];
    if (currentLine) {
      this.setCaretAtOffset(element, range, currentLine.endOffset);
    }
  }

  /**
   * Move caret to end of previous line
   */
  private static moveToPreviousLineEnd(element: HTMLElement, range: Range): void {
    const currentPosition = this.getCaretPosition(element);
    if (!currentPosition || currentPosition.lineNumber === 0) {
      // No previous line, move to element start
      range.selectNodeContents(element);
      range.collapse(true);
      return;
    }

    const lines = this.getLines(element);
    const previousLine = lines[currentPosition.lineNumber - 1];
    if (previousLine) {
      this.setCaretAtOffset(element, range, previousLine.endOffset);
    }
  }

  /**
   * Move caret to start of next line
   */
  private static moveToNextLineStart(element: HTMLElement, range: Range): void {
    const currentPosition = this.getCaretPosition(element);
    if (!currentPosition) {
      range.selectNodeContents(element);
      range.collapse(false);
      return;
    }

    const lines = this.getLines(element);
    const nextLineIndex = currentPosition.lineNumber + 1;
    if (nextLineIndex >= lines.length) {
      // No next line, move to element end
      range.selectNodeContents(element);
      range.collapse(false);
      return;
    }

    const nextLine = lines[nextLineIndex];
    if (nextLine) {
      this.setCaretAtOffset(element, range, nextLine.startOffset);
    }
  }

  /**
   * Set caret at specific text offset within element
   */
  private static setCaretAtOffset(element: HTMLElement, range: Range, offset: number): void {
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT
    );
    
    let currentOffset = 0;
    let targetNode: Node = element;
    let targetOffset = 0;

    let node;
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent?.length || 0;
      if (currentOffset + nodeLength >= offset) {
        targetNode = node;
        targetOffset = offset - currentOffset;
        break;
      }
      currentOffset += nodeLength;
    }

    try {
      range.setStart(targetNode, Math.min(targetOffset, targetNode.textContent?.length || 0));
      range.collapse(true);
    } catch {
      // Fallback to element boundaries
      range.selectNodeContents(element);
      range.collapse(offset === 0);
    }
  }
}