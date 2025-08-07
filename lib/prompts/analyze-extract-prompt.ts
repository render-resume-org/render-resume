export function generateExtractResumeUserPrompt(input: { rawText?: string; note?: string; }): string {
  const { rawText = '', note = '' } = input || {};
  return `請從以下履歷或資料中，精準抽取結構化「完整履歷內容」(resume)，只回傳 JSON 中的 resume 欄位，嚴禁補充未出現的資訊：

原始文本：
${rawText}

補充備註：
${note || '無'}

請只輸出以下 JSON 結構的 resume：
{
  "resume": {
    "personalInfo": { "name": string?, "title": string?, "email": string?, "phone": string?, "location": string?, "links": { "linkedin"?: string, "github"?: string, "website"?: string, "portfolio"?: string }? },
    "summary": string?,
    "achievements": Array<{ "title": string, "organization"?: string, "period"?: string, "description"?: string, "outcomes"?: string[] }>,
    "experience": Array<{ "title": string, "company"?: string, "period"?: string, "description"?: string, "outcomes"?: string[] }>,
    "education": Array<{ "degree": string, "school": string, "period"?: string, "gpa"?: string, "relevant_courses"?: string[], "outcomes"?: string[] }>,
    "projects": Array<{ "name": string, "description"?: string, "technologies"?: string[], "outcomes"?: string[] }>,
    "skills": Array<{ "category": string, "items": string[] }>
  }
}

規則：
- 僅抽取文本中明確出現的內容，未知則留空或省略欄位。
- 不要輸出任何解說或多餘文字，只輸出 JSON。`;
}