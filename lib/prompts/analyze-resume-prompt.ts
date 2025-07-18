/**
 * 產生分析履歷內容的 user prompt
 * @param resumeContent 履歷內容
 * @param additionalText 額外補充說明
 */
export function generateAnalyzeResumeUserPrompt({
  resumeContent = '',
  additionalText = ''
}: {
  resumeContent?: string;
  additionalText?: string;
}): string {
  return `請分析以下履歷內容並以 JSON 格式回傳結果：

履歷內容：
${resumeContent}

額外資訊：
${additionalText || '無'}

請以 JSON 格式回傳分析結果，包含以下欄位：
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

### 具體化分析要求
在進行評分分析時，必須遵循以下具體化原則：

**推理過程具體化要求**：
1. **教育背景分析**：具體提及學校名稱、科系、相關修課科目（如資料結構、演算法分析、系統程式設計等），並分析這些課程與目標職位的關聯性
2. **項目經驗分析**：明確指出項目名稱、使用的具體技術棧、架構設計特點、解決的具體問題，分析技術選型的合理性和創新點
3. **工作經驗分析**：詳細描述在特定公司的具體職責、參與的產品功能模組、團隊規模、取得的量化成果
4. **技術能力分析**：具體評估每項技術的熟練程度證據，如框架使用深度、架構設計能力、問題解決複雜度
5. **成長軌跡分析**：追蹤候選人從學生到專業人士的發展路徑，分析職業選擇的邏輯性和成長速度

**改進建議具體化要求**：
1. **內容重整建議**：針對履歷中具體的項目描述、工作經歷段落，提出重新撰寫或調整的具體方向
2. **技術補強建議**：基於現有技術棧，指出需要學習的具體技術、框架版本、實作深度
3. **經驗缺口填補**：明確指出履歷中缺失的關鍵經驗類型（如 CI/CD 流程、微服務架構、大數據處理等），並建議具體的學習或實作方向
4. **格式優化建議**：針對履歷的特定段落或項目描述，提供具體的改寫範例或結構調整建議
5. **證據強化建議**：建議補充具體的量化指標、專案成果截圖、程式碼範例連結、技術文章等證明材料

特別注意：
1. 對於履歷內容，請盡可能保留所有詳細資訊
2. 僅整合明確提及的資訊，缺失資料必須留空
3. 嚴禁基於部分資訊進行推理或產生幻覺
4. 在 missing_content 中明確指出缺失的關鍵履歷要素
5. 使用 STAR 原則評估項目和工作經驗的完整性
6. 評分的 comment 欄位必須嚴格遵循 CoT 推理格式，包含【推理過程】、【最終評分】、【改進建議】三個部分
7. 對於完全無法提取內容的項目，仍要給予評分與回饋，但評分為 F
8. projects 和 work_experiences 都必須包含 technologies 欄位，並且必須是字串陣列
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
} 