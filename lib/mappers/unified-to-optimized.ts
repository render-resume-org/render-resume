import type { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResume } from '@/lib/types/resume-unified';

export function mapUnifiedToOptimized(unified: UnifiedResume): OptimizedResume {
  return {
    personalInfo: {
      fullName: unified.personalInfo?.name || '',
      email: unified.personalInfo?.email || '',
      phone: unified.personalInfo?.phone || '',
      location: unified.personalInfo?.location || '',
      website: unified.personalInfo?.links?.website,
      linkedin: unified.personalInfo?.links?.linkedin,
      github: unified.personalInfo?.links?.github,
    },
    summary: unified.summary || '',
    skills: (unified.skills || []).map(s => ({ category: s.category || '', items: s.items || [] })),
    achievements: (unified.achievements || []).map(a => ({
      title: a.title || '',
      organization: a.organization,
      period: a.period,
      // Preserve first line as description followed by outcomes
      details: [
        ...(a.description ? [a.description] : []),
        ...((a.outcomes || []))
      ],
    })),
    experience: (unified.experience || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      period: exp.period || '',
      achievements: [
        ...(exp.description ? [exp.description] : []),
        ...((exp.outcomes || []))
      ],
    })),
    projects: (unified.projects || []).map(p => ({
      name: p.name || '',
      period: '',
      // Prefer description + outcomes if present, otherwise fall back to technologies
      achievements: [
        ...(p.description ? [p.description] : []),
        ...((p.outcomes || []).length ? (p.outcomes as string[]) : (p.technologies || []))
      ],
    })),
    education: (unified.education || []).map(e => ({
      degree: e.degree || '',
      major: '',
      school: e.school || '',
      period: e.period || '',
      details: (e.relevant_courses || []).concat(e.outcomes || []),
      gpa: e.gpa,
      honor: undefined,
    })),
  };
}


