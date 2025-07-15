import { requireProUser } from '@/lib/auth/server';
import { createNativeOpenAIClient } from '@/lib/openai-client-native';
import { generateSmartChatSystemPrompt } from '@/lib/prompts';
import { calculateCosineSimilarity, calculateStringSimilarity, getTextVector } from '@/lib/similarity';
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
  quickResponses: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string;
  };
}

interface Template {
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
  messages: Array<{
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
  }>;
  analysisResult: ResumeAnalysisResult;
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  templates: Template[];
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
  shouldBlockNextSuggestion: boolean;
  templates: Template[];
}

// 新增 ID 生成函數
function generateUniqueId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 相似度閾值（與前端一致）
const SIMILARITY_THRESHOLDS = {
  templateMatch: 0.08
};

// 新增訊息處理邏輯
function processAIMessages(
  rawResponse: ChatResponse, 
  lastAiMessage: LastMessage | undefined,
  messages: Array<{ type: 'ai' | 'user'; content: string; timestamp: Date; suggestion?: { title: string; description: string; category: string }; excerpt?: { title: string; content: string; source: string } }>,
  templates: Template[]
): ProcessedChatResponse {
  const { message, suggestion, quickResponses, excerpt } = rawResponse;

  // 檢查上一則 AI message 是否有 suggestion，決定是否阻擋本次 suggestion
  let aiSuggestion = suggestion;
  if (lastAiMessage && lastAiMessage.suggestion) {
    aiSuggestion = undefined;
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
  let aiExcerpt = excerpt;
  if (hasExcerptInCurrentTopic) {
    aiExcerpt = undefined;
  }
  const excerptId = aiExcerpt ? generateUniqueId('excerpt') : undefined;

  // 處理 <NEXT_TOPIC> 分割訊息
  const processedMessages: ProcessedMessage[] = [];
  const messageToProcess = message;
  if (aiSuggestion) {
    if (typeof messageToProcess === 'string' && messageToProcess.includes('<NEXT_TOPIC>')) {
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
    } else {
      // 檢查是否有關鍵字
      const topicKeywords = ['接著', '接下來', '下一題'];
      let splitIdx = -1;
      for (const keyword of topicKeywords) {
        const idx = messageToProcess.indexOf(keyword);
        if (idx !== -1 && (splitIdx === -1 || idx < splitIdx)) {
          splitIdx = idx;
        }
      }
      if (splitIdx !== -1) {
        // 有關鍵字，直接切割
        const before = messageToProcess.slice(0, splitIdx);
        const after = messageToProcess.slice(splitIdx);
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
      } else {
        // 沒有 <NEXT_TOPIC> 也沒有關鍵字，直接原樣
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
    }
  } else {
    // 沒有 suggestion 的情況
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

  // 更新 shouldBlockNextSuggestion 狀態
  const newShouldBlockNextSuggestion = !!aiSuggestion;

  // --- 模板狀態自動更新邏輯（只更新最相似且超過門檻的） ---
  let updatedTemplates = [...templates];
  // excerpt 觸發 in_progress
  if (aiExcerpt) {
    const excerptText = `${aiExcerpt.title} ${aiExcerpt.content}`;
    const excerptVec = getTextVector(excerptText);
    let maxSim = 0;
    let maxIdx = -1;
    templates.forEach((t, idx) => {
      const templateText = `${t.title} ${t.description}`;
      const templateVec = getTextVector(templateText);
      const sim = calculateCosineSimilarity(excerptVec, templateVec);
      if (t.status === 'pending' && sim > maxSim) {
        maxSim = sim;
        maxIdx = idx;
      }
    });
    if (maxSim >= SIMILARITY_THRESHOLDS.templateMatch && maxIdx !== -1) {
      updatedTemplates = updatedTemplates.map((t, idx) =>
        idx === maxIdx ? { ...t, status: 'in_progress' } : t
      );
    }
  }
  // suggestion 觸發 completed
  if (aiSuggestion) {
    const suggestionText = `${aiSuggestion.title} ${aiSuggestion.description}`;
    const suggestionVec = getTextVector(suggestionText);
    let maxSim = 0;
    let maxIdx = -1;
    templates.forEach((t, idx) => {
      const templateText = `${t.title} ${t.description}`;
      const templateVec = getTextVector(templateText);
      const sim = calculateCosineSimilarity(suggestionVec, templateVec);
      if ((t.status === 'in_progress' || t.status === 'pending') && sim > maxSim) {
        maxSim = sim;
        maxIdx = idx;
      }
    });
    if (maxSim >= SIMILARITY_THRESHOLDS.templateMatch && maxIdx !== -1) {
      updatedTemplates = updatedTemplates.map((t, idx) =>
        idx === maxIdx ? { ...t, status: 'completed', completedSuggestion: aiSuggestion } : t
      );
    }
  }

  return {
    messages: processedMessages,
    cannedOptions,
    shouldBlockNextSuggestion: newShouldBlockNextSuggestion,
    templates: updatedTemplates
  };
}

const FOLLOW_UP_SIMILARITY_THRESHOLD = 0.2;

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
    const { messages, analysisResult, suggestions, templates } = body;

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

    // 將前端傳遞的建議轉換為字符串數組，用於重複檢查
    const existingSuggestions = suggestions?.map(s => `${s.title}: ${s.description}`) || [];
    
    // 取得最後一則訊息內容用於 prompt 注入
    const lastUserMessage = messages.filter(m => m.type === 'user').pop();
    const userPrompt = lastUserMessage?.content || '';
    
    // 如果需要阻擋下個 suggestion，在 user prompt 注入提示
    // if (shouldBlockNextSuggestion) { // This line is removed
    //   userPrompt += '\n\n[系統提示：請勿再產生 suggestion，僅進行對話或追問，不要再給建議。]';
    // }
    
    // 建立系統提示，基於分析結果和已有建議
    const systemPrompt = generateSmartChatSystemPrompt(analysisResult, existingSuggestions);
    
    // 準備用戶對話內容，包含對話歷史
    const conversationHistory = messages
      .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    // 使用處理過的 userPrompt 而非原始對話歷史
    const finalUserInput = `對話歷史：\n${conversationHistory}\n\n最新訊息：${userPrompt}\n\n請根據以上對話歷史回應用戶的最新訊息。`;

    console.log('🤖 [API] Creating OpenAI client for smart chat');
    const client = createNativeOpenAIClient(apiKey, {
      modelName: 'gpt-4.1-mini',
    });

    // 調用 customPrompt 方法
    const completion = await client.customPrompt(systemPrompt, finalUserInput);

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

    // 取得 user 最新一則訊息
    const userMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
    const userText = userMessage && userMessage.type === 'user' ? userMessage.content : '';
    // 取得 follow up 問題
    const followUps = analysisResult.missing_content?.follow_ups || [];
    // 比對 user 問題與 follow up
    let matchedFollowUp = null;
    let maxScore = 0;
    for (const follow of followUps) {
      const scoreTitle = calculateStringSimilarity(userText, follow.title || '');
      const scoreQuestion = calculateStringSimilarity(userText, follow.question || '');
      if (scoreTitle > maxScore && scoreTitle > FOLLOW_UP_SIMILARITY_THRESHOLD) {
        matchedFollowUp = follow;
        maxScore = scoreTitle;
      }
      if (scoreQuestion > maxScore && scoreQuestion > FOLLOW_UP_SIMILARITY_THRESHOLD) {
        matchedFollowUp = follow;
        maxScore = scoreQuestion;
      }
    }

    // 取得 AI 回應 message
    const aiMessageText = chatResponse.message || '';
    // 如果 AI 沒有產生 excerpt，但 user 問題或 AI 回應與 follow up 高相似，則自動產生 follow up excerpt
    let shouldInjectFollowUpExcerpt = false;
    if (!chatResponse.excerpt && matchedFollowUp) {
      shouldInjectFollowUpExcerpt = true;
    } else if (!chatResponse.excerpt && followUps.length > 0) {
      // 檢查 AI 回應與 follow up 相似度
      let aiMatchedFollowUp = null;
      let aiMaxScore = 0;
      for (const follow of followUps) {
        const scoreTitle = calculateStringSimilarity(aiMessageText, follow.title || '');
        const scoreQuestion = calculateStringSimilarity(aiMessageText, follow.question || '');
        if (scoreTitle > aiMaxScore && scoreTitle > FOLLOW_UP_SIMILARITY_THRESHOLD) {
          aiMatchedFollowUp = follow;
          aiMaxScore = scoreTitle;
        }
        if (scoreQuestion > aiMaxScore && scoreQuestion > FOLLOW_UP_SIMILARITY_THRESHOLD) {
          aiMatchedFollowUp = follow;
          aiMaxScore = scoreQuestion;
        }
      }
      if (aiMatchedFollowUp) {
        matchedFollowUp = aiMatchedFollowUp;
        shouldInjectFollowUpExcerpt = true;
      }
    }
    if (shouldInjectFollowUpExcerpt && matchedFollowUp) {
      chatResponse.excerpt = {
        title: matchedFollowUp.title,
        content: matchedFollowUp.question,
        source: '追問問題',
      };
    }
    
    // 取得上一則 AI message
    const lastAiMessage = messages.filter(m => m.type === 'ai').pop();
    
    // 處理訊息邏輯
    const processedResponse = processAIMessages(chatResponse, lastAiMessage, messages, templates);

    console.log('✅ [API] Smart chat response generated and processed');
    return NextResponse.json({
      success: true,
      data: processedResponse
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