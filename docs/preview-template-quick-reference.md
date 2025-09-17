# Preview & Template System - Quick Reference

## 🚀 Quick Start

### Template Selection
```typescript
import { getTemplateById, availableTemplates } from '@/lib/config/resume-templates';

// Get template by ID
const template = getTemplateById('latex');

// List all available templates
console.log(availableTemplates.map(t => ({ id: t.id, name: t.name })));
```

### Render Resume
```typescript
import ResumePreview from '@/components/preview/resume-preview';

<ResumePreview resumeData={resumeData} template={template} />
```

## 📁 File Structure

```
components/preview/
├── resume-preview.tsx          # Main orchestrator
├── resume-header.tsx           # Header component
├── resume-section.tsx          # Section wrapper
├── section-registry.tsx        # Section management
└── sections/
    ├── summary-section.tsx
    ├── skills-section.tsx
    ├── experience-section.tsx
    ├── projects-section.tsx
    └── education-section.tsx

lib/config/
└── resume-templates.ts         # Template configurations
```

## 🎨 Template Configuration

### Basic Template Structure
```typescript
const myTemplate: ResumeTemplate = {
  id: 'my-template',
  name: 'My Template',
  font: {
    family: 'font-sans',
    sizes: {
      title: 'text-3xl font-bold',
      subtitle: 'text-xl',
      heading: 'text-lg font-semibold',
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
    section: 'mb-8',
    item: 'mb-4',
    line: 'mb-1',
  },
  layout: {
    sections: ['summary', 'skills', 'experience', 'projects', 'education'],
  },
  styles: {
    header: 'border-b-2 border-blue-600 pb-6 mb-6',
    sectionTitle: 'flex items-center mb-4',
    showSectionIcons: true,
  },
};
```

### Available Font Families
- `font-sans` - Default sans-serif
- `font-serif` - Serif fonts
- `font-mono` - Monospace fonts

### Color Schemes
```typescript
// Standard (Black)
colors: {
  primary: 'text-black',
  secondary: 'text-black',
  text: 'text-black',
  background: 'bg-white',
}

// LaTex (Black)
colors: {
  primary: 'text-black',
  secondary: 'text-black',
  text: 'text-black',
  background: 'bg-white',
}

// Modern (Black)
colors: {
  primary: 'text-black',
  secondary: 'text-black',
  text: 'text-black',
  background: 'bg-white',
}
```

## 🔧 Section Components

### Section Component Pattern
```typescript
interface SectionProps {
  data: OptimizedResume[SectionName];
  template: ResumeTemplate;
}

export default function MySection({ data, template }: SectionProps) {
  const { font, colors, spacing, styles } = template;

  if (!data || data.length === 0) return null;

  const isLatexTemplate = template.id === 'latex';

  if (isLatexTemplate) {
    return <LatexLayout />;
  }

  return <DefaultLayout />;
}
```

### Register New Section
```typescript
import { registerSection } from '@/components/preview/section-registry';
import MySection from './sections/my-section';

registerSection('my-section', MySection);
```

## 📊 Data Types

### Resume Data Structure
```typescript
interface OptimizedResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    period?: string;
    technologies: string[];
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    details?: string[];
  }>;
}
```

## 🎯 Common Patterns

### Template-Specific Rendering
```typescript
// Check template type
if (template.id === 'latex') {
  return <LatexSpecificComponent />;
}

// Use template styles
const headerClass = cn(font.sizes.title, colors.text, styles.header);
```

### Conditional Rendering
```typescript
// Show/hide based on data
if (!data || data.length === 0) return null;

// Show/hide based on template config
{styles.showSectionIcons && <Icon className="w-5 h-5" />}
```

### Dynamic Styling
```typescript
// Apply template styles
<div className={cn(
  font.sizes.body,
  colors.text,
  spacing.section
)}>
  {content}
</div>
```

## 🔄 State Management

### Template Selection
```typescript
const [currentTemplateId, setCurrentTemplateId] = useState('default');

// Save to localStorage
localStorage.setItem('selectedTemplateId', templateId);

// Load from localStorage
const savedTemplateId = localStorage.getItem('selectedTemplateId') || 'standard';
const template = getTemplateById(savedTemplateId);
```

### Template Switching
```typescript
const handleTemplateChange = (templateId: string) => {
  setCurrentTemplateId(templateId);
  localStorage.setItem('selectedTemplateId', templateId);
};
```

## 🧪 Testing

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import SkillsSection from './skills-section';

test('renders skills section', () => {
  const mockData = [{
    category: 'Technical',
    items: ['JavaScript', 'React']
  }];
  
  render(<SkillsSection data={mockData} template={defaultTemplate} />);
  
  expect(screen.getByText('Technical')).toBeInTheDocument();
});
```

### Template Testing
```typescript
test('template configuration is valid', () => {
  expect(defaultTemplate.id).toBe('default');
  expect(defaultTemplate.layout.sections).toContain('summary');
  expect(defaultTemplate.styles.showSectionIcons).toBe(true);
});
```

## 🐛 Common Issues

### Template Not Found
```typescript
// Error: Template not found
const template = getTemplateById('non-existent');
// Returns defaultTemplate as fallback
```

### Section Not Rendering
```typescript
// Check if section is registered
console.log(SECTION_REGISTRY['my-section']); // Should not be undefined

// Check if data exists
console.log(resumeData['my-section']); // Should not be null/undefined
```

### Styling Issues
```typescript
// Ensure template styles are applied
const className = cn(
  font.sizes.heading,    // Template font size
  colors.text,           // Template color
  styles.sectionTitle    // Template style
);
```

## 📈 Performance Tips

### Memoization
```typescript
// Memoize expensive components
export default React.memo(function MySection({ data, template }) {
  // Component logic
});
```

### Conditional Rendering
```typescript
// Only render if data exists
{data && data.length > 0 && <MySection data={data} template={template} />}
```

### Template Caching
```typescript
// Cache template lookup
const template = useMemo(() => 
  getTemplateById(templateId), [templateId]
);
```

## 🔗 Related Files

- **Template Config**: `lib/config/resume-templates.ts`
- **Section Registry**: `components/preview/section-registry.tsx`
- **Main Preview**: `components/preview/resume-preview.tsx`
- **Resume Types**: `types/resume.ts`
- **Preview Page**: `app/(protected)/download/page.tsx`

## 📚 Additional Resources

- [Full Architecture Documentation](./preview-template-architecture.md)
- [Template Design Guidelines](./template-design-guidelines.md)
- [Component Development Standards](./component-standards.md) 