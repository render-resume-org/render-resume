
import { Education, Experience, Links, PersonalInfo, Project } from '@/lib/upload-utils';

/**
 * 產生分析履歷文件的 user prompt
 * @param textContent 文件內容彙總（可為空）
 * @param additionalText 額外補充說明（可為空）
 * @param hasImages 是否包含圖像或 PDF
 * @param education 教育背景資訊
 * @param experience 工作經驗資訊
 * @param projects 專案經驗資訊
 * @param skills 技能列表
 * @param personalInfo 個人基本資料
 * @param links 連結資訊
 */
export function generateAnalyzeDocumentUserPrompt({
  textContent = '',
  additionalText = '',
  hasImages = false,
  education,
  experience,
  projects,
  skills,
  personalInfo,
  links
}: {
  textContent?: string;
  additionalText?: string;
  hasImages?: boolean;
  education?: Education[];
  experience?: Experience[];
  projects?: Project[];
  skills?: string;
  personalInfo?: PersonalInfo;
  links?: Links;
}): string {
  
  let userPrompt = '';
  if (textContent) {
    userPrompt += `請分析以下文件內容：\n\n${textContent}`;
  }
  if (additionalText) {
    userPrompt += `\n\n額外資訊：\n${additionalText}`;
  }
  if (hasImages) {
    userPrompt += '\n\n請同時分析上面提供的圖像檔案。';
  }

  // 處理教育背景資訊
  if (education && education.length > 0) {
    userPrompt += `\n\n教育背景資訊：\n${education.map(edu => {
      const duration = edu.isCurrent ? 
        `${edu.startMonth}/${edu.startYear} - 現在` : 
        `${edu.startMonth}/${edu.startYear} - ${edu.endMonth}/${edu.endYear}`;
      return `- ${edu.school} ${edu.degree} ${edu.major} (${duration}) GPA: ${edu.gpa}`;
    }).join('\n')}`;
  }

  // 處理工作經驗資訊
  if (experience && experience.length > 0) {
    userPrompt += `\n\n工作經驗資訊：\n${experience.map(exp => {
      const duration = exp.isCurrent ? 
        `${exp.startMonth}/${exp.startYear} - 現在` : 
        `${exp.startMonth}/${exp.startYear} - ${exp.endMonth}/${exp.endYear}`;
      return `- ${exp.company} ${exp.position} (${exp.location})\n  期間：${duration}\n  描述：${exp.description}`;
    }).join('\n\n')}`;
  }

  // 處理專案經驗資訊
  if (projects && projects.length > 0) {
    userPrompt += `\n\n專案經驗資訊：\n${projects.map(project => {
      const duration = project.isCurrent ? 
        `${project.startMonth}/${project.startYear} - 現在` : 
        `${project.startMonth}/${project.startYear} - ${project.endMonth}/${project.endYear}`;
      return `- ${project.name}\n  期間：${duration}\n  描述：${project.description}`;
    }).join('\n\n')}`;
  }

  // 處理技能列表
  if (skills) {
    userPrompt += `\n\n技能列表：\n${skills}`;
  }

  // 處理個人基本資料
  if (personalInfo) {
    userPrompt += `\n\n個人基本資料：\n地址：${personalInfo.address}\n電話：${personalInfo.phone}\n郵箱：${personalInfo.email}`;
  }

  // 處理連結資訊
  if (links) {
    userPrompt += `\n\n連結：\nLinkedIn：${links.linkedin}\nGitHub：${links.github}\n作品集：${links.portfolio}`;
  }
  userPrompt += `

請以 JSON 格式回傳履歷分析結果，包含以下欄位：
- profile: 個人基本資料（包含 name, title, brief_introduction, email, phone, location, linkedin, github, website, portfolio）
- projects: 專案列表（每個專案包含 name, description, technologies, duration, role, contribution）
- projects_summary: 專案摘要
- expertise: 技能列表
- expertise_summary: 技能摘要
- work_experiences: 工作經驗列表（每個經驗包含 company, position, duration, description, contribution, technologies）
- work_experiences_summary: 工作經驗摘要
- education_background: 教育背景列表（每個教育經歷包含 institution, degree, major, duration, gpa, courses, achievements）
- education_summary: 教育背景摘要
- achievements: 成就列表
- achievements_summary: 成就摘要
- missing_content: 缺失內容分析（包含 critical_missing, recommended_additions, impact_analysis, priority_suggestions, follow_ups）
- scores: 評分列表（每個評分包含 category, grade, description, comment, icon, suggestions）

**重要提醒 - 必須包含所有 6 個評分類別**：
scores 陣列必須包含以下 6 個評分類別，每個都必須有評分：
1. 「技術深度與廣度」- icon: 💻
2. 「項目複雜度與影響力」- icon: 🚀  
3. 「專業經驗完整度」- icon: 💼
4. 「教育背景」- icon: 🎓
5. 「成果與驗證」- icon: 🏆
6. 「整體專業形象」- icon: ✨

**重要提醒 - 評分欄位的 comment 格式要求**：
在 scores 的 comment 欄位中，必須包含完整的 Chain of Thought 推理過程，格式如下：
"【推理過程】觀察：候選人展示了...證據。STAR分析：S-情境描述完整，T-任務明確，A-行動具體，R-結果量化。對照標準：符合A+等第的...要求。權衡判斷：技術深度和廣度都...。【最終評分】A+ - 技術領域頂尖專家，引領技術趨勢。【改進建議】建議..."

特別注意：
1. 對於履歷內容，請盡可能保留所有詳細資訊
2. 僅整合明確提及的資訊，缺失資料必須留空
3. 嚴禁基於部分資訊進行推理或產生幻覺
4. 在 missing_content 中明確指出缺失的關鍵履歷要素
5. 使用 STAR 原則評估項目和工作經驗的完整性
6. 評分的 comment 欄位必須嚴格遵循 CoT 推理格式，包含【推理過程】、【最終評分】、【改進建議】三個部分
7. 對於完全無法提取內容的項目，仍要給予評分與回饋，但評分為 F
8. **必須確保 scores 陣列包含上述所有 6 個類別，不可遺漏任何一個**
9. **missing_content 的 follow_ups 欄位必須包含「5 個（含）以上」具體針對履歷內容（如工作經驗、專案、成就等）的提問。**

請務必遵循以下規範，否則將導致履歷補全流程失效：

- 每個 follow_up 必須針對履歷中實際出現的內容（如：專案名稱、公司名稱、成就名稱、學校名稱、技術名稱等）提出具體、明確的追問，嚴禁產生 general 或模糊的問題。
- **標題（title）與內容（question）都必須明確包含該 reference（如專案名稱、公司名稱、成就名稱等），讓使用者一眼就能知道這個追問是針對哪一段履歷內容。**
- 問題內容需具體、明確，必須針對履歷中實際出現的內容設計，不能只問「請補充更多細節」或「請說明你的專案經驗」這類籠統問題。
- 請以年輕活潑但專業的語氣協助補齊關鍵缺失資訊，避免生成履歷時產生幻覺。
- 每個 follow_up 都要像這樣：
  - title: "ABC 電商平台專案細節追問"
  - question: "你在 ABC 電商平台專案中提到開發了內部工具，能跟我聊聊這個工具為團隊減少了多少開發時間嗎？還有當時遇到的最大技術挑戰是什麼？"
- 你可以針對同一份履歷的不同專案、不同工作經驗、不同成就、不同教育背景、不同技術能力等，分別設計多個 follow_up。
- **嚴禁產生與履歷內容無關的泛用問題，也不能只用「請補充」等模糊字眼。**
- 請務必產生「5 個（含）以上」具體且有 reference 的 follow_up，否則視為不合格。

**強烈提醒：如未嚴格遵守上述規範，將導致履歷補全與智能追問功能失效，請務必逐條檢查！**

**強制 F 評分規則**：
- 如果「技術深度與廣度」類別完全無法從履歷中提取到任何技能、專案技術棧或工作中使用的技術，必須給予 F 評分
- 如果「項目複雜度與影響力」類別完全無法提取到任何專案或項目經驗，必須給予 F 評分  
- 如果「專業經驗完整度」類別完全無法提取到任何工作經驗，必須給予 F 評分
- 如果「教育背景」類別完全無法提取到任何教育資訊，必須給予 F 評分
- 如果「成果與驗證」類別完全無法提取到任何成就、獎項或證書，必須給予 F 評分
- 如果「整體專業形象」類別因為履歷內容嚴重不足無法評估，必須給予 F 評分
- F 評分的 comment 必須明確說明「完全無法提取相關內容」作為評分理由

請確保回傳有效的 JSON 格式。`;
  return userPrompt;
} 