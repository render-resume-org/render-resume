# evaluate prompt improvement

## <score_spec> improvement

### plan

Goal: 重新設定履歷評分的面向，盡可能涵蓋大部分影響履歷品質的要素。

評分面向
- 資訊完整性（20%）
  - 是否包含姓名、電話號碼、電子信箱、工作經歷、教育背景、技能等基本欄位 - 10%
  - 是否包含必要的時間資訊（起訖年月）- 10%
- 架構（20%）
  - 是否合理安排段落順序（經歷→教育→技能, 或教育→經歷→技能 for new grad）- 5%
  - 是否按照時間倒序排列經歷內容 - 5%
  - 是否條列呈現經歷內容（大部分條列敘述不超過 25 字/英文、40 字/中文，同個經歷的 bullet point 控制在 2-4 則）- 10%
  - 是否控制整體長度在一頁內（現階段不實作）
- 技能與相關性（20%）
  - 是否充分提供技能應用的實例 - 20%
  - 是否涵蓋 JD 所要求的技能（現階段不實作）
  - 是否突顯與目標職位相關的經歷（現階段不實作）
- 內容（40%）
  - 是否以行動導向的動詞開頭，並強調成就而非僅列職責 - 5%
  - 是否避免空泛詞彙 - 5%
  - 是否沒有拼字與文法錯誤 - 5%
  - 是否在大部分經歷都充分呈現量化成果 - 25%

每條評分標準後的數字表示滿足該標準可得的最高分數 e.g. 25% 代表對應該標準可得的分數落在 0 - 25 分。
依照滿足標準的程度給予相應分數，越充分的滿足標準可獲得越多分數。
根據以上標準對履歷進行完整評分後，將分數加總，並根據以下等地對照表將總分對照成等地輸出。

等地對照表：
- 95-100: A+
- 90-94: A
- 85-89: A-
- 80-84: B+
- 75-79: B
- 70-74: B-
- 65-69: C+
- 60-64: C
- 55-59: C-
- 0-54: F

### prompt

<score_spec>
The score represents a weighted evaluation of the resume based on the following dimensions:

- Completeness (15%)
  - Includes essential fields: name, phone, email, work experience, education, skills (10%)
  - Provides necessary time information (start and end dates) (5%)

- Structure (20%)
  - Uses logical section order (Experience→Education→Skills, or Education→Experience→Skills for new graduates) (5%)
  - Lists experiences in reverse chronological order (5%)
  - Uses bullet points effectively (most under 25 words in English or 40 in Chinese, 2-4 bullets per role) (10%)

- Skills & Relevance (20%)
  - Provides concrete examples of skill application (20%)

- Content (45%)
  - Starts bullets with action verbs and emphasizes achievements, not just responsibilities (5%)
  - Avoids vague or generic wording (5%)
  - Contains no spelling or grammar errors (5%)
  - Demonstrates quantified results in most experiences (20%)
  - Shows highly competitive experiences (10%)

Scoring:
- Each criterion is scored from 0 to its maximum weight.
- Award points very strictly: full points only for flawless fulfillment; even strong but not perfect cases should earn at most 60-70% of the weight; moderate fulfillment earns around 40-50%; weak or missing evidence earns near zero.
- Sum all points to determine total score (0-100), then map to grade.

Grade mapping:
- 98-100: A+
- 95-97: A
- 90-94: A-
- 85-89: B+
- 80-84: B
- 75-79: B-
- 70-74: C+
- 65-69: C
- 60-64: C-
- 0-59: F
</score_spec>
