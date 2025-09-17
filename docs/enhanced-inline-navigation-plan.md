# Enhanced Inline Text Navigation Plan

## Overview
This plan implements sophisticated navigation behavior for inline-text components to provide intuitive keyboard navigation with enhanced caret position awareness and cross-field navigation.

## Requirements Analysis

### Current Navigation Limitations
1. Only handles start/end position navigation
2. No in-line navigation (middle of text)
3. No smart line-based navigation within elements
4. Limited cross-field navigation for bullets
5. Two separate navigation systems not well integrated

### New Requirements
1. **In-line Navigation**: Up/Down arrows move to line start/end within same element
2. **Boundary Navigation**: Left/Right arrows at boundaries move between elements
3. **Cross-field Navigation**: Navigate between different sections for boundary bullets
4. **Smart Positioning**: Maintain logical cursor positioning across transitions

## Technical Architecture

### 1. Enhanced Caret Detection System
```typescript
interface CaretPosition {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  lineNumber: number;
  totalLines: number;
}
```

### 2. Navigation Strategy Enum
```typescript
enum NavigationAction {
  MOVE_TO_LINE_START = 'line_start',
  MOVE_TO_LINE_END = 'line_end', 
  MOVE_TO_PREVIOUS_FIELD = 'prev_field',
  MOVE_TO_NEXT_FIELD = 'next_field',
  NO_ACTION = 'none'
}
```

### 3. Navigation Manager
Centralized navigation coordinator that:
- Detects caret position context
- Determines appropriate navigation action
- Coordinates between inline and bullet systems
- Handles cross-field navigation using navOrder

## Implementation Plan

### Phase 1: Enhanced Caret Detection
- **File**: `utils/caret-detection.ts`
- **Purpose**: Robust caret position detection including line-level positioning
- **Features**:
  - Multi-line text support
  - Line start/end detection
  - Integration with existing start/end detection

### Phase 2: Navigation Action Resolver
- **File**: `utils/navigation-resolver.ts`
- **Purpose**: Determine navigation action based on key press and caret position
- **Logic**:
  ```
  Up Key:
    - If at line start → Move to line start
    - If at element start (first line) → Move to previous field
    
  Down Key:
    - If at line end → Move to line end
    - If at element end (last line) → Move to next field
    
  Left Key:
    - If at element start → Move to previous field
    
  Right Key:
    - If at element end → Move to next field
  ```

### Phase 3: Navigation Manager
- **File**: `components/hooks/use-navigation-manager.ts`
- **Purpose**: Unified navigation coordination
- **Responsibilities**:
  - Coordinate caret detection and action resolution
  - Execute navigation actions
  - Handle cross-field navigation via navOrder
  - Integrate with existing bullet system

### Phase 4: Enhanced Inline Keyboard Hook
- **File**: `components/hooks/use-inline-keyboard.ts` (enhance existing)
- **Purpose**: Integrate new navigation system
- **Changes**:
  - Use navigation manager for all key events
  - Maintain backward compatibility
  - Add configuration options

### Phase 5: Integration & Testing
- **Update**: `components/preview/inline-text.tsx`
- **Purpose**: Integrate enhanced navigation
- **Testing**: Comprehensive navigation scenarios

## File Structure
```
/utils/
  ├── caret-detection.ts          # Enhanced caret position detection
  └── navigation-resolver.ts      # Navigation action determination

/components/hooks/
  ├── use-navigation-manager.ts   # Unified navigation coordinator
  └── use-inline-keyboard.ts      # Enhanced (existing file)

/types/
  └── navigation.ts               # Navigation-specific types

/docs/
  └── enhanced-navigation.md      # Usage documentation
```

## Implementation Steps

### Step 1: Create Enhanced Caret Detection
- Implement multi-line caret position detection
- Support for line-level positioning
- Integration with contentEditable elements

### Step 2: Implement Navigation Resolver
- Key press to navigation action mapping
- Context-aware decision making
- Support for different element types (bullet vs regular)

### Step 3: Build Navigation Manager
- Unified coordination layer
- Cross-field navigation using navOrder
- Integration with existing systems

### Step 4: Enhance Inline Keyboard Hook
- Integrate navigation manager
- Maintain existing bullet functionality
- Add configuration for different behaviors

### Step 5: Update Components & Documentation
- Update inline-text to use enhanced navigation
- Comprehensive documentation
- Usage examples and migration guide

## Success Criteria

### Functional Requirements
1. ✅ Up arrow in text middle moves to line start
2. ✅ Down arrow in text middle moves to line end  
3. ✅ Left arrow at element start moves to previous field
4. ✅ Right arrow at element end moves to next field
5. ✅ Cross-field navigation works for bullets
6. ✅ navOrder respected for field ordering

### Technical Requirements
1. ✅ Backward compatibility maintained
2. ✅ Performance optimized (no unnecessary DOM queries)
3. ✅ Type-safe implementation
4. ✅ Comprehensive test coverage
5. ✅ Clear documentation and examples

## Risk Mitigation

### Compatibility Risks
- **Risk**: Breaking existing navigation
- **Mitigation**: Feature flags and gradual rollout

### Performance Risks  
- **Risk**: Excessive DOM manipulation
- **Mitigation**: Efficient caret detection algorithms

### UX Risks
- **Risk**: Confusing navigation behavior
- **Mitigation**: Comprehensive testing and user feedback

## Timeline
- **Phase 1-2**: 2-3 hours (Utils & core logic)
- **Phase 3-4**: 2-3 hours (Integration & hooks)
- **Phase 5**: 1-2 hours (Testing & documentation)
- **Total**: 5-8 hours

This plan provides a robust, maintainable solution that enhances the existing navigation system while maintaining backward compatibility and following established architectural patterns.