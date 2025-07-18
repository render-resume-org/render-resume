export interface ResumeTemplate {
  id: string;
  name: string;
  font: {
    family: string;
    sizes: {
      title: string;
      subtitle: string;
      heading: string;
      body: string;
      caption: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  spacing: {
    section: string;
    item: string;
    line: string;
  };
  layout: {
    sections: Array<'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements' | 'certifications'>;
  };
  styles: {
    header: string;
    sectionTitle: string;
    showSectionIcons: boolean;
  };
}

export const defaultTemplate: ResumeTemplate = {
  id: 'default',
  name: 'Default',
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
    primary: 'text-cyan-600',
    secondary: 'text-gray-600 dark:text-gray-300',
    text: 'text-gray-900 dark:text-white',
    background: 'bg-white dark:bg-gray-800',
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
    header: 'border-b-2 border-cyan-600 pb-6 mb-6',
    sectionTitle: 'flex items-center mb-4',
    showSectionIcons: true,
  },
};

export const latexTemplate: ResumeTemplate = {
  id: 'latex',
  name: 'LaTex Like Professional',
  font: {
    family: 'font-serif',
    sizes: {
      title: 'text-4xl font-bold text-center',
      subtitle: 'text-sm text-center',
      heading: 'text-xs font-bold uppercase tracking-widest',
      body: 'text-sm',
      caption: 'text-sm',
    },
  },
  colors: {
    primary: 'text-black',
    secondary: 'text-gray-700',
    text: 'text-black',
    background: 'bg-white',
  },
  spacing: {
    section: 'mb-4',
    item: 'mb-4',
    line: 'mb-1.5',
  },
  layout: {
    sections: ['summary', 'education', 'experience', 'projects', 'skills'],
  },
  styles: {
    header: 'mb-6',
    sectionTitle: 'border-b border-black pb-1 mb-3',
    showSectionIcons: false,
  },
};

export const availableTemplates = [defaultTemplate, latexTemplate];

export function getTemplateById(id: string): ResumeTemplate {
  return availableTemplates.find(template => template.id === id) ?? defaultTemplate;
} 