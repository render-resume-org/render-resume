# Enhanced Inline Text Navigation Implementation Plan

## Executive Summary

Implement sophisticated keyboard navigation for inline-text components with enhanced multi-line support, cross-line navigation within elements, and seamless field transitions.

## Requirements Implementation

### 1. Core Navigation Behaviors

#### Within Single Element Multi-line Navigation
- **行間 ↑** → **行首** (In-line Up → Line Start)
- **行間 ↓** → **行末** (In-line Down → Line End)
- **行首 ↑/←** → **上一行末** (Line Start Up/Left → Previous Line End)
- **行末 ↓/→** → **下一行首** (Line End Down/Right → Next Line Start)

#### Cross-Element Navigation
- **第一個列點的行首 ↑/←** → **上一個欄位** (First Bullet Line Start Up/Left → Previous Field)
- **最後一個列點的行末 ↓/→** → **下一個欄位** (Last Bullet Line End Down/Right → Next Field)

## Technical Architecture

### 1. Enhanced Navigation Actions
```typescript
enum NavigationAction {
  // Existing actions
  MOVE_TO_LINE_START = 'line_start',
  MOVE_TO_LINE_END = 'line_end',
  MOVE_TO_PREVIOUS_FIELD = 'prev_field',
  MOVE_TO_NEXT_FIELD = 'next_field',
  
  // New multi-line navigation actions
  MOVE_TO_PREVIOUS_LINE_END = 'prev_line_end',
  MOVE_TO_NEXT_LINE_START = 'next_line_start',
  NO_ACTION = 'none'
}
```

### 2. Enhanced Caret Detection
Extend `CaretDetector` to support:
- Previous/next line detection within same element
- Cross-line navigation capabilities
- Line boundary detection with multi-line context

### 3. Navigation Resolution Logic

#### Up Arrow (↑) Resolution
```
IF at middle of line → MOVE_TO_LINE_START
IF at line start AND has previous line → MOVE_TO_PREVIOUS_LINE_END
IF at line start AND first line AND (not bullet OR first bullet in group) → MOVE_TO_PREVIOUS_FIELD
ELSE → NO_ACTION (let bullet system handle)
```

#### Down Arrow (↓) Resolution
```
IF at middle of line → MOVE_TO_LINE_END
IF at line end AND has next line → MOVE_TO_NEXT_LINE_START
IF at line end AND last line AND (not bullet OR last bullet in group) → MOVE_TO_NEXT_FIELD
ELSE → NO_ACTION (let bullet system handle)
```

#### Left Arrow (←) Resolution
```
IF at line start AND has previous line → MOVE_TO_PREVIOUS_LINE_END
IF at element start AND (not bullet OR first bullet in group) → MOVE_TO_PREVIOUS_FIELD
ELSE → NO_ACTION (default browser behavior)
```

#### Right Arrow (→) Resolution
```
IF at line end AND has next line → MOVE_TO_NEXT_LINE_START
IF at element end AND (not bullet OR last bullet in group) → MOVE_TO_NEXT_FIELD
ELSE → NO_ACTION (default browser behavior)
```

## Implementation Strategy

### Phase 1: Core Navigation Logic Enhancement
1. **Extend NavigationAction enum** with new multi-line actions
2. **Enhance NavigationResolver** with detailed line navigation logic
3. **Update CaretDetector** with previous/next line detection methods

### Phase 2: Navigation Manager Updates
1. **Add multi-line navigation handlers** to NavigationManager
2. **Implement cross-line caret positioning** functions
3. **Integrate with existing field navigation** system

### Phase 3: Integration and Testing
1. **Update useNavigationManager hook** with new action handlers
2. **Preserve backward compatibility** with existing behavior
3. **Comprehensive testing** of all navigation scenarios

## Detailed Implementation

### 1. Enhanced CaretDetector Methods

```typescript
class CaretDetector {
  // New methods to add
  static hasPreviousLine(element: HTMLElement, currentLineNumber: number): boolean
  static hasNextLine(element: HTMLElement, currentLineNumber: number): boolean
  static moveToPreviousLineEnd(element: HTMLElement): void
  static moveToNextLineStart(element: HTMLElement): void
}
```

### 2. Updated NavigationResolver

```typescript
class NavigationResolver {
  // Enhanced resolution methods
  private static resolveUpArrow(context): NavigationAction {
    // Check if in middle of line
    if (context.caretPosition.isInMiddle) {
      return NavigationAction.MOVE_TO_LINE_START;
    }
    
    // Check if at line start with previous line available
    if (context.caretPosition.isAtLineStart && context.caretPosition.lineNumber > 0) {
      return NavigationAction.MOVE_TO_PREVIOUS_LINE_END;
    }
    
    // Check if at element start (first line start)
    if (context.caretPosition.isAtStart) {
      if (context.isBullet && !context.isFirstBulletInGroup) {
        return NavigationAction.NO_ACTION; // Let bullet system handle
      }
      return NavigationAction.MOVE_TO_PREVIOUS_FIELD;
    }
    
    return NavigationAction.NO_ACTION;
  }
}
```

### 3. Navigation Manager Enhancements

```typescript
// New navigation handlers
const moveToPreviousLineEnd = useCallback(() => {
  const element = elementRef.current;
  if (!element) return;
  CaretDetector.moveToPreviousLineEnd(element);
}, [elementRef]);

const moveToNextLineStart = useCallback(() => {
  const element = elementRef.current;
  if (!element) return;
  CaretDetector.moveToNextLineStart(element);
}, [elementRef]);
```

## Testing Strategy

### 1. Unit Tests
- **CaretDetector methods** for accurate line detection
- **NavigationResolver logic** for correct action resolution
- **NavigationManager handlers** for proper execution

### 2. Integration Tests  
- **Multi-line text navigation** within single elements
- **Cross-element navigation** respecting navOrder
- **Bullet system integration** maintaining existing behavior

### 3. Manual Testing Scenarios
- Single-line text elements
- Multi-line text elements (2-5 lines)
- Bullet points with single/multiple lines
- Cross-field navigation with navOrder
- Mixed bullet and non-bullet navigation

## Risk Mitigation

### 1. Backward Compatibility
- **Preserve existing behavior** as fallback
- **Gradual rollout** with feature flags if needed
- **Comprehensive regression testing**

### 2. Browser Compatibility
- **Test across major browsers** (Chrome, Firefox, Safari, Edge)
- **Handle edge cases** in contentEditable behavior
- **Graceful degradation** for unsupported features

### 3. Performance Considerations
- **Optimize caret detection** algorithms
- **Cache line information** when possible
- **Minimize DOM queries** during navigation

## Success Criteria

### Functional Requirements
✅ In-line Up/Down moves to line start/end
✅ Line boundary Up/Down/Left/Right moves to previous/next line
✅ Element boundary navigation moves to previous/next field
✅ Bullet system integration maintains existing behavior
✅ Cross-field navigation respects navOrder

### Technical Requirements  
✅ No performance regression
✅ Full backward compatibility
✅ Cross-browser support
✅ Comprehensive test coverage
✅ Clear documentation

## Timeline

### Week 1: Core Implementation
- Day 1-2: Enhanced CaretDetector methods
- Day 3-4: Updated NavigationResolver logic  
- Day 5: NavigationManager integration

### Week 2: Integration & Testing
- Day 1-2: Hook updates and integration
- Day 3-4: Comprehensive testing
- Day 5: Documentation updates

### Week 3: Validation & Polish
- Day 1-2: Manual testing across scenarios
- Day 3-4: Performance optimization
- Day 5: Final validation and deployment

## Deliverables

1. **Enhanced CaretDetector** with multi-line support
2. **Updated NavigationResolver** with comprehensive logic
3. **Integrated NavigationManager** with new action handlers
4. **Comprehensive test suite** covering all scenarios
5. **Updated documentation** reflecting new behaviors
6. **Migration guide** for any breaking changes

## Post-Implementation

### 1. Monitoring
- **User feedback** on navigation behavior
- **Performance metrics** tracking
- **Error tracking** for edge cases

### 2. Future Enhancements
- **Smart word-level navigation** within lines
- **Visual navigation indicators** 
- **Accessibility improvements** for screen readers
- **Custom navigation configuration** options