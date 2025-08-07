import { UnifiedResume } from '@/lib/types/resume-unified';

export function generateEvaluateResumeUserPrompt(input: {
  resume: UnifiedResume;
  contextNote?: string;
}): string {
  const { resume, contextNote = '' } = input;
  const resumeJson = JSON.stringify({ resume }, null, 2);
  return `請根據以下已抽取之「完整履歷內容」(resume)，評估並產生最終分析結果（JSON），包含 highlights、issues、scores；若必要可對 resume 進行輕微修正（僅限格式與小錯誤修補，不可虛構）。

參考說明：
${contextNote || '無'}

已抽取的 resume：
\`\`\`json
${resumeJson}
\`\`\`

請輸出以下 JSON 結構：
{
  "resume": <同上 resume 結構，可微調>,
  "highlights": Array<{ "title": string, "description": string, "excerpt": string }>,
  "issues": Array<{
    "title": string,
    "description": string,
    "suggested_change": string,
    "missing_information": string,
    "impact": string,
    "excerpt": string
  }>,
  "scores": Array<{
    "category": string,
    "grade": "A+"|"A"|"A-"|"B+"|"B"|"B-"|"C+"|"C"|"C-"|"D"|"F",
    "description": string,
    "comment": string,
    "suggestions": string[]
  }>
}

評分類別需包含：技術深度與廣度、項目複雜度與影響力、專業經驗完整度、教育背景、成果與驗證、整體專業形象。
comment 必須包含【推理過程】【最終評分】【改進建議】段落。只輸出 JSON。`;
}