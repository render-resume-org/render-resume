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
    title: string;
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
    description: string;
    technologies: string[];
    achievements: string[];
    duration?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    details?: string[];
  }>;
  achievements?: Array<{
    title: string;
    description: string;
    date?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}
export { };
