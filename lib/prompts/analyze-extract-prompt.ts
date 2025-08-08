export function generateExtractResumeUserPrompt(input: { rawText?: string; note?: string; }): string {
  const { rawText = '', note = '' } = input || {};
  return `請從以下履歷或資料中，精準抽取結構化「完整履歷內容」(resume)。
嚴禁補造或推測，未知留空或省略。只輸出 JSON 的 resume 欄位，不要任何多餘文字。

原始文本：
${rawText}

補充備註：
${note || '無'}

請輸出以下 JSON 結構的 resume：
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
- 僅抽取文本中明確出現的內容（例如 titles、companies、periods、technologies、outcomes）。
- 對於 projects/experience/achievements：
  - description 只放「一句話摘要／角色說明」，不得拼接條列要點。
  - outcomes 為每一條條列（•、-、–、數字編號或換行）逐條放入陣列，保留數字、金額（如 $1.2mm）、百分比與技術名詞。
  - 若是長段落但語意上為多條事蹟，請依句點或分號切分為多條 outcomes。
- 未出現或不確定之資訊留空或省略欄位。
- 只輸出 JSON，結束於右大括號。`;
}