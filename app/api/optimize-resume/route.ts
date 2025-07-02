import { createNativeOpenAIClient } from '@/lib/openai-client-native';
import type { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { NextRequest, NextResponse } from 'next/server';

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  timestamp: string;
}

interface OptimizeRequest {
  analysisResult: ResumeAnalysisResult;
  selectedSuggestions: OptimizationSuggestion[];
  targetRole?: string;
  targetCompany?: string;
}

interface OptimizedResume {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
    duration?: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    period: string;
    details?: string[];
  }>;
  achievements?: Array<{
    title: string;
    description: string;
    date?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
  }>;
}

function generateOptimizationPrompt(analysisResult: ResumeAnalysisResult, suggestions: OptimizationSuggestion[]): string {
  return `你是一位資深的履歷優化專家，擁有超過15年的人力資源和職涯諮詢經驗。你需要根據AI分析結果和用戶選擇的優化建議，生成一份完整且專業的履歷。

### 原始履歷分析結果：
**個人基本資訊：**
- 從履歷內容中提取（詳見下方各項目經驗）

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
1. **內容完整性**：確保所有重要資訊都被保留並適當優化
2. **建議整合**：將用戶選擇的建議自然地融入到履歷各個部分
3. **專業表達**：使用專業且有說服力的語言
4. **量化成果**：盡可能將成就量化，增加可信度
5. **結構清晰**：確保履歷結構邏輯清晰，易於閱讀
6. **關鍵字優化**：適當加入行業關鍵字，提高ATS通過率

### 格式要求：
- 個人摘要：2-3句話概括核心價值主張
- 技能分類：按前端、後端、工具等分類整理
- 工作經驗：使用動作詞開頭，突出成就
- 專案經驗：包含具體技術實現和業務影響
- 教育背景：簡潔明確，突出相關課程或成績

### 特別注意：
- 如果原始資訊不完整，請基於常理和行業標準進行合理補充
- 確保所有時間表述一致（如：2021年6月 - 2023年12月）
- 避免使用過於誇張的形容詞
- 確保技術棧與實際專案經驗相符

請生成一份完整的JSON格式履歷，包含以下結構：
{
  "personalInfo": { "fullName": "", "title": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "" },
  "summary": "",
  "skills": [{ "category": "", "items": [] }],
  "experience": [{ "title": "", "company": "", "period": "", "achievements": [] }],
  "projects": [{ "name": "", "description": "", "technologies": [], "achievements": [], "duration": "" }],
  "education": [{ "degree": "", "school": "", "period": "", "details": [] }],
  "achievements": [{ "title": "", "description": "", "date": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "", "expiryDate": "" }]
}

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