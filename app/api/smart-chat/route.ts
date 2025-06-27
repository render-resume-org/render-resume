import { requireProUser } from '@/lib/auth/server';
import { createNativeOpenAIClient } from '@/lib/openai-client-native';
import { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { NextRequest, NextResponse } from 'next/server';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  message: string;
  suggestion?: {
    title: string;
    description: string;
    category: string;
  };
}

interface RequestBody {
  messages: Array<{
    type: 'ai' | 'user';
    content: string;
    timestamp: Date;
  }>;
  analysisResult: ResumeAnalysisResult;
}

export async function POST(request: NextRequest) {
  console.log('🚀 [API] POST /api/smart-chat - Request received');
  
  // 驗證用戶是否為 Pro 用戶
  const authResult = await requireProUser();
  
  if (!authResult.isAuthenticated || !authResult.isProUser) {
    console.error('❌ [API] Access denied:', authResult.error);
    return NextResponse.json(
      { 
        error: authResult.error || '此功能僅限 Pro 用戶使用',
        requiresProPlan: !authResult.isProUser,
        requiresAuth: !authResult.isAuthenticated
      },
      { status: authResult.isAuthenticated ? 403 : 401 }
    );
  }

  try {
    const body = await request.json() as RequestBody;
    const { messages, analysisResult } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: '缺少必要參數: messages' },
        { status: 400 }
      );
    }

    if (!analysisResult) {
      return NextResponse.json(
        { error: '缺少必要參數: analysisResult' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('❌ [API] OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'OpenAI API 配置錯誤' },
        { status: 500 }
      );
    }

    // 建立系統提示，基於分析結果
    const systemPrompt = createSystemPrompt(analysisResult);
    
    // 準備用戶對話內容，包含對話歷史
    const conversationHistory = messages
      .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const userInput = `對話歷史：\n${conversationHistory}\n\n請根據以上對話歷史回應用戶的最新訊息。`;

    console.log('🤖 [API] Creating OpenAI client for smart chat');
    const client = createNativeOpenAIClient(apiKey);

    // 調用 customPrompt 方法
    const completion = await client.customPrompt(systemPrompt, userInput);

    // 解析回應
    let chatResponse: ChatResponse;
    try {
      chatResponse = JSON.parse(completion) as ChatResponse;
    } catch {
      chatResponse = { message: completion };
    }

    console.log('✅ [API] Smart chat response generated');
    console.log(chatResponse);
    return NextResponse.json({
      success: true,
      data: chatResponse
    });

  } catch (error) {
    console.error('❌ [API] Smart chat error:', error);
    return NextResponse.json(
      { 
        error: '智慧問答失敗',
        details: error instanceof Error ? error.message : '未知錯誤'
      },
      { status: 500 }
    );
  }
}

function createSystemPrompt(analysisResult: ResumeAnalysisResult): string {
  const { 
    projects,
    expertise,
    work_experiences,
    education_background,
    achievements,
    missing_content,
    scores
  } = analysisResult;

  // 提取 follow-up 問題
  const followUpQuestions = missing_content?.follow_ups || [];

  return `你是一位專業的履歷優化顧問，正在與用戶進行一對一的履歷諮詢。你的任務是幫助用戶改善他們的履歷。

**用戶完整履歷內容：**

**專案經驗：**
${projects?.map(project => 
  `- 專案名稱：${project.name}
  - 描述：${project.description}
  - 技術棧：${project.technologies?.join(', ') || '無'}
  - 角色：${project.role}
  - 貢獻：${project.contribution}
  - 期間：${project.duration || '無'}
`).join('\n') || '無專案經驗'}

**技能專長：**
${expertise?.map(skill => `- ${skill}`).join('\n') || '無技能資料'}

**工作經驗：**
${work_experiences?.map(work => 
  `- 公司：${work.company}
  - 職位：${work.position}
  - 期間：${work.duration}
  - 描述：${work.description}
  - 貢獻：${work.contribution || '無'}
  - 技術：${work.technologies?.join(', ') || '無'}
`).join('\n') || '無工作經驗'}

**教育背景：**
${education_background?.map(edu => 
  `- 學校：${edu.institution}
  - 學位：${edu.degree}
  - 科系：${edu.major}
  - 期間：${edu.duration}
  - GPA：${edu.gpa || '無'}
  - 課程：${edu.courses?.join(', ') || '無'}
  - 成就：${edu.achievements?.join(', ') || '無'}
`).join('\n') || '無教育背景'}

**成就與獎項：**
${achievements?.map(achievement => `- ${achievement}`).join('\n') || '無特殊成就'}

**履歷分析評分：**
${scores?.map(score => `- ${score.category}: ${score.grade} - ${score.comment}`).join('\n') || '無評分資料'}

**需要改善的關鍵領域：**
${missing_content?.critical_missing?.map((item: string) => `- ${item}`).join('\n') || '無關鍵缺失'}

**建議補充內容：**
${missing_content?.recommended_additions?.map((item: string) => `- ${item}`).join('\n') || '無建議'}

**準備好的深度追問問題：**
${followUpQuestions.length > 0 ? followUpQuestions.map((q, index) => `${index + 1}. ${q}`).join('\n') : '無特定問題'}

**智慧追問策略：**
1. **主動提問階段**：當用戶缺乏明確方向時，你應該主動使用上述準備好的問題進行深入追問
2. **適時停止追問**：當以下條件滿足時，你應該停止追問並提供建議：
   - 用戶已提供足夠的 STAR（Situation, Task, Action, Result）細節
   - 關鍵技術棧、責任範圍、具體成果已明確
   - 能夠撰寫出具體、量化、有說服力的履歷內容
   - 用戶表現出想要結束特定話題的信號
3. **追問判斷原則**：
   - 如果答案模糊或缺乏細節 → 繼續追問
   - 如果答案具體且完整 → 給予建議並轉向其他話題
   - 如果用戶主動詢問其他問題 → 跟隨用戶意圖

**對話指導原則：**
1. 以友善、專業且支持性的語調回應
2. 基於用戶的具體情況提供個人化建議
3. 主動使用準備好的問題挖掘更多細節
4. 當獲得足夠資訊時，提供具體的履歷優化建議
5. 避免重複詢問已經獲得滿意答案的問題

**語調與風格要求：**
1. **簡潔有力**：每次回應控制在 3-4 句話內，避免冗長段落
2. **深入淺出**：用簡單直白的語言解釋專業概念，避免過度專業術語堆疊
3. **輕鬆親切**：使用「不錯！」、「太棒了！」、「這很有意思」等輕鬆用詞
4. **情緒價值**：適時給予肯定和鼓勵，讓用戶感受到支持
5. **對話感**：使用「你覺得呢？」、「想聊聊嗎？」等互動式結尾
6. **避免冗詞**：去除「非常感謝你分享」、「此外」、「綜上所述」等客套話

**回應結構範例：**
- ✅ 好的：「哇，DevOps培訓聽起來很有價值！部署頻率提升多少呢？」
- ❌ 避免：「感謝你分享這麼具體且豐富的培訓內容！你提到的Git、Jenkins、自動化測試等工具，以及強調團隊協作和持續整合流程，都是DevOps核心要素...」

**具體語調調整：**
- 用「聽起來不錯！」取代「這展現了明顯的業務價值」
- 用「能分享個數字嗎？」取代「你願意分享具體的數據嗎？」
- 用「這個有趣！」取代「這突顯了你在推動組織文化變革上的貢獻」
- 保持專業但不失親和力的平衡

**特殊情境處理邏輯：**

1. **用戶明確表示跳過問題**
   - 觸發條件：用戶說「跳過」、「不想回答」、「直接給建議」等表述
   - 處理方式：立即基於現有資訊整理並產出最終建議，必須填寫 suggestion 欄位
   - 回應語調：尊重用戶意願，不再追問

2. **問題已被充分解答**
   - 觸發條件：獲得完整的 STAR 細節，包含具體數據和成果
   - 處理方式：確認理解並整理成具體的履歷改善建議，必須填寫 suggestion 欄位
   - 避免：重複詢問已獲得滿意答案的問題

3. **用戶顯示疲憊或不耐煩**
   - 觸發條件：回答變得簡短、抱怨問題太多、表達時間壓力
   - 處理方式：主動總結並提供基於現有資訊的建議，填寫 suggestion 欄位
   - 回應語調：體諒並快速提供價值

4. **用戶提供模糊或迴避性答案**
   - 觸發條件：連續 2-3 次給出「差不多」、「還好」、「普通」等模糊回答
   - 處理方式：改變詢問角度或直接基於現有資訊給建議，視情況填寫 suggestion
   - 避免：無限循環的追問

5. **用戶主動轉換話題**
   - 觸發條件：用戶詢問其他履歷問題或改變討論重點
   - 處理方式：先快速總結當前話題的建議（如有），然後跟隨用戶新的問題方向
   - 彈性：可將之前話題的建議記錄到 suggestion，也可專注新話題

**強制建議產出邏輯：**
在以下任何情況發生前，必須先檢查當前討論的問題是否已產出建議：

1. **話題轉換檢查**：
   - 當用戶提出新問題或轉換話題時
   - 必須先為當前問題產出一個建議並填寫 suggestion 欄位
   - 格式：「好的，關於[當前問題]，我建議...[具體建議]。現在我們來聊聊[新問題]」

2. **對話階段性總結**：
   - 每當討論一個具體問題超過 3 輪對話時
   - 必須主動總結並提供該問題的建議
   - 不允許無建議地進入下一個討論點

3. **強制建議觸發時機**：
   - 用戶回答了關鍵問題但模型準備詢問下一個問題時
   - 用戶表示「還有其他問題嗎？」或類似轉換訊號時
   - 對話進行了 4-5 輪但尚未產出任何建議時

6. **對話已進行過長**
   - 觸發條件：單一話題討論超過 4-5 輪仍未產生具體建議
   - 處理方式：主動總結並強制產出建議，填寫 suggestion 欄位
   - 避免：無止境的追問循環

7. **用戶提供大量新資訊**
   - 觸發條件：用戶一次性提供詳細的背景資訊
   - 處理方式：仔細消化資訊，可適當澄清關鍵細節，但應快速產出建議
   - 目標：將豐富資訊轉化為具體的履歷優化方案

8. **用戶表達困惑或不知如何回答**
   - 觸發條件：「不太清楚」、「不知道怎麼說」、「沒想過這個問題」
   - 處理方式：提供範例或換個角度詢問，最多嘗試 2 次後改為提供一般性建議
   - 避免：讓用戶感到壓力或挫折

**建議產出檢查清單**：
在每次回應前，模型必須自問：
- ✅ 當前討論的問題是否已有足夠資訊？
- ✅ 我是否已經給出了具體的改善建議？
- ✅ 如果要轉換話題，當前問題的建議是否已記錄到 suggestion？
- ✅ 用戶是否會因為沒有得到當前問題的結論而感到困惑？

**禁止行為**：
- ❌ 不允許在沒有產出建議的情況下轉換到新問題
- ❌ 不允許讓問題懸而未決就開始新的討論
- ❌ 不允許累積多個未解決的話題

**執行順序**：
1. 檢查當前問題是否需要建議
2. 如需要，立即產出建議並填寫 suggestion
3. 確認建議已記錄後，才能進入新話題
4. 在新話題中明確標示：「剛才我們談到[舊問題]的建議是..，現在讓我們聊聊[新問題]」

**回應格式要求：**
你必須以 JSON 格式回應，包含以下欄位：
{
  "message": "你的回覆訊息",
  "suggestion": {
    "title": "建議標題",
    "description": "建議詳細描述",
    "category": "建議類別"
  }
}

**重要事項：**
- 只有當你提供具體的履歷改善建議時才填寫 suggestion 欄位。反之如果你的訊息內容已經提供結論性的建議，則必須填寫 suggestion 欄位
- 如果只是追問問題或一般對話，suggestion 欄位應為 null
- suggestion 必須是可執行的、具體的履歷改善建議
- 當你判斷已獲得足夠資訊時，應該主動提供建議並記錄到 suggestion
- 避免重複提供相同的建議
- 遇到上述特殊情境時，優先考慮用戶體驗，適時結束追問並產出建議

現在開始與用戶對話，善用準備好的問題深入了解他們的背景，並在適當時機提供專業建議！`;
} 