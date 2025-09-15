# Bullet Point System

A intuitive bullet point editing system that provides Notion-like editing experience with automatic focus management, keyboard navigation, and seamless bullet point operations.

## Overview

The Bullet Point System is designed to provide a smooth and intuitive editing experience for bullet points in resume sections. It handles focus management, keyboard navigation, and bullet point creation/deletion automatically.

### Key Features

- **Notion-like Experience**: Familiar keyboard shortcuts and behaviors
- **Automatic Focus Management**: Smart focus transitions when adding/removing bullets
- **Simple API**: Minimal configuration required
- **Zero Magic**: Transparent and predictable behavior
- **Performance Optimized**: Minimal DOM queries and event handling

## Architecture

```
BulletManager (Singleton)
├── Central registry for all bullet points
├── Focus navigation logic
└── Group-based organization

useBulletPoint (React Hook)
├── Auto-registration with BulletManager
├── Keyboard event handling
├── Focus management utilities
└── Lifecycle management

BulletText (React Component)
├── Uses useBulletPoint hook
├── Maintains preview functionality
├── Simple API interface
└── Auto-cleanup on unmount
```

## Usage

### Basic Implementation

```tsx
import { BulletText } from '@/components/preview/bullet-system';

function OutcomesList({ outcomes, sectionIndex }) {
  return (
    <ul>
      {outcomes.map((text, index) => (
        <li key={index}>
          <BulletText
            text={text}
            groupId={`section-${sectionIndex}-outcomes`}
            index={index}
            onChange={(newText) => updateOutcome(index, newText)}
            onAddBullet={() => addOutcome(index)}
            onRemoveBullet={() => removeOutcome(index)}
          />
        </li>
      ))}
    </ul>
  );
}
```

### Complete Example

```tsx
import { BulletText } from '@/components/preview/bullet-system';

function ExperienceOutcomes({ job, jobIndex, onInlineChange }) {
  return (
    <ul className="achievement-list">
      {job.outcomes.map((achievement, achIndex) => (
        <li key={achIndex}>
          <BulletText
            text={achievement}
            groupId={`experience-${jobIndex}-outcomes`}
            index={achIndex}
            
            // Basic callbacks
            onChange={(text) => 
              onInlineChange?.({
                path: `experience[${jobIndex}].outcomes[${achIndex}]`,
                value: text
              })
            }
            onAddBullet={() =>
              onInlineChange?.({
                action: 'addBullet',
                path: `experience[${jobIndex}].outcomes`,
                index: achIndex
              })
            }
            onRemoveBullet={() =>
              onInlineChange?.({
                action: 'removeBullet',
                path: `experience[${jobIndex}].outcomes`,
                index: achIndex
              })
            }
            
            // Preview functionality (optional)
            highlightType={getHighlightType(jobIndex, achIndex)}
            previewOriginal={getPreviewOriginal(jobIndex, achIndex)}
            previewReplaceWith={getPreviewReplacement(jobIndex, achIndex)}
          />
        </li>
      ))}
    </ul>
  );
}
```

## API Reference

### BulletText Component

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `text` | `string` | ✓ | The bullet point text content |
| `groupId` | `string` | ✓ | Unique identifier for the bullet group |
| `index` | `number` | ✓ | Index of this bullet within the group |
| `onChange` | `(text: string) => void` | | Callback when text changes |
| `onAddBullet` | `() => void` | | Callback when new bullet should be added |
| `onRemoveBullet` | `() => void` | | Callback when bullet should be removed |
| `highlightType` | `'set' \| 'insert'` | | Preview highlight mode |
| `previewOriginal` | `string` | | Original text for preview mode |
| `previewReplaceWith` | `string` | | Replacement text for preview mode |
| `className` | `string` | | Additional CSS classes |

### useBulletPoint Hook

```tsx
const {
  elementRef,
  handleKeyDown,
  handleInput,
  focusElement,
  isEmpty,
  isCaretAtStart,
  isCaretAtEnd
} = useBulletPoint({
  groupId: 'unique-group-id',
  index: 0,
  onAddBullet: () => {},
  onRemoveBullet: () => {},
  onChange: (text) => {}
});
```

### BulletManager API

```tsx
import { BulletManager } from '@/components/preview/bullet-system';

// Focus navigation
BulletManager.focusNext(groupId, currentIndex);
BulletManager.focusPrevious(groupId, currentIndex);

// Get bullets in group
const bullets = BulletManager.getBulletsInGroup(groupId);

// Debug current state
BulletManager.debug();
```

## Keyboard Interactions

| Key | Context | Behavior |
|-----|---------|----------|
| `Enter` | Cursor at end of bullet | Create new bullet and focus it |
| `Enter` | Cursor in middle of bullet | Insert line break |
| `Backspace` | Empty bullet | Delete bullet and focus previous |
| `Backspace` | Non-empty bullet | Normal character deletion |

## Group ID Convention

Use consistent group ID patterns for better organization:

```tsx
// Section-based grouping
`experience-${jobIndex}-outcomes`
`projects-${projectIndex}-outcomes`
`education-${eduIndex}-outcomes`
`achievements-${achIndex}-outcomes`

// Feature-based grouping
`skills-${categoryIndex}-items`
`languages-${langIndex}-proficiency`
```

## Best Practices

### 1. Consistent Indexing

```tsx
// ✅ Good: Use array index consistently
{outcomes.map((text, index) => (
  <BulletText
    key={index}
    groupId={`section-${sectionIndex}-outcomes`}
    index={index}
    // ...
  />
))}

// ❌ Bad: Inconsistent indexing
{outcomes.map((text, index) => (
  <BulletText
    key={text.id}
    groupId={`section-${sectionIndex}-outcomes`}
    index={text.id} // Don't use ID as index
    // ...
  />
))}
```

### 2. Unique Group IDs

```tsx
// ✅ Good: Include section and item identifiers
groupId={`experience-${jobIndex}-outcomes`}

// ❌ Bad: Generic or duplicate group IDs
groupId="outcomes"
```

### 3. Proper Callback Implementation

```tsx
// ✅ Good: Handle state updates properly
const handleAddBullet = (afterIndex) => {
  const newOutcomes = [...outcomes];
  newOutcomes.splice(afterIndex + 1, 0, '');
  setOutcomes(newOutcomes);
};

// ❌ Bad: Mutating state directly
const handleAddBullet = (afterIndex) => {
  outcomes.push(''); // Don't mutate directly
};
```

## Migration from Old System

### Before (Complex System)

```tsx
// Old complex implementation
<ul>
  {(() => {
    const groupId = `experience-${index}-outcomes`;
    const ids = getInlineIds(groupId, outcomes.length);
    return outcomes.map((achievement, achIndex) => (
      <li 
        key={ids[achIndex] ?? achIndex}
        data-inline-group={groupId} 
        data-inline-order={achIndex}
      >
        <InlineText
          text={achievement}
          inlineEditable
          isBullet
          groupId={groupId}
          navOrder={sectionBase + index * 10000 + 100 + achIndex}
          onAddBullet={() => /* complex logic */}
          onRemoveBullet={() => /* complex logic with bulletId */}
          // ... many more props
        />
      </li>
    ));
  })()}
</ul>
```

### After (Simple System)

```tsx
// New simple implementation
<ul>
  {outcomes.map((achievement, achIndex) => (
    <li key={achIndex}>
      <BulletText
        text={achievement}
        groupId={`experience-${index}-outcomes`}
        index={achIndex}
        onAddBullet={() => addBullet(achIndex)}
        onRemoveBullet={() => removeBullet(achIndex)}
        onChange={(text) => updateText(achIndex, text)}
      />
    </li>
  ))}
</ul>
```

## Troubleshooting

### Common Issues

1. **Focus not working between bullets**
   - Check that `groupId` is consistent across bullets
   - Ensure `index` values are sequential (0, 1, 2, ...)

2. **New bullets not focusing**
   - Verify `onAddBullet` callback adds bullet to state
   - Check that DOM updates complete before focus attempt

3. **Bullets not deleting properly**
   - Implement `onRemoveBullet` to remove from state
   - Ensure array indices update correctly after removal

### Debug Helpers

```tsx
// Debug current bullet state
import { BulletManager } from '@/components/preview/bullet-system';

// In component or browser console
BulletManager.debug();
```

## Performance Considerations

- **Automatic Cleanup**: Components self-register and cleanup on mount/unmount
- **Minimal Event Handling**: Only necessary keyboard events are captured
- **Efficient Focus Management**: Direct element focus without DOM queries
- **No Memory Leaks**: Automatic cleanup prevents memory accumulation

## Browser Compatibility

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **contentEditable**: Uses standard contentEditable with proper event handling
- **Selection API**: Uses standard window.getSelection() for cursor management
- **No Dependencies**: Pure React implementation with no external libraries