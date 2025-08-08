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
      company: string;
      projectName: string;
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
    sections: Array<'summary' | 'skills' | 'experience' | 'projects' | 'education' | 'achievements'>;
  };
  styles: {
    header: string;
    sectionTitle: string;
    showSectionIcons: boolean;
  };
}

export const standardTemplate: ResumeTemplate = {
  id: 'standard',
  name: 'Standard',
  font: {
    family: 'font-serif',
    sizes: {
      title: 'text-3xl font-bold text-center',
      subtitle: 'text-sm text-center',
      heading: 'text-lg font-bold uppercase tracking-wide',
      body: 'text-sm',
      caption: 'text-sm',
      company: 'text-base font-bold',
      projectName: 'text-base font-bold',
    },
  },
  colors: {
    primary: 'text-black',
    secondary: 'text-black',
    text: 'text-black',
    background: 'bg-white',
  },
  spacing: {
    section: 'mb-2',
    item: 'mb-4',
    line: 'mb-1',
  },
  layout: {
    sections: ['summary', 'experience', 'projects', 'education', 'skills', 'achievements'],
  },
  styles: {
    header: 'mb-2',
    sectionTitle: 'border-b border-black pb-1 mb-2',
    showSectionIcons: false,
  },
};

// 先暫時 disable latexTemplate 直到 implement 支援 latex 程式碼下載
export const latexTemplate: ResumeTemplate = {
  id: 'latex',
  name: 'LaTeX',
  font: {
    family: 'font-serif',
    sizes: {
      title: 'text-3xl font-bold text-center',
      subtitle: 'text-sm text-center',
      heading: 'text-lg font-bold uppercase tracking-wide',
      body: 'text-sm',
      caption: 'text-sm',
      company: 'text-base font-bold',
      projectName: 'text-base font-bold',
    },
  },
  colors: {
    primary: 'text-black',
    secondary: 'text-black',
    text: 'text-black',
    background: 'bg-white',
  },
  spacing: {
    section: 'mb-4',
    item: 'mb-4',
    line: 'mb-1.5',
  },
  layout: {
    sections: ['summary', 'experience', 'projects', 'education', 'skills', 'achievements'],
  },
  styles: {
    header: 'mb-2',
    sectionTitle: 'border-b border-black pb-1 mb-3',
    showSectionIcons: false,
  },
};

export const modernTemplate: ResumeTemplate = {
  id: 'modern',
  name: 'Modern',
  font: {
    family: 'font-sans',
    sizes: {
      title: 'text-3xl font-bold text-center',
      subtitle: 'text-sm text-center',
      heading: 'text-lg font-bold uppercase tracking-wide',
      body: 'text-sm',
      caption: 'text-sm',
      company: 'text-base font-bold',
      projectName: 'text-base font-bold',
    },
  },
  colors: {
    primary: 'text-black',
    secondary: 'text-black',
    text: 'text-black',
    background: 'bg-white',
  },
  spacing: {
    section: 'mb-2',
    item: 'mb-4',
    line: 'mb-1',
  },
  layout: {
    sections: ['summary', 'experience', 'projects', 'education', 'skills', 'achievements'],
  },
  styles: {
    header: 'mb-2',
    sectionTitle: 'border-b border-black pb-1 mb-2',
    showSectionIcons: false,
  },
};

// 所有模板定義（包括已禁用的）
export const allTemplates = [standardTemplate, modernTemplate, latexTemplate];

// 可選的模板（已禁用的模板不包含在此）
export const availableTemplates = [standardTemplate, modernTemplate];

export function getTemplateById(id: string): ResumeTemplate {
  return allTemplates.find(template => template.id === id) ?? standardTemplate;
} 