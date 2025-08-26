import { UnifiedResume } from '@/lib/types/resume-unified';

export function generateEvaluateUserPrompt(resume: UnifiedResume): string {
  const resumeJson = JSON.stringify({ resume }, null, 2);
  const userPrompt = `
Analyze the following resume and produce the final analysis strictly in JSON format, fully aligned with <output_spec> and <language_rules>.
- The resume field must exactly return the input JSON below without modification or omission.
- Do not fabricate or alter any resume content.
- Other fields (scores, comment, highlights, issues) must follow the detailed rules from the system prompt.

Extracted resume:
\`\`\`json
${resumeJson}
\`\`\`

Output only valid JSON. No extra explanations.`;

  return userPrompt;
}