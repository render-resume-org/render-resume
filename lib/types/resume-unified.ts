import { z } from 'zod';

export const UnifiedLinkSchema = z.object({
  linkedin: z.string().optional(),
  github: z.string().optional(),
  website: z.string().optional(),
  portfolio: z.string().optional()
}).partial();

export const UnifiedPersonalInfoSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  links: UnifiedLinkSchema.optional()
}).partial();

export const UnifiedResumeBlockSchemas = {
  achievement: z.object({
    title: z.string(),
    organization: z.string().optional(),
    period: z.string().optional(),
    description: z.string().optional(),
    outcomes: z.array(z.string()).optional()
  }),
  experience: z.object({
    title: z.string(),
    company: z.string().optional(),
    period: z.string().optional(),
    description: z.string().optional(),
    outcomes: z.array(z.string()).optional()
  }),
  education: z.object({
    degree: z.string(),
    school: z.string(),
    period: z.string().optional(),
    gpa: z.string().optional(),
    relevant_courses: z.array(z.string()).optional(),
    outcomes: z.array(z.string()).optional()
  }),
  project: z.object({
    name: z.string(),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    outcomes: z.array(z.string()).optional()
  }),
  skill: z.object({
    category: z.string(),
    items: z.array(z.string())
  })
};

export const UnifiedResumeSchema = z.object({
  personalInfo: UnifiedPersonalInfoSchema.optional(),
  summary: z.string().optional(),
  achievements: z.array(UnifiedResumeBlockSchemas.achievement).default([]),
  experience: z.array(UnifiedResumeBlockSchemas.experience).default([]),
  education: z.array(UnifiedResumeBlockSchemas.education).default([]),
  projects: z.array(UnifiedResumeBlockSchemas.project).default([]),
  skills: z.array(UnifiedResumeBlockSchemas.skill).default([])
});

export const UnifiedHighlightSchema = z.object({
  title: z.string(),
  description: z.string(),
  excerpt: z.string().optional().default('')
});

export const UnifiedIssueSchema = z.object({
  title: z.string(),
  description: z.string(),
  suggested_change: z.string(),
  missing_information: z.string(),
  impact: z.string(),
  excerpt: z.string().optional().default('')
});

export const LetterGradeSchema = z.enum(['A+','A','A-','B+','B','B-','C+','C','C-','D','F']);

export const UnifiedScoreSchema = z.object({
  category: z.string(),
  grade: LetterGradeSchema,
  description: z.string(),
  comment: z.string(),
  suggestions: z.array(z.string()).default([])
});

export const UnifiedResumeAnalysisSchema = z.object({
  resume: UnifiedResumeSchema,
  highlights: z.array(UnifiedHighlightSchema).default([]),
  issues: z.array(UnifiedIssueSchema).default([]),
  scores: z.array(UnifiedScoreSchema).default([])
});

export type UnifiedResumeAnalysisResult = z.infer<typeof UnifiedResumeAnalysisSchema>;
export type UnifiedResume = z.infer<typeof UnifiedResumeSchema>;
export type UnifiedScore = z.infer<typeof UnifiedScoreSchema>;
export type UnifiedIssue = z.infer<typeof UnifiedIssueSchema>;
export type UnifiedHighlight = z.infer<typeof UnifiedHighlightSchema>;