# Enhanced Inline Text Navigation

This document describes the enhanced navigation system for inline-text components that provides sophisticated keyboard navigation with enhanced caret position awareness and cross-field navigation.

## Overview

The enhanced navigation system provides intuitive keyboard navigation behavior:

1. **In-line Navigation**: Up/Down arrows move to line start/end within same element
2. **Boundary Navigation**: Left/Right arrows at boundaries move between elements  
3. **Cross-field Navigation**: Navigate between different sections for boundary bullets
4. **Smart Positioning**: Maintain logical cursor positioning across transitions

## Navigation Behavior

### Enhanced Arrow Key Behavior

#### Up Arrow (↑)
- **行間** (In middle of line): Move to **行首** (line start)
- **行首** (At line start) AND has previous line: Move to **上一行末** (previous line end)
- **第一個列點的行首** (At element start/first line): Move to **上一個欄位** (previous field)
- **For bullets**: Follow bullet-specific navigation within groups

#### Down Arrow (↓)  
- **行間** (In middle of line): Move to **行末** (line end)
- **行末** (At line end) AND has next line: Move to **下一行首** (next line start)
- **最後一個列點的行末** (At element end/last line): Move to **下一個欄位** (next field)
- **For bullets**: Follow bullet-specific navigation within groups

#### Left Arrow (←)
- **行首** (At line start) AND has previous line: Move to **上一行末** (previous line end)
- **第一個列點的行首** (At element start): Move to **上一個欄位** (previous field, end position)
- **Otherwise**: Default browser behavior

#### Right Arrow (→)
- **行末** (At line end) AND has next line: Move to **下一行首** (next line start)
- **最後一個列點的行末** (At element end): Move to **下一個欄位** (next field, start position)
- **Otherwise**: Default browser behavior

### Cross-Field Navigation

Fields are ordered using the `navOrder` prop. Navigation respects this ordering:

```typescript
// Example navOrder values
navOrder={1000}  // Header name
navOrder={1010}  // Header email  
navOrder={1020}  // Header phone
navOrder={2000}  // First experience title
navOrder={2010}  // First experience company
```

## Architecture

### Core Components

#### 1. Enhanced Caret Detection (`utils/caret-detection.ts`)
```typescript
interface CaretPosition {
  isAtStart: boolean;
  isAtEnd: boolean;
  isAtLineStart: boolean;
  isAtLineEnd: boolean;
  lineNumber: number;
  totalLines: number;
  isInMiddle: boolean;
}
```

#### 2. Navigation Action Resolver (`utils/navigation-resolver.ts`)
```typescript
enum NavigationAction {
  MOVE_TO_LINE_START = 'line_start',
  MOVE_TO_LINE_END = 'line_end',
  MOVE_TO_PREVIOUS_FIELD = 'prev_field',
  MOVE_TO_NEXT_FIELD = 'next_field',
  // Enhanced multi-line navigation
  MOVE_TO_PREVIOUS_LINE_END = 'prev_line_end',
  MOVE_TO_NEXT_LINE_START = 'next_line_start',
  NO_ACTION = 'none'
}
```

#### 3. Navigation Manager (`components/hooks/use-navigation-manager.ts`)
Unified coordinator that:
- Detects caret position context
- Determines appropriate navigation action
- Executes navigation commands
- Handles cross-field navigation

#### 4. Enhanced Inline Keyboard (`components/hooks/use-inline-keyboard.ts`)
Integrates enhanced navigation with existing bullet system:
- Uses navigation manager for arrow key handling
- Maintains backward compatibility
- Supports configuration options

## Usage

### Basic Usage

Enhanced navigation is enabled by default in all `InlineText` components:

```tsx
<InlineText 
  text="Sample text"
  navOrder={1000}
  inlineEditable
  onChange={handleChange}
/>
```

### Configuration Options

```tsx
// Disable enhanced navigation (use legacy behavior)
<InlineText 
  text="Sample text"
  enableEnhancedNavigation={false}
  navOrder={1000}
  inlineEditable
  onChange={handleChange}
/>

// Custom field navigation handler
<InlineText 
  text="Sample text"
  navOrder={1000}
  onNavigateToField={(direction) => {
    // Custom navigation logic
    console.log(`Navigate ${direction}`);
  }}
  inlineEditable
  onChange={handleChange}
/>
```

### Bullet Points

For bullet points, the system integrates with the existing bullet navigation:

```tsx
<InlineText 
  text="Bullet point text"
  isBullet
  navOrder={2100}
  groupId="experience-bullets"
  onAddBullet={() => addBullet()}
  onRemoveBullet={() => removeBullet()}
  inlineEditable
  onChange={handleChange}
/>
```

## Implementation Details

### Caret Detection Algorithm

The system uses a sophisticated caret detection algorithm that:

1. **Analyzes text content**: Splits content into lines considering both `\\n` and `<br>` elements
2. **Calculates offsets**: Determines exact caret position within text
3. **Line-level positioning**: Identifies current line and position within line
4. **Multi-line support**: Handles contentEditable elements with multiple lines

### Navigation Resolution

Navigation actions are resolved based on:

1. **Key pressed**: Up/Down/Left/Right arrow
2. **Caret position**: Start/middle/end of element or line
3. **Element type**: Regular text vs bullet point
4. **Context**: First/last bullet in group

### Performance Optimizations

- **Efficient DOM queries**: Minimal DOM traversal using cached selectors
- **Event debouncing**: Prevents rapid-fire navigation events
- **Selective processing**: Only processes relevant arrow key events

## Migration from Legacy System

### Automatic Migration

Most components automatically benefit from enhanced navigation without changes:

- Existing `navOrder` props are respected
- Legacy behavior maintained as fallback
- Bullet systems continue to work unchanged

### Opt-out Option

To disable enhanced navigation for specific components:

```tsx
<InlineText 
  text="Legacy behavior"
  enableEnhancedNavigation={false}
  // ... other props
/>
```

## Testing

### Manual Testing Scenarios

1. **Single-line text**:
   - Up arrow → Move to previous field
   - Down arrow → Move to next field
   - Left arrow at start → Move to previous field
   - Right arrow at end → Move to next field

2. **Multi-line text**:
   - **行間** Up arrow in middle → Move to **行首** (line start)
   - **行間** Down arrow in middle → Move to **行末** (line end)
   - **行首** Up/Left arrow at line start → Move to **上一行末** (previous line end)
   - **行末** Down/Right arrow at line end → Move to **下一行首** (next line start)
   - **第一個列點的行首** Up/Left at first line start → Move to **上一個欄位** (previous field)
   - **最後一個列點的行末** Down/Right at last line end → Move to **下一個欄位** (next field)

3. **Bullet points**:
   - Navigation within bullet group follows same multi-line rules
   - Cross-field navigation at group boundaries
   - Integration with add/remove bullet functionality

### Automated Testing

```typescript
// Example test case
describe('Enhanced Navigation', () => {
  it('moves to line start on up arrow in middle', () => {
    const element = createTestElement('Line 1\\nLine 2');
    setCaretPosition(element, 8); // Middle of second line
    
    fireEvent.keyDown(element, { key: 'ArrowUp' });
    
    expect(getCaretPosition(element)).toBe(7); // Start of second line
  });
});
```

## Troubleshooting

### Common Issues

1. **Navigation not working**
   - Check `navOrder` prop is set
   - Verify `inlineEditable` is true
   - Ensure element is properly focused

2. **Incorrect field order**
   - Review `navOrder` values
   - Ensure proper spacing between values
   - Check for duplicate navOrder values

3. **Bullet navigation conflicts**
   - Verify `isBullet` prop is set correctly
   - Check `groupId` consistency within bullet groups
   - Ensure bullet callbacks are provided

### Debug Mode

Enable debug logging by setting localStorage flag:

```javascript
localStorage.setItem('debug-navigation', 'true');
```

This will log navigation actions and caret positions to the console.

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support

The system uses standard DOM APIs and should work in all modern browsers.

## Performance Considerations

- **Minimal overhead**: Enhanced detection only runs on arrow key presses
- **Efficient algorithms**: Optimized caret position calculation
- **Memory management**: No memory leaks from event listeners
- **Graceful degradation**: Falls back to legacy behavior if enhanced features fail

## Future Enhancements

Potential improvements for future versions:

1. **Smart line wrapping**: Better handling of wrapped lines in narrow containers
2. **Accessibility**: Enhanced screen reader support
3. **Customizable behavior**: More granular configuration options
4. **Performance metrics**: Built-in performance monitoring
5. **Visual indicators**: Optional visual feedback for navigation actions