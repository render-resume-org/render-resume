# Resume Preview & Template Architecture

## Overview

The resume preview and template system provides a flexible, maintainable, and extensible architecture for rendering different resume styles. This document outlines the technical design, components, and patterns used in the system.

## Architecture Principles

### SOLID Principles Applied

1. **Single Responsibility Principle (SRP)**
   - Each component has one clear responsibility
   - `ResumeHeader` handles header rendering
   - `ResumePreview` orchestrates the overall layout
   - Section components handle their specific data types

2. **Open/Closed Principle (OCP)**
   - System is open for extension (new templates, sections)
   - Closed for modification (existing templates don't need changes)

3. **Liskov Substitution Principle (LSP)**
   - All section components follow the same interface
   - Templates can be swapped without breaking functionality

4. **Interface Segregation Principle (ISP)**
   - Clean interfaces for each component type
   - No forced dependencies on unused features

5. **Dependency Inversion Principle (DIP)**
   - High-level modules don't depend on low-level modules
   - Both depend on abstractions (template configuration)

## Core Components

### 1. Template Configuration (`lib/config/resume-templates.ts`)

The template system is driven by configuration objects that define styling, layout, and behavior.

```typescript
export interface ResumeTemplate {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  font: {                        // Typography configuration
    family: string;
    sizes: {
      title: string;
      subtitle: string;
      heading: string;
      body: string;
      caption: string;
    };
  };
  colors: {                      // Color scheme
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  spacing: {                     // Layout spacing
    section: string;
    item: string;
    line: string;
  };
  layout: {                      // Section ordering
    sections: Array<'summary' | 'skills' | 'experience' | 'projects' | 'education'>;
  };
  styles: {                      // Component-specific styles
    header: string;
    sectionTitle: string;
    showSectionIcons: boolean;
  };
}
```

#### Template Management

```typescript
// Get template by ID with fallback
export function getTemplateById(id: string): ResumeTemplate {
  return availableTemplates.find(template => template.id === id) ?? defaultTemplate;
}

// Available templates
export const availableTemplates = [defaultTemplate, latexTemplate];
```

### 2. Section Registry (`components/preview/section-registry.tsx`)

The section registry provides a centralized, extensible system for managing resume sections.

```typescript
type SectionName = 'summary' | 'skills' | 'experience' | 'projects' | 'education';

interface SectionProps<T = unknown> {
  data: T;
  template: ResumeTemplate;
}

type SectionComponent = React.ComponentType<SectionProps>;

const SECTION_REGISTRY: Record<SectionName, SectionComponent> = {
  summary: SummarySection,
  skills: SkillsSection,
  experience: ExperienceSection,
  projects: ProjectsSection,
  education: EducationSection,
  achievements: () => null, // Placeholder
  certifications: () => null, // Placeholder
};
```

#### Section Rendering

```typescript
export function renderSection({ sectionName, resumeData, template }: SectionRendererProps) {
  const SectionComponent = SECTION_REGISTRY[sectionName];
  
  if (!SectionComponent) {
    console.warn(`Section component not found for: ${sectionName}`);
    return null;
  }

  const sectionData = resumeData[sectionName as keyof OptimizedResume];
  
  if (!sectionData) {
    return null;
  }

  return <SectionComponent data={sectionData} template={template} />;
}
```

#### Extending Sections

```typescript
// Register a new section
export function registerSection(sectionName: SectionName, component: SectionComponent) {
  SECTION_REGISTRY[sectionName] = component;
}
```

### 3. Resume Header (`components/preview/resume-header.tsx`)

Dedicated component for rendering resume headers based on template configuration.

```typescript
interface ResumeHeaderProps {
  personalInfo: OptimizedResume['personalInfo'];
  template: ResumeTemplate;
}

export default function ResumeHeader({ personalInfo, template }: ResumeHeaderProps) {
  const { font, colors, styles } = template;

  if (template.id === 'latex') {
    return <LatexHeader />;
  }

  return <DefaultHeader />;
}
```

### 4. Resume Preview (`components/preview/resume-preview.tsx`)

Main orchestrator component that renders the complete resume.

```typescript
interface ResumePreviewProps {
  resumeData: OptimizedResume;
  template: ResumeTemplate;
}

export default function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  const { font, colors } = template;

  return (
    <div className={cn('p-8 min-h-[1000px] h-fit', font.family, colors.background)}>
      <ResumeHeader personalInfo={resumeData.personalInfo} template={template} />

      {template.layout.sections.map(sectionName => (
        <div key={sectionName}>
          {renderSection({ sectionName, resumeData, template })}
        </div>
      ))}
      
      <footer>...</footer>
    </div>
  );
}
```

### 5. Section Components

Each section component follows a consistent pattern:

```typescript
interface SectionProps {
  data: OptimizedResume[SectionName];
  template: ResumeTemplate;
}

export default function SectionComponent({ data, template }: SectionProps) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return <LatexLayout />;
  }

  return <DefaultLayout />;
}
```

## Data Flow

```
Template Config → ResumePreview → Section Registry → Section Components
     ↓                ↓                ↓                    ↓
  Styling         Orchestration    Component         Template-specific
  Layout          Data Flow        Resolution        Rendering
```

## Template Variants

### Default Template

- **Font**: Sans-serif (font-sans)
- **Colors**: Cyan primary, gray secondary
- **Layout**: Grid-based skills, card-style projects
- **Icons**: Section icons enabled
- **Spacing**: Generous spacing between sections

### LaTex Template

- **Font**: Serif (font-serif)
- **Colors**: Black text, minimal styling
- **Layout**: Compact, list-based
- **Icons**: Section icons disabled
- **Spacing**: Tight spacing, professional appearance

## Adding New Templates

### 1. Define Template Configuration

```typescript
export const modernTemplate: ResumeTemplate = {
  id: 'modern',
  name: 'Modern Professional',
  font: {
    family: 'font-sans',
    sizes: {
      title: 'text-4xl font-bold',
      subtitle: 'text-lg',
      heading: 'text-xl font-semibold',
      body: 'text-sm',
      caption: 'text-xs',
    },
  },
  colors: {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    text: 'text-gray-900',
    background: 'bg-white',
  },
  spacing: {
    section: 'mb-6',
    item: 'mb-3',
    line: 'mb-1',
  },
  layout: {
    sections: ['summary', 'experience', 'skills', 'projects', 'education'],
  },
  styles: {
    header: 'border-b-2 border-blue-600 pb-4 mb-6',
    sectionTitle: 'text-xl font-bold mb-4',
    showSectionIcons: true,
  },
};
```

### 2. Add to Available Templates

```typescript
export const availableTemplates = [defaultTemplate, latexTemplate, modernTemplate];
```

### 3. Update Section Components (if needed)

If the new template requires different rendering logic:

```typescript
export default function SkillsSection({ data, template }: SkillsSectionProps) {
  // ... existing code ...

  if (template.id === 'modern') {
    return <ModernSkillsLayout />;
  }

  // ... existing code ...
}
```

## Adding New Sections

### 1. Update Type Definitions

```typescript
// In types/resume.ts
export interface OptimizedResume {
  // ... existing properties ...
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}
```

### 2. Create Section Component

```typescript
// components/preview/sections/certifications-section.tsx
export default function CertificationsSection({ data, template }: CertificationsSectionProps) {
  // Implementation
}
```

### 3. Register Section

```typescript
// In section-registry.tsx
import CertificationsSection from './sections/certifications-section';

const SECTION_REGISTRY: Record<SectionName, SectionComponent> = {
  // ... existing sections ...
  certifications: CertificationsSection,
};
```

### 4. Update Template Layouts

```typescript
// Add to template configurations
layout: {
  sections: ['summary', 'skills', 'experience', 'projects', 'education', 'certifications'],
},
```

## Performance Considerations

### 1. Component Memoization

Section components can be memoized to prevent unnecessary re-renders:

```typescript
export default React.memo(function SkillsSection({ data, template }: SkillsSectionProps) {
  // Component implementation
});
```

### 2. Template Caching

Templates are cached by ID to avoid repeated lookups:

```typescript
const currentTemplate = useMemo(() => 
  getTemplateById(templateId), [templateId]
);
```

### 3. Conditional Rendering

Sections are only rendered if data exists:

```typescript
if (!data || data.length === 0) return null;
```

## Testing Strategy

### 1. Unit Tests

- Template configuration validation
- Section component rendering
- Registry functionality

### 2. Integration Tests

- Template switching
- Data flow through components
- Section rendering with different data

### 3. Visual Regression Tests

- Template appearance consistency
- Responsive behavior
- Print layout verification

## Best Practices

### 1. Template Design

- Use semantic class names
- Keep styling consistent within templates
- Test with various data scenarios

### 2. Component Development

- Follow the established pattern
- Handle empty data gracefully
- Use TypeScript for type safety

### 3. Configuration Management

- Use template IDs for persistence
- Provide sensible defaults
- Validate template configurations

## Migration Guide

### From Old System

The old system used variant-based rendering with scattered logic. Migration involved:

1. **Extracting header logic** into dedicated component
2. **Creating section registry** for centralized management
3. **Simplifying template configuration** to remove variants
4. **Updating section components** to use template ID-based logic

### Benefits Achieved

- **Reduced complexity**: Eliminated variant logic
- **Improved maintainability**: Clear separation of concerns
- **Enhanced extensibility**: Easy to add new templates/sections
- **Better type safety**: Full TypeScript coverage
- **Cleaner code**: Follows React best practices

## Future Enhancements

### 1. Template Builder

Visual template builder for non-technical users to create custom templates.

### 2. Dynamic Sections

Allow users to reorder sections or hide/show them dynamically.

### 3. Custom Styling

Advanced styling options with CSS-in-JS or custom CSS classes.

### 4. Template Marketplace

Community-driven template sharing system.

### 5. A/B Testing

Template performance testing and optimization.

## Conclusion

The refactored preview and template system provides a solid foundation for future development. The architecture is:

- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add new features
- **Performant**: Optimized rendering
- **Type-safe**: Full TypeScript coverage
- **Testable**: Components are independently testable

This system will scale well as the application grows and new requirements emerge. 