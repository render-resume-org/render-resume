import { logSmartChatMessage } from '@/lib/actions/activity';
import { requireProUser } from '@/lib/auth/server';
import { createNativeOpenAIClient } from '@/lib/openai-client-native';
import { generateSmartChatSystemPrompt } from '@/lib/prompts';
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
    patchOps?: { op: 'set' | 'insert' | 'remove'; path: string; value?: string; index?: number }[];
  };
  quickResponses: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string;
    issue_id?: string;
  };
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  completedSuggestion?: {
    title: string;
    description: string;
    category: string;
  };
}

interface RequestBody {
  messages: Array<
    | {
        type: 'ai' | 'user';
        content: string;
        timestamp: Date;
        suggestion?: {
          title: string;
          description: string;
          category: string;
        };
        excerpt?: {
          title: string;
          content: string;
          source: string;
        };
      }
    | FileMessage
  >;
  analysisResult: ResumeAnalysisResult;
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  issues?: Issue[]; // 改名：templates -> issues，但保持向後兼容
  templates?: Issue[]; // 向後兼容：前端可能仍使用 templates
  resumeDiff?: string | null; // 新增：本輪前後履歷差異摘要
  currentResume?: unknown; // 新增：目前最新的履歷內容
}

// 新增描述前端傳來訊息結構的介面
interface LastMessage {
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
  };
}

// 新增處理訊息的介面
interface ProcessedMessage {
  id: string;
  type: 'ai';
  content: string;
  timestamp: Date;
  suggestion?: {
    title: string;
    description: string;
    category: string;
  };
  quickResponses: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string;
  };
  excerptId?: string;
}

interface ProcessedChatResponse {
  messages: ProcessedMessage[];
  cannedOptions: string[];
  issues: Issue[]; // 改名：templates -> issues
}

// 新增 ID 生成函數
function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}



// 新增訊息處理邏輯
function processAIMessages(
  rawResponse: ChatResponse, 
  lastAiMessage: LastMessage | undefined,
  messages: Array<{ type: 'ai' | 'user'; content: string; timestamp: Date; suggestion?: { title: string; description: string; category: string }; excerpt?: { title: string; content: string; source: string } }>,
  issues: Issue[] // 改名：templates -> issues
): ProcessedChatResponse {
  const { message, suggestion, quickResponses, excerpt } = rawResponse;

  // 檢查上一則 AI message 是否有 suggestion，決定是否阻擋本次 suggestion
  let aiSuggestion = suggestion;
  let aiExcerpt = excerpt;
  if (lastAiMessage && lastAiMessage.suggestion) {
    // aiSuggestion = undefined;
    // aiExcerpt = undefined;
  }

  // 新增：如果有 in_progress issue，覆蓋 suggestion title
  if (aiSuggestion) {
    const inProgressIssue = issues.find(t => t.status === 'in_progress');
    if (inProgressIssue) {
      aiSuggestion = {
        ...aiSuggestion,
        title: inProgressIssue.title
      };
      console.log('🔄 [Issue][Suggestion] Overriding suggestion title with in_progress issue:', inProgressIssue.title);
    }
  }

  // --- 新增 excerpt 限制邏輯 ---
  // 取得自上一次 suggestion 產生後的所有 AI message
  let lastSuggestionIdx = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].type === 'ai' && messages[i].suggestion) {
      lastSuggestionIdx = i;
      break;
    }
  }
  const aiMessagesSinceLastSuggestion = messages.slice(lastSuggestionIdx + 1).filter(m => m.type === 'ai');
  // 檢查這段期間是否已經有 excerpt
  const hasExcerptInCurrentTopic = aiMessagesSinceLastSuggestion.some(m => m.excerpt);
  // 如果已經有 excerpt，則本次 excerpt 要被阻擋
  
  if (hasExcerptInCurrentTopic) {
    aiExcerpt = undefined;
  }
  const excerptId = aiExcerpt ? generateUniqueId('excerpt') : undefined;

  // 處理 <NEXT_TOPIC> 分割訊息
  const processedMessages: ProcessedMessage[] = [];
  const messageToProcess = message;
  // 只針對 <NEXT_TOPIC> 進行切割
  let didSplit = false;
  if (typeof messageToProcess === 'string') {
    // 只檢查 <NEXT_TOPIC>
    if (messageToProcess.includes('<NEXT_TOPIC>')) {
      const [before, after] = messageToProcess.split('<NEXT_TOPIC>');
      processedMessages.push({
        id: generateUniqueId('ai'),
        type: 'ai',
        content: before.trim(),
        timestamp: new Date(),
        suggestion: aiSuggestion,
        quickResponses,
        excerpt: aiExcerpt,
        excerptId
      });
      processedMessages.push({
        id: generateUniqueId('ai'),
        type: 'ai',
        content: after.trim(),
        timestamp: new Date(),
        suggestion: undefined,
        quickResponses,
        excerpt: undefined,
        excerptId: undefined
      });
      didSplit = true;
    } 
  }
  // 若沒切割，原樣 push
  if (!didSplit) {
    processedMessages.push({
      id: generateUniqueId('ai'),
      type: 'ai',
      content: messageToProcess,
      timestamp: new Date(),
      suggestion: aiSuggestion,
      quickResponses,
      excerpt: aiExcerpt,
      excerptId
    });
  }

  // 處理 canned options
  let cannedOptions: string[];
  if (aiSuggestion) {
    cannedOptions = ['下一題！'];
  } else {
    cannedOptions = quickResponses;
  }

  // --- issue 狀態自動更新邏輯（優先使用 AI 返回的 issue_id） ---
  let updatedIssues = [...issues];
  let movedIssueId: string | null = null;
  
  // excerpt 觸發 in_progress
  if (aiExcerpt) {
    // 僅在 AI 明確提供 issue_id 時更新，並確保全域僅有一個 active（in_progress）
    if (aiExcerpt.issue_id) {
      // 將其他 in_progress 關閉為 pending
      updatedIssues = updatedIssues.map(issue => issue.status === 'in_progress' && issue.id !== aiExcerpt.issue_id
        ? { ...issue, status: 'pending' }
        : issue
      );
      // 設定目標 issue 為 in_progress
      updatedIssues = updatedIssues.map(issue => 
        issue.id === aiExcerpt.issue_id 
          ? { ...issue, status: 'in_progress' }
          : issue
      );
      movedIssueId = aiExcerpt.issue_id;
      console.log(`🎯 [Issue] Activated issue via issue_id -> in_progress: ${aiExcerpt.issue_id}`);
    }
  }
   
  // suggestion 觸發 completed：關閉唯一 active 的 issue
  if (aiSuggestion) {
    const activeIdx = updatedIssues.findIndex(issue => issue.status === 'in_progress');
    if (activeIdx !== -1) {
      const activeId = updatedIssues[activeIdx].id;
      updatedIssues = updatedIssues.map((issue, idx) => idx === activeIdx
        ? { ...issue, status: 'completed', completedSuggestion: aiSuggestion }
        : issue
      );
      // 移到最前
      const moved = updatedIssues[activeIdx];
      updatedIssues = [moved, ...updatedIssues.filter((_, idx) => idx !== activeIdx)];
      movedIssueId = activeId;
      console.log(`✅ [Issue] Completed active issue via suggestion: ${activeId}`);
    }
  }
  
  // 若有狀態變動或新增，確保該 issue 在最前面
  if (movedIssueId) {
    const idx = updatedIssues.findIndex(issue => issue.id === movedIssueId);
    if (idx > 0) {
      const [moved] = updatedIssues.splice(idx, 1);
      updatedIssues = [moved, ...updatedIssues];
    }
  }

  return {
    messages: processedMessages,
    cannedOptions,
    issues: updatedIssues // 改名：templates -> issues
  };
}

// 改進的 AI 回應解析函數
function parseAIResponse(completion: string): ChatResponse {
  // 移除可能的 markdown 代碼塊標記
  let cleanedCompletion = completion.trim();
  
  console.log('🔍 [Parser] Original completion length:', completion.length);
  
  // 處理 ```json 代碼塊
  const jsonBlockMatch = cleanedCompletion.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonBlockMatch) {
    console.log('📦 [Parser] Found JSON code block');
    cleanedCompletion = jsonBlockMatch[1];
  }
  
  // 處理只有 {} 包圍的情況
  const jsonMatch = cleanedCompletion.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    console.log('🎯 [Parser] Extracted JSON object');
    cleanedCompletion = jsonMatch[0];
  }
  
  // 清理可能的多餘空白和換行
  cleanedCompletion = cleanedCompletion.trim();
  
  console.log('🧹 [Parser] Cleaned completion:', cleanedCompletion.substring(0, 100) + '...');
  
  // 嘗試解析 JSON
  try {
    const parsed = JSON.parse(cleanedCompletion) as ChatResponse;
    // validate patchOps if present
    if (parsed.suggestion?.patchOps) {
      console.log('🔍 [Parser] PatchOps before:', parsed.suggestion.patchOps);
      parsed.suggestion.patchOps = parsed.suggestion.patchOps
        .filter(op => op && typeof op.path === 'string' && (op.op === 'set' || op.op === 'insert' || op.op === 'remove'))
        .map(op => {
          if (op.op === 'set') {
            return { op: 'set', path: op.path, value: String(op.value ?? '') } as const;
          }
          if (op.op === 'insert') {
            return { op: 'insert', path: op.path, value: String(op.value ?? ''), index: typeof op.index === 'number' ? op.index : undefined } as const;
          }
          // remove
          return { op: 'remove', path: op.path, index: typeof op.index === 'number' ? op.index : undefined } as const;
        });
      console.log('🔍 [Parser] PatchOps after:', parsed.suggestion.patchOps);
    }
    
    console.log('✅ [Parser] JSON parsing successful');
    
    // 驗證必要欄位
    if (typeof parsed.message !== 'string') {
      throw new Error('Invalid message field');
    }
    
    // 驗證 suggestion 欄位格式（如果存在）
    if (parsed.suggestion !== null && parsed.suggestion !== undefined) {
      if (typeof parsed.suggestion !== 'object' || 
          typeof parsed.suggestion.title !== 'string' ||
          typeof parsed.suggestion.description !== 'string' ||
          typeof parsed.suggestion.category !== 'string') {
        console.warn('⚠️ [Parser] Invalid suggestion field structure');
        throw new Error('Invalid suggestion field');
      }
      console.log('✅ [Parser] Suggestion field validated');
    } else {
      console.log('ℹ️ [Parser] No suggestion field present');
    }
    
    // 驗證 quickResponses 欄位格式
    if (!Array.isArray(parsed.quickResponses)) {
      console.warn('⚠️ [Parser] Missing or invalid quickResponses field, providing default');
      parsed.quickResponses = ['告訴我更多', '下一個問題', '需要具體建議'];
    }
    
    // 驗證 excerpt 欄位格式（如果存在）
    if (parsed.excerpt !== null && parsed.excerpt !== undefined) {
      if (typeof parsed.excerpt !== 'object' || 
          typeof parsed.excerpt.title !== 'string' ||
          typeof parsed.excerpt.content !== 'string' ||
          typeof parsed.excerpt.source !== 'string') {
        console.warn('⚠️ [Parser] Invalid excerpt field structure');
        throw new Error('Invalid excerpt field');
      }
      console.log('✅ [Parser] Excerpt field validated');
    } else {
      console.log('ℹ️ [Parser] No excerpt field present');
    }
    
    return parsed;
  } catch (error) {
    // 如果 JSON 解析失敗，嘗試提取 message 內容
    console.warn('🔄 [Parser] JSON parsing failed, attempting message extraction');
    console.warn('🔄 [Parser] Error details:', error);
    
    // 嘗試從回應中提取 message 內容（處理多行字符串）
    const messageMatch = completion.match(/"message"\s*:\s*"([^"]*(?:\\.[^"]*)*)"/);
    if (messageMatch) {
      const message = messageMatch[1]
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\\\/g, '\\');
      console.log('✅ [Parser] Extracted message from malformed JSON');
      return { 
        message,
        quickResponses: ['告訴我更多', '下一個問題', '需要具體建議']
      };
    }
    
    // 最後的備用方案
    console.error('❌ [Parser] All parsing attempts failed');
    throw new Error(`Failed to parse AI response: ${error}`);
  }
}

// --- 型別擴充：支援 file message ---
interface FileMessage {
  type: 'file';
  content: string;
  timestamp: Date;
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    preview?: string;
    pages?: string[];
    isFromPdf?: boolean;
    originalPdfName?: string;
  };
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
    const { messages, analysisResult, suggestions, issues, templates, resumeDiff, currentResume: currentResumeRaw } = body;
    // 允許前端附帶目前的履歷內容（避免 analysisResult 中舊資料過時）

    // 向後兼容：如果沒有 issues，使用 templates
    const currentIssues = issues || templates || [];

    // --- 新增：分離 file message 與對話訊息 ---
    const chatMessages = messages.filter(m => m.type !== 'file');

    if (!chatMessages || !Array.isArray(chatMessages)) {
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

    // 將前端傳遞的建議轉換為字符串數組，用於重複檢查
    const existingSuggestions = suggestions?.map(s => `${s.title}: ${s.description}`) || [];
    
    
    // 建立系統提示，基於分析結果和已有建議與 issues，並附加本輪履歷差異摘要（若有）
    const systemPrompt = generateSmartChatSystemPrompt(analysisResult, existingSuggestions, currentIssues);
    
    // 準備用戶對話內容，包含對話歷史
    const conversationHistory = messages
    .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    const userPrompt = lastUserMessage?.content || '';
    let finalUserInput = `對話歷史：\n${conversationHistory}`;
    if (messages[messages.length - 1].type === 'user') {
      finalUserInput += `\n\n最新訊息：${userPrompt}`;
    } else { 
      finalUserInput += `\n\n最新訊息：用戶沒有輸入文字，只是上傳了圖片`;
    }
    // 新增：在 user 訊息中附加本輪履歷差異（若存在），並明確說明其含義
    console.log('🔍 [API] Resume diff:', resumeDiff);
    finalUserInput += `\n\n以下為「本輪用戶對履歷的實際修改差異」，以 git 風格 diff 呈現（+ 表示新增、- 表示刪除）。請僅將其作為上下文參考，避免逐字複誦：\n\n`;
    if (resumeDiff && resumeDiff.trim().length > 0) {
      finalUserInput += `\`\`\`diff\n${resumeDiff}\n\`\`\``;
    } else {
      finalUserInput += `本輪用戶沒有對履歷進行實際修改`;
    }

    // 新增：附加「目前最新履歷內容」到 user 提示，以避免只使用 analysisResult 初版內容
    if (currentResumeRaw) {
      try {
        const currentResumeStr = typeof currentResumeRaw === 'string' ? currentResumeRaw : JSON.stringify(currentResumeRaw, null, 2);
        finalUserInput += `\n\n以下為「目前最新的履歷 JSON」供你參考。請以此為準，不要依賴舊版：\n\n\`\`\`json\n${currentResumeStr}\n\`\`\``;
      } catch {
        // 忽略序列化錯誤
      }
    }

    // --- 新增：組合 vision 格式 messages ---
    // 找出最後一則 ai 訊息的 index
    let lastAiIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'ai') {
        lastAiIdx = i;
        break;
      }
    }
    // 取出最後一則 ai 之後的所有訊息（user/file）
    const messagesToSend = messages.slice(lastAiIdx + 1);
    const openAIMessages: { role: 'system' | 'user' | 'assistant'; content: string | Array<{ type: 'text' | 'image_url'; text?: string; image_url?: { url: string; detail?: string } }> }[] = [];
    openAIMessages.push({
      role: 'system',
      content: systemPrompt
    });
    for (const msg of messagesToSend) {
      if (msg.type === 'file' && msg.file?.preview) {
        openAIMessages.push({
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: msg.file.preview }
            }
          ]
        });
      }
    }
    openAIMessages.push({
      role: 'user',
      content: [
        {
          type: 'text',
          text: finalUserInput
        }
      ]
    });

    console.log('🤖 [API] Creating OpenAI client for smart chat (vision)');
    const client = createNativeOpenAIClient(apiKey, {
      modelName: 'gpt-4.1-mini',
    });

    // 調用 customPromptWithFiles 方法
    const completion = await client.customPromptWithFiles(openAIMessages);

    // 解析回應 - 改進的泛化 parser
    let chatResponse: ChatResponse;
    try {
      console.log('🔍 [API] Raw completion:', completion);
      chatResponse = parseAIResponse(completion);
      console.log('🔍 [API] Parsed AI response:', chatResponse);
      console.log('✅ [API] Successfully parsed AI response');
    } catch (parseError) {
      console.warn('⚠️ [API] JSON parsing failed, using fallback:', parseError);
      chatResponse = { 
        message: completion,
        quickResponses: ['告訴我更多', '下一個問題', '需要具體建議']
      };
    }

    // 取得上一則 AI message
    const lastAiMessage = chatMessages.filter(m => m.type === 'ai').pop();
    
    // 處理訊息邏輯
    // 回傳時，只回傳 AI 處理後的訊息，不回傳 user/file message，避免前端重複渲染
    const processedResponse = processAIMessages(chatResponse, lastAiMessage, chatMessages, currentIssues);

    // 後端記錄 smart chat message
    try {
      const messageContent = userPrompt || '圖片上傳';
      const aiResponse = chatResponse.message || completion;
      const detail = `用戶訊息：「${messageContent}」(${messageContent.length} 字元)\nAI 回應：「${aiResponse.substring(0, 100)}${aiResponse.length > 100 ? '...' : ''}」(${aiResponse.length} 字元)`;
      await logSmartChatMessage(messageContent.length, detail);
    } catch (e) {
      console.error('Error logging smart chat message:', e);
    }

    console.log('✅ [API] Smart chat response generated and processed');
    return NextResponse.json({
      success: true,
      data: {
        ...processedResponse,
        messages: processedResponse.messages,
        // 向後兼容：同時返回 issues 和 templates
        issues: processedResponse.issues,
        templates: processedResponse.issues // 前端仍使用 templates
      }
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