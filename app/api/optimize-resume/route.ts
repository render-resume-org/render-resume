import { createNativeOpenAIClient } from '@/lib/openai-client-native';
import type { OptimizationSuggestion, OptimizedResume } from '@/lib/types/resume';
import type { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { NextRequest, NextResponse } from 'next/server';

interface OptimizeRequest {
  analysisResult: ResumeAnalysisResult;
  selectedSuggestions: OptimizationSuggestion[];
  targetRole?: string;
  targetCompany?: string;
}

function generateOptimizationPrompt(analysisResult: ResumeAnalysisResult, suggestions: OptimizationSuggestion[]): string {
  return `你是一位資深的履歷優化專家，擁有超過15年的人力資源和職涯諮詢經驗。你需要根據AI分析結果和用戶選擇的優化建議，生成一份完整且專業的履歷。

### 原始履歷分析結果：

**個人基本資訊：**
${analysisResult.profile ? `
- 姓名：${analysisResult.profile.name || '未提供'}
- 個人簡介：${analysisResult.profile.brief_introduction || '未提供'}
- 電子郵件：${analysisResult.profile.email || '未提供'}
- 電話：${analysisResult.profile.phone || '未提供'}
- 所在地：${analysisResult.profile.location || '未提供'}
- LinkedIn：${analysisResult.profile.linkedin || '未提供'}
- GitHub：${analysisResult.profile.github || '未提供'}
- 個人網站：${analysisResult.profile.website || '未提供'}
- 作品集：${analysisResult.profile.portfolio || '未提供'}
` : '從履歷內容中提取（詳見下方各項目經驗）'}

**技術專長：**
${analysisResult.expertise?.join(', ') || '未識別到技術專長'}

**工作經驗：**
${analysisResult.work_experiences?.map(exp => `
- 職位：${exp.position}
- 公司：${exp.company}
- 期間：${exp.duration}
- 職責與成就：${exp.description || exp.contribution || '未詳述'}
- 使用技術：${exp.technologies?.join(', ') || '未註明'}
`).join('\n') || '無工作經驗記錄'}

**專案經驗：**
${analysisResult.projects?.map(proj => `
- 專案名稱：${proj.name}
- 描述：${proj.description}
- 技術棧：${proj.technologies?.join(', ') || '未註明'}
- 成果：${proj.contribution || '未詳述'}
`).join('\n') || '無專案經驗記錄'}

**教育背景：**
${analysisResult.education_background?.map(edu => `
- 學位：${edu.degree}
- 主修：${edu.major}
- 學校：${edu.institution}
- 期間：${edu.duration}
- 詳細資訊：${edu.gpa ? `GPA: ${edu.gpa}` : '無'}
`).join('\n') || '無教育背景記錄'}

**其他成就：**
${analysisResult.achievements?.join('; ') || '無特別成就記錄'}

### 用戶選擇的優化建議：
${suggestions.map((suggestion, index) => `
${index + 1}. **${suggestion.title}** (${suggestion.category})
   描述：${suggestion.description}
   優先級：${suggestion.priority}
`).join('\n')}

### 優化要求：
1. **個人資訊優先使用**：如果分析結果中包含個人基本資訊（profile），請優先使用這些資訊填充 personalInfo 欄位
2. **內容完整性**：確保所有重要資訊都被保留並適當優化
3. **建議整合**：將用戶選擇的建議自然地融入到履歷各個部分
4. **專業表達**：使用專業且有說服力的語言
5. **量化成果**：盡可能將成就量化，增加可信度
6. **結構清晰**：確保履歷結構邏輯清晰，易於閱讀
7. **關鍵字優化**：適當加入行業關鍵字，提高ATS通過率

### 格式要求：
- 個人資料：優先使用 profile 中的資訊，確保聯絡方式完整
- 個人摘要：2-3句話概括核心價值主張
- 技能分類：按前端、後端、工具等分類整理
- 工作經驗：使用動作詞開頭，突出成就
- 專案經驗：包含具體技術實現和業務影響
- 教育背景：簡潔明確，突出相關課程或成績

### 特別注意：
- **嚴格禁止生成假資料**：只能使用分析結果中實際存在的資料，絕對不能憑空創造任何假資料
- **個人資訊處理**：如果 profile 中有完整的個人資訊，直接使用；如果缺失某些欄位，請留空或使用實際存在的資料
- **教育背景處理**：education_background 中的 institution 對應到 school，degree 和 major 都要保留，duration 對應到 period
- 確保所有時間表述一致（如：2021年6月 - 2023年12月）
- 避免使用過於誇張的形容詞
- 確保技術棧與實際專案經驗相符
- 如果 profile 中有 LinkedIn、GitHub 等專業平台連結，務必保留在履歷中
- projects 欄位請勿包含 description，duration 欄位請改為 period

### 請生成一份完整的JSON格式履歷，包含以下結構：
{
  "personalInfo": { 
    "fullName": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "skills": [{ "category": "", "items": [] }],
  "experience": [{ "title": "", "company": "", "period": "", "achievements": [] }],
  "projects": [{ "name": "", "period": "", "achievements": [] }],
  "education": [{ "degree": "", "major": "", "school": "", "period": "", "details": [] }]
}

**重要提醒**：如果某個 section 沒有實際資料，請將該欄位設為空字串（string）或空陣列（array），不要生成任何假資料。

請直接返回有效的JSON，不要包含任何其他文字或格式。`;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [Resume Optimize API] Starting resume optimization');
    
    const body: OptimizeRequest = await request.json();
    const { analysisResult, selectedSuggestions, targetRole, targetCompany } = body;

    console.log('📋 [Resume Optimize API] Request data:', {
      hasAnalysisResult: !!analysisResult,
      suggestionsCount: selectedSuggestions?.length || 0,
      targetRole,
      targetCompany
    });

    if (!analysisResult) {
      console.error('❌ [Resume Optimize API] Missing analysis result');
      return NextResponse.json(
        { success: false, error: '缺少履歷分析結果' },
        { status: 400 }
      );
    }

    if (!selectedSuggestions || selectedSuggestions.length === 0) {
      console.error('❌ [Resume Optimize API] No suggestions selected');
      return NextResponse.json(
        { success: false, error: '請至少選擇一個優化建議' },
        { status: 400 }
      );
    }

    // 創建 OpenAI 客戶端
    const openaiClient = createNativeOpenAIClient();
    
    // 生成用戶輸入
    const userPrompt = targetRole 
      ? `請針對「${targetRole}」職位${targetCompany ? `（目標公司：${targetCompany}）` : ''}優化這份履歷。`
      : '請根據分析結果和選擇的建議優化這份履歷。';
    
    // 生成系統提示
    const systemPrompt = generateOptimizationPrompt(analysisResult, selectedSuggestions);
    
    console.log('🤖 [Resume Optimize API] Calling OpenAI API via native client');
    const content = await openaiClient.customPrompt(systemPrompt, userPrompt);
    
    if (!content) {
      console.error('❌ [Resume Optimize API] Empty response from OpenAI');
      return NextResponse.json(
        { success: false, error: 'AI 生成失敗，請重試' },
        { status: 500 }
      );
    }

    console.log('📝 [Resume Optimize API] Raw AI response length:', content.length);

    try {
      // 清理可能的格式問題
      let cleanedContent = content.trim();
      
      // 移除可能的 markdown 代碼塊標記
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.slice(7);
      }
      if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.slice(3);
      }
      if (cleanedContent.endsWith('```')) {
        cleanedContent = cleanedContent.slice(0, -3);
      }
      
      cleanedContent = cleanedContent.trim();
      
      // 解析 JSON
      const optimizedResume: OptimizedResume = JSON.parse(cleanedContent);
      
      console.log('✅ [Resume Optimize API] Successfully generated optimized resume');
      
      return NextResponse.json({
        success: true,
        data: {
          optimizedResume,
          originalAnalysis: analysisResult,
          appliedSuggestions: selectedSuggestions,
          metadata: {
            generatedAt: new Date().toISOString(),
            targetRole,
            targetCompany,
            suggestionsApplied: selectedSuggestions.length
          }
        }
      });

    } catch (parseError) {
      console.error('❌ [Resume Optimize API] JSON parse error:', parseError);
      console.log('📝 [Resume Optimize API] Raw content:', content);
      
      return NextResponse.json(
        { success: false, error: 'AI 回應格式錯誤，請重試' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ [Resume Optimize API] Unexpected error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '履歷優化失敗' 
      },
      { status: 500 }
    );
  }
} 