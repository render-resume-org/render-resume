import type { OptimizedResume } from '@/types/resume';
import type { UnifiedResume } from '@/types/resume-unified';

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
    skills: (optimized.skills || []).map(s => ({
      category: s.category,
      items: String(s.items || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    })),
    achievements: (optimized.achievements || []).map(a => ({
      title: a.title,
      organization: a.organization,
      period: a.period,
      outcomes: a.outcomes || [],
    })),
    experience: (optimized.experience || []).map(e => ({
      title: e.title,
      company: e.company,
      period: e.period,
      outcomes: e.outcomes || [],
    })),
    projects: (optimized.projects || []).map(p => ({
      name: p.name,
      period: p.period,
      outcomes: p.outcomes || [],
    })),
    education: (optimized.education || []).map(ed => ({
      degree: ed.degree,
      school: ed.school,
      period: ed.period,
      gpa: ed.gpa,
      outcomes: ed.outcomes || [],
    })),
  };
}
