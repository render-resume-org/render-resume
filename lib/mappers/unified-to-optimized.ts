import type { OptimizedResume } from '@/lib/types/resume';
import type { UnifiedResume } from '@/lib/types/resume-unified';

function mergeTextAndBullets(text?: string, bullets?: string[]): string[] {
  const items: string[] = [];
  // Include description only when non-empty
  if (text && text.trim()) items.push(text.trim());
  // Preserve empties for bullets to support creating new items
  if (Array.isArray(bullets)) {
    for (const b of bullets) items.push(b ?? '');
  }
  return items;
}

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
      details: mergeTextAndBullets(a.description, a.outcomes),
    })),
    experience: (unified.experience || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      period: exp.period || '',
      achievements: mergeTextAndBullets(exp.description, exp.outcomes),
    })),
    projects: (unified.projects || []).map(p => ({
      name: p.name || '',
      period: '',
      achievements: mergeTextAndBullets(p.description, p.outcomes?.length ? p.outcomes : p.technologies),
    })),
    education: (unified.education || []).map(e => ({
      degree: e.degree || '',
      major: '',
      school: e.school || '',
      period: e.period || '',
      details: mergeTextAndBullets(undefined, (e.relevant_courses || []).concat(e.outcomes || [])),
      gpa: e.gpa,
      honor: undefined,
    })),
  };
}


