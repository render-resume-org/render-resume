import type { OptimizedResume } from '@/features/resume/types/resume';
import type { UnifiedResume } from '@/features/resume/types/resume-unified';

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
    skills: (unified.skills || []).map(s => ({ category: s.category || '', items: (s.items || []).join(', ') })),
    achievements: (unified.achievements || []).map(a => ({
      title: a.title || '',
      organization: a.organization,
      period: a.period,
      outcomes: [...(a.outcomes || [])],
    })),
    experience: (unified.experience || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      period: exp.period || '',
      outcomes: [...(exp.outcomes || [])],
    })),
    projects: (unified.projects || []).map(p => ({
      name: p.name || '',
      period: p.period || '',
      outcomes: p.outcomes || [],
    })),
    education: (unified.education || []).map(e => ({
      degree: e.degree || '',
      major: '',
      school: e.school || '',
      period: e.period || '',
      outcomes: e.outcomes || [],
      gpa: e.gpa,
      honor: undefined,
    })),
  };
}


