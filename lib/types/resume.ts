export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  timestamp: string;
}

export interface OptimizedResume {
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
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    major: string;
    school: string;
    period: string;
    details?: string[];
    gpa?: string;
    honor?: string;
  }>;
}
export { };
