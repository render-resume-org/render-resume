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

/*
暫時保留原始程式碼：
export function generateEvaluateUserPrompt(input: {
  resume: UnifiedResume;
  contextNote?: string;
}): string {
  const { resume, contextNote = '' } = input;
  const resumeJson = JSON.stringify({ resume }, null, 2);
  const ISSUES_FOLLOWUPS_GUIDE = `
- 針對履歷實際內容，避免 general/模糊語句
- Title 與內容包含明確 reference（專案/公司/成就/學校/技術）
- 內容具體，可直接採取動作，避免只寫「請補充」
- 語氣專業友善，目標是補齊關鍵資訊
- 可針對不同專案/經歷/成就/教育/技術提出多個 issue
- 若內容允許，至少 5 項以上具名且具體的 issues
- 命名示例：「ABC 電商平台｜後端工程師：缺少交易量量化」`;
  return `請根據以下已抽取之「完整履歷內容」(resume)，產生最終分析結果（JSON）：包含 highlights、issues、scores；
若必要可對 resume 進行極小幅修正（僅限格式與明顯錯字），嚴禁虛構內容。

參考說明：
${contextNote || '無'}

已抽取的 resume：
\`\`\`json
${resumeJson}
\`\`\`

請輸出以下 JSON 結構：
{
  "resume": <同上 resume 結構，可微調>,
  "highlights": Array<{
    "title": string,
    "description": string,
    "excerpt": string
  }>,
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
各類別均需產生一則評分。comment 必須包含【推理過程】【最終評分】【改進建議】三段，並引用 resume 內的具體證據（如專案、技術、成果）。
若某類別在輸入中完全沒有可用資訊，grade 應為 F，並於 comment 明確寫出「完全無法提取相關內容」。
再次確認 resume 的結構化要求：
- description 僅保留一句摘要或角色說明；
- outcomes 為逐條要點清單，保留原量化與技術名詞，不要把多條合併到 description；

Highights 與 Issues 的對齊要求：
- 所有 highlights 必須「具名」對應履歷細節（例如含專案/公司/技術/數字），description 語句需緊扣證據，excerpt 提供原文引用（1 句或 1 條要點）。
- 所有 issues 必須指出具體段落缺失或可改善處，suggested_change 提供可直接寫入履歷的改寫句或補充方向；missing_information 僅列出欠缺的關鍵欄位（如規模、量化數據、工具、指標）；impact 說明對 ATS 或招募評估的實際影響；excerpt 引用對應的原文。
- Issues 的命名需包含對應的實體參照（如專案/公司/角色/技術），並避免模糊、通用的表述；內容必須具體，不能只說「請補充」。若內容充足，至少涵蓋 5 項以上具名且具體的 issues。
${ISSUES_FOLLOWUPS_GUIDE}

評分與回覆格式（沿用舊規範，整合精簡）：
- 六大類別各產出 1 筆評分（不可缺漏）：技術深度與廣度、項目複雜度與影響力、專業經驗完整度、教育背景、成果與驗證、整體專業形象。
- grade 只能使用等第制："A+"|"A"|"A-"|"B+"|"B"|"B-"|"C+"|"C"|"C-"|"D"|"F"。
- description：用 1-2 句總結該類別的整體判斷，必須引用履歷中的關鍵詞（如技術、數字、專案名）。
- comment 必須包含完整 CoT 結構（以指定語言撰寫）：
  【推理過程】觀察：引用履歷證據；STAR：S/T/A/R 各 1 句；標準對照：對照該等第標準；權衡判斷：給出結論理由。
  【最終評分】<等第>。
  【改進建議】給出 2-4 條具體可執行建議。
- suggestions：2-5 條行動化建議（短句），與 comment 的改進建議一致且具體，避免空話（如「加強描述」）。

語言注意事項：
- highlights 與 issues，以及 scores 的 description/comment/suggestions 皆使用系統提示中指定的語言（locale）。
- resume 維持原始語言，不做翻譯。
只輸出 JSON。`;
}
*/