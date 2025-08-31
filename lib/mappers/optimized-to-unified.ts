import type { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResume } from '@/lib/types/resume-unified';

export function mapOptimizedToUnified(optimized: OptimizedResume): UnifiedResume {
  return {
    personalInfo: {
      name: optimized.personalInfo.fullName,
      email: optimized.personalInfo.email,
      phone: optimized.personalInfo.phone,
      location: optimized.personalInfo.location,
      links: {
        website: optimized.personalInfo.website,
        linkedin: optimized.personalInfo.linkedin,
        github: optimized.personalInfo.github,
      },
    },
    summary: optimized.summary,
    skills: (optimized.skills || []).map(s => ({ category: s.category, items: s.items })),
    achievements: (optimized.achievements || []).map(a => ({
      title: a.title,
      organization: a.organization,
      period: a.period,
      description: a.details && a.details.length > 0 ? a.details[0] : '',
      outcomes: a.details && a.details.length > 1 ? a.details.slice(1) : [],
    })),
    experience: (optimized.experience || []).map(e => ({
      title: e.title,
      company: e.company,
      period: e.period,
      description: e.achievements && e.achievements.length > 0 ? e.achievements[0] : '',
      outcomes: e.achievements && e.achievements.length > 1 ? e.achievements.slice(1) : [],
    })),
    projects: (optimized.projects || []).map(p => ({
      name: p.name,
      description: p.achievements && p.achievements.length > 0 ? p.achievements[0] : '',
      technologies: p.achievements && p.achievements.length > 1 ? p.achievements.slice(1) : [],
      outcomes: undefined,
    })),
    education: (optimized.education || []).map(ed => ({
      degree: ed.degree,
      school: ed.school,
      period: ed.period,
      gpa: ed.gpa,
      relevant_courses: ed.details || [],
      outcomes: ed.honor ? [ed.honor] : [],
    })),
  };
}
