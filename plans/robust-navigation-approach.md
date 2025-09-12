# Robust Navigation Approach - Simple & Maintainable

## Problem Analysis

The previous complex approach with NavigationResolver and NavigationManager was over-engineered and caused issues:

1. **Over-abstraction**: Too many layers between keystroke and action
2. **Complex state management**: Hard to debug which condition triggers which behavior
3. **Race conditions**: Enhanced navigation interfering with simpler requirements
4. **Poor maintainability**: Logic spread across multiple files

## New Approach: Direct & Simple

### Core Principle: Single Source of Truth
Implement all navigation logic directly in `useInlineKeyboard` with clear, linear conditions.

### Implementation Strategy

#### 1. Remove Complex Navigation System
- Disable the enhanced navigation manager
- Implement logic directly in keyboard handler
- Use simple, testable helper functions

#### 2. Direct Implementation in useInlineKeyboard

```typescript
const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
  // Skip if custom handler prevents default
  if (options.customOnKeyDown) {
    options.customOnKeyDown(e);
    if (e.defaultPrevented) return;
  }

  if (options.isComposing && e.key === 'Enter') return;

  const element = elementRef.current;
  if (!element) return;

  // Get current caret information
  const caretInfo = getCaretInfo(element);
  if (!caretInfo) return;

  // Handle each requirement directly
  switch (e.key) {
    case 'ArrowUp':
      if (handleArrowUp(e, element, caretInfo)) return;
      break;
    case 'ArrowDown':
      if (handleArrowDown(e, element, caretInfo)) return;
      break;
    case 'ArrowLeft':
      if (handleArrowLeft(e, element, caretInfo)) return;
      break;
    case 'ArrowRight':
      if (handleArrowRight(e, element, caretInfo)) return;
      break;
  }

  // Handle bullet-specific keys (Enter, Backspace)
  // ... existing bullet logic
}, [/* deps */]);
```

#### 3. Simple Helper Functions

```typescript
interface CaretInfo {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  isInMiddle: boolean;
  lineNumber: number;
  totalLines: number;
  hasMultipleLines: boolean;
}

function getCaretInfo(element: HTMLElement): CaretInfo | null {
  // Simple, reliable caret detection
}

function handleArrowUp(e: KeyboardEvent, element: HTMLElement, caret: CaretInfo): boolean {
  // Requirement 1: 行間 ↑ → 行首 (In-line Up → Line Start)
  if (caret.isInMiddle) {
    e.preventDefault();
    moveToLineStart(element);
    return true;
  }
  
  // Requirement 3: 行首 ↑ → 上一行末 (Line Start Up → Previous Line End)
  if (caret.isAtLineStart && caret.lineNumber > 0) {
    e.preventDefault();
    moveToPreviousLineEnd(element);
    return true;
  }
  
  // Requirement 5: 第一個列點的行首 ↑ → 上一個欄位
  if (caret.isAtStart) {
    if (shouldNavigateToField()) {
      e.preventDefault();
      navigateToPreviousField();
      return true;
    }
  }
  
  return false; // Let default behavior handle
}
```

## Key Improvements

### 1. Predictable Logic Flow
- Linear condition checking
- Clear precedence order
- Easy to debug and test

### 2. Maintainable Code Structure
- All navigation logic in one place
- Simple helper functions
- Clear separation of concerns

### 3. Robust Error Handling
- Graceful fallbacks
- Safe DOM operations
- No complex state management

### 4. Performance Optimized
- Minimal function calls
- Direct DOM access
- No unnecessary abstractions

## Implementation Plan

### Phase 1: Simplify Current Implementation
1. Disable enhanced navigation manager in InlineText
2. Implement direct logic in useInlineKeyboard
3. Create simple helper functions

### Phase 2: Test & Validate
1. Test each requirement individually
2. Validate cross-field navigation
3. Ensure bullet system compatibility

### Phase 3: Clean Up
1. Remove unused navigation files
2. Update documentation
3. Performance testing

## Benefits

- ✅ **Simpler to understand and debug**
- ✅ **More reliable behavior**
- ✅ **Easier to maintain and extend**
- ✅ **Better performance**
- ✅ **Clearer test cases**