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
  };
  quickResponses: string[];
  excerpt?: {
    title: string;
    content: string;
    source: string;
  };
}

interface RequestBody {
  messages: Array<{
    type: 'ai' | 'user';
    content: string;
    timestamp: Date;
  }>;
  analysisResult: ResumeAnalysisResult;
  suggestions: Array<{
    title: string;
    description: string;
    category: string;
  }>;
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
    const { messages, analysisResult, suggestions } = body;

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
    
    // 建立系統提示，基於分析結果和已有建議
    const systemPrompt = generateSmartChatSystemPrompt(analysisResult, existingSuggestions);
    
    // 準備用戶對話內容，包含對話歷史
    const conversationHistory = messages
      .map(msg => `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const userInput = `對話歷史：\n${conversationHistory}\n\n請根據以上對話歷史回應用戶的最新訊息。`;

    console.log('🤖 [API] Creating OpenAI client for smart chat');
    const client = createNativeOpenAIClient(apiKey);

    // 調用 customPrompt 方法
    const completion = await client.customPrompt(systemPrompt, userInput);

    // 解析回應 - 改進的泛化 parser
    let chatResponse: ChatResponse;
    try {
      console.log('🔍 [API] Raw completion:', completion.substring(0, 200) + '...');
      chatResponse = parseAIResponse(completion);
      console.log('✅ [API] Successfully parsed AI response');
    } catch (parseError) {
      console.warn('⚠️ [API] JSON parsing failed, using fallback:', parseError);
      chatResponse = { 
        message: completion,
        quickResponses: ['告訴我更多', '下一個問題', '需要具體建議']
      };
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