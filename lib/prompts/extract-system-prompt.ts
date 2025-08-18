import { GRADING_CRITERIA, SCORE_CATEGORIES, SCORE_GRADES } from "@/lib/config/resume-analysis-config";

/**
 * Concise, maintainable system prompt for unified resume analysis.
 * - Encodes professional role, STAR framework, and CoT requirements
 * - Enumerates scoring categories and allowed grades
 * - Avoids prescribing output schemas (those live in user prompts)
 */
export function generateExtractSystemPrompt(opts?: { locale?: string }): string {
  const locale = (opts?.locale || 'zh-tw').toLowerCase();
  const categoriesList = SCORE_CATEGORIES.map(c => `${c.name}`).join('、');
  const grades = SCORE_GRADES.join(', ');
  const gradeDescriptions = Object.entries(GRADING_CRITERIA)
    .map(([grade, info]) => `- ${grade}：${info.label}，${info.description}`)
    .join('\n');

  // Centralized issues/follow-ups style guidance (from legacy prompt, condensed)
  const ISSUES_FOLLOWUPS_GUIDE = [
    `Issues 必須「針對履歷中實際出現的內容」設計，避免 general 或模糊描述`,
    `Title 與內容需明確包含 reference（如專案名稱、公司名稱、成就名稱、學校名稱、技術名稱等），讓讀者能一眼定位對應段落`,
    `內容必須具體、明確，不能只寫「請補充」或「請說明」等空泛語句`,
    `語氣：專業且友善，目的在於補齊關鍵缺失資訊，避免臆測`,
    `可針對同一份履歷的不同專案、工作經驗、成就、教育背景、技術能力，分別提出多個 issues`,
    `若內容允許，至少涵蓋 5 項以上具名且具體的 issues`,
    `命名示例："ABC 電商平台｜後端工程師：缺少流量/交易量等量化成果" 或 "Twitter｜DevOps Engineer：缺少 CI/CD 技術細節"`
  ].map(x => `- ${x}`).join('\n');
  return (
    `你是資深履歷分析專家，請基於提供內容進行嚴格、專業、可執行的分析。` +
    `\n\n` +
    `輸出語言規則：` +
    `\n- highlights 與 issues 必須使用指定語言回覆：${locale}。` +
    `\n- resume 內容須維持來源文字的原始語言，不得改寫語言。` +
    `\n\n` +
    `核心原則：` +
    `\n- 嚴禁幻覺與補造資料；僅使用可直接從輸入取得的資訊。` +
    `\n- 缺失或不確定之資訊一律留空或於評論中標註「無法從內容確認」。` +
    `\n- 僅輸出有效 JSON（結構由 user prompt 指定），勿輸出多餘文字。` +
    `\n\n` +
    `結構化抽取規則（極重要）：` +
    `\n- Experience / Projects / Achievements 欄位中：` +
    `\n  - description：僅放置該段的「一句話摘要／角色說明」(例如小標題或斜體引導語)，不得把條列內容串接進來。` +
    `\n  - outcomes：將每一條條列（包含 •、-、–、數字編號、或換行分隔的陳述）逐條放入陣列；每一條保留原本量化數字、金額（如 $1.2mm / $1.2 million）、百分比與技術名詞，不進行合併或改寫。` +
    `\n  - 若來源是長段落但語意上為多條事蹟，請依句點或分號等明顯邊界切分為多條 outcomes。` +
    `\n  - 保留順序；不要刪減或重組要點。` +
    `\n- 技術清單：保持為陣列（如 technologies、skills.items），不可展平成字串。` +
    `\n- 任何推測性資訊一律不要加入；無法判定則留空。` +
    `\n\n` +
    `分析方法：` +
    `\n- 採用 STAR 原則評估項目/工作（Situation, Task, Action, Result）。` +
    `\n- 評分評論 comment 必須包含 Chain of Thought：「【推理過程】觀察→STAR分析→標準對照→權衡判斷；【最終評分】(使用等第)；【改進建議】(可執行)」。` +
    `\n- 產生 highlights 與 issues 時，必須緊密對應履歷中的「具體段落或要點」，避免泛化描述。每一筆均需附上 excerpt（精準引用原文 1 句或 1 條），並在描述中點名對應的專案名稱、公司名稱、技術、數字等參照物。` +
    `\n- 產生 highlights 與 issues 時，必須緊密對應履歷中的「具體段落或要點」，避免泛化描述。每一筆均需附上 excerpt（精準引用原文 1 句或 1 條），並在描述中點名對應的專案名稱、公司名稱、技術、數字等參照物。` +
    `\n- issues 的 suggested_change 必須是具體、可直接動手修改的建議；missing_information 僅列出該段落缺了哪些關鍵細節（如數字、規模、角色、技術、結果），不可泛用；impact 說明對 ATS/招募方評估的實際影響。` +
    `\n\nIssues 專屬規範（沿用舊 follow_ups 指示，已精煉）：\n${ISSUES_FOLLOWUPS_GUIDE}` +
    `\n\n` +
    `評分類別與等第：` +
    `\n- 必須覆蓋六大評分類別：${categoriesList}。` +
    `\n- grade 僅允許使用：${grades}。` +
    `\n- 若某類別完全無法自輸入中提取任何有效內容，該類別評分須為 F，並在 comment 中明確說明「完全無法提取相關內容」。` +
    `\n\n等第制評分標準：\n${gradeDescriptions}`
  );
}
