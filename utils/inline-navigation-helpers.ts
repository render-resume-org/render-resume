/**
 * Simple, reliable helpers for inline text navigation
 * Direct implementation of the 6 core requirements
 */

export interface CaretInfo {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  isInMiddle: boolean;
  lineNumber: number;
  totalLines: number;
  hasMultipleLines: boolean;
}

/**
 * Get comprehensive caret position information
 */
export function getCaretInfo(element: HTMLElement): CaretInfo | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!element.contains(range.startContainer)) {
    return null;
  }

  const elementText = element.innerText || '';
  const lines = elementText.split('\n');
  const totalLines = lines.length;
  const hasMultipleLines = totalLines > 1;

  // Get caret offset within element
  const preRange = range.cloneRange();
  preRange.selectNodeContents(element);
  preRange.setEnd(range.startContainer, range.startOffset);
  const caretOffset = preRange.toString().length;

  // Basic position detection
  const isAtStart = caretOffset === 0;
  const isAtEnd = caretOffset === elementText.length;
  const isInMiddle = !isAtStart && !isAtEnd;

  // Line-level detection
  let lineNumber = 0;
  let lineStartOffset = 0;
  let lineEndOffset = 0;
  let currentOffset = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineLength = lines[i].length;
    const lineEnd = currentOffset + lineLength;
    
    if (caretOffset >= currentOffset && caretOffset <= lineEnd) {
      lineNumber = i;
      lineStartOffset = currentOffset;
      lineEndOffset = lineEnd;
      break;
    }
    
    currentOffset = lineEnd + 1; // +1 for newline character
  }

  const isAtLineStart = caretOffset === lineStartOffset;
  const isAtLineEnd = caretOffset === lineEndOffset;

  return {
    isAtStart,
    isAtEnd,
    isAtLineStart,
    isAtLineEnd,
    isInMiddle,
    lineNumber,
    totalLines,
    hasMultipleLines
  };
}

/**
 * Move caret to start of current line
 */
export function moveToLineStart(element: HTMLElement): void {
  const caretInfo = getCaretInfo(element);
  if (!caretInfo) return;

  const lines = (element.innerText || '').split('\n');
  let targetOffset = 0;
  
  for (let i = 0; i < caretInfo.lineNumber; i++) {
    targetOffset += lines[i].length + 1; // +1 for newline
  }

  setCaretAtOffset(element, targetOffset);
}

/**
 * Move caret to end of current line
 */
export function moveToLineEnd(element: HTMLElement): void {
  const caretInfo = getCaretInfo(element);
  if (!caretInfo) return;

  const lines = (element.innerText || '').split('\n');
  let targetOffset = 0;
  
  for (let i = 0; i <= caretInfo.lineNumber; i++) {
    if (i === caretInfo.lineNumber) {
      targetOffset += lines[i].length;
      break;
    }
    targetOffset += lines[i].length + 1; // +1 for newline
  }

  setCaretAtOffset(element, targetOffset);
}

/**
 * Move caret to end of previous line
 */
export function moveToPreviousLineEnd(element: HTMLElement): void {
  const caretInfo = getCaretInfo(element);
  if (!caretInfo || caretInfo.lineNumber === 0) return;

  const lines = (element.innerText || '').split('\n');
  let targetOffset = 0;
  
  // Calculate offset to end of previous line
  for (let i = 0; i < caretInfo.lineNumber - 1; i++) {
    targetOffset += lines[i].length + 1; // +1 for newline
  }
  targetOffset += lines[caretInfo.lineNumber - 1].length;

  setCaretAtOffset(element, targetOffset);
}

/**
 * Move caret to start of next line
 */
export function moveToNextLineStart(element: HTMLElement): void {
  const caretInfo = getCaretInfo(element);
  if (!caretInfo || caretInfo.lineNumber >= caretInfo.totalLines - 1) return;

  const lines = (element.innerText || '').split('\n');
  let targetOffset = 0;
  
  // Calculate offset to start of next line
  for (let i = 0; i <= caretInfo.lineNumber; i++) {
    targetOffset += lines[i].length + 1; // +1 for newline
  }

  setCaretAtOffset(element, targetOffset);
}

/**
 * Set caret at specific text offset within element
 */
function setCaretAtOffset(element: HTMLElement, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
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
    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    // Fallback to element boundaries
    range.selectNodeContents(element);
    range.collapse(offset === 0);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/**
 * Navigate to previous field in navigation order
 */
export function navigateToPreviousField(currentElement: HTMLElement): void {
  const allNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-inline-order]'))
    .filter(node => node.dataset.inlineOrder !== undefined)
    .map((node, i) => ({
      node,
      i,
      order: Number(node.dataset.inlineOrder)
    }))
    .sort((a, b) => (a.order - b.order) || (a.i - b.i))
    .map(n => n.node);

  const currentIndex = allNodes.indexOf(currentElement);
  const targetElement = allNodes[currentIndex - 1];
  
  if (targetElement) {
    focusElementAtPosition(targetElement, 'end');
  }
}

/**
 * Navigate to next field in navigation order
 */
export function navigateToNextField(currentElement: HTMLElement): void {
  const allNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-inline-order]'))
    .filter(node => node.dataset.inlineOrder !== undefined)
    .map((node, i) => ({
      node,
      i,
      order: Number(node.dataset.inlineOrder)
    }))
    .sort((a, b) => (a.order - b.order) || (a.i - b.i))
    .map(n => n.node);

  const currentIndex = allNodes.indexOf(currentElement);
  const targetElement = allNodes[currentIndex + 1];
  
  if (targetElement) {
    focusElementAtPosition(targetElement, 'start');
  }
}

/**
 * Focus element and position caret
 */
function focusElementAtPosition(element: HTMLElement, position: 'start' | 'end'): void {
  element.focus();
  
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(position === 'start');
  
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Check if element is first bullet in group
 */
export function isFirstBulletInGroup(element: HTMLElement, groupId: string): boolean {
  const bulletElements = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`)
  );
  return bulletElements.indexOf(element) === 0;
}

/**
 * Check if element is last bullet in group
 */
export function isLastBulletInGroup(element: HTMLElement, groupId: string): boolean {
  const bulletElements = Array.from(
    document.querySelectorAll<HTMLElement>(`[data-inline-group="${groupId}"]`)
  );
  const currentIndex = bulletElements.indexOf(element);
  return currentIndex === bulletElements.length - 1;
}