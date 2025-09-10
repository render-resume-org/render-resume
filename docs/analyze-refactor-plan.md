# Analyze Refactor Plan

## Goals
- Split `POST /api/analyze` into `POST /api/analyze/[service_type]` with `service_type` ∈ { `create`, `optimize` }.
- Redesign model response structure to a unified shape: `{ resume, highlights, issues, scores }`.
- Keep Scores UI unchanged; refactor Results detail UI to consume the new shape.
- Optimize service uses a two-step workflow: (1) extract exact resume content, (2) evaluate to final shape.
- Clean separation of concerns: system prompts, user prompts, and response validation schemas.
- Smart Chat: use `issues` as suggestion templates.

## API
- New routes: `app/api/analyze/[service_type]/route.ts`
  - Accepts JSON and multipart/form-data.
  - Auth and usage checks preserved.
  - `service_type=create`: single-pass analysis to unified shape.
  - `service_type=optimize`: multi-prompt: extract -> evaluate -> unify.

## Prompts & Validation
- New prompts:
  - `generateExtractResumeUserPrompt` → returns only the `resume` object.
  - `generateEvaluateResumeUserPrompt` → inputs `resume` + optional context; returns `{ resume?, highlights, issues, scores }`.
- New Zod schema `UnifiedResumeAnalysisSchema` under `lib/types/resume-unified.ts`.
- OpenAI client updated to support JSON object mode and validate against the unified schema.

## Data Model (Unified)
```
{
  resume: {
    personalInfo: { name, title, email, phone, location, links },
    summary: string,
    achievements: Array<{ title, organization, period, description, outcomes }>,
    experience: Array<{ title, company, period, description, outcomes }>,
    education: Array<{ degree, school, period, gpa, outcomes }>,
    projects: Array<{ name, description, technologies, outcomes }>,
    skills: Array<{ category: string, items: string[] }>
  },
  highlights: Array<{ title, description, excerpt }>,
  issues: Array<{ title, description, suggested_change, missing_information, impact, excerpt }>,
  scores: Array<{ category, grade, description, comment, suggestions }>
}
```

## Frontend Changes
- Update client API calls in `lib/api/resume-analysis.ts` to use `/api/analyze/[service_type]`.
- Refactor `app/(protected)/results/page.tsx` and `components/results/results-detailed-sections.tsx` to render new `resume`, `highlights`, `issues`.
- Keep `AnalysisScores` unchanged.
- Smart Chat templates now initialize from `analysisResult.issues`.

## Notes
- Backward compatibility: keep legacy types available during migration if needed; server maps to unified shape.
- Ensure linter and type checks pass.