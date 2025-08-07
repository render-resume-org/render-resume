import { NextRequest, NextResponse } from 'next/server';
import { requireProUser } from '@/lib/auth/server';
import { checkUsageLimit } from '@/lib/utils/usage-check';
import { createNativeOpenAIClient, processTextFile, SUPPORTED_FILE_TYPES } from '@/lib/openai-client-native';
import { logResumeBuild, logResumeOptimize } from '@/lib/actions/activity';
import { UnifiedResumeAnalysisSchema, UnifiedResumeAnalysisResult, UnifiedResume } from '@/lib/types/resume-unified';
import { generateExtractResumeUserPrompt } from '@/lib/prompts/analyze-extract-prompt';
import { generateEvaluateResumeUserPrompt } from '@/lib/prompts/analyze-evaluate-prompt';
import type { Education, Experience, Links, PersonalInfo, Project } from '@/lib/upload-utils';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
interface OpenAIChatCompletionChoice { index: number; message: { role: string; content: string }; finish_reason: string; }
interface OpenAIChatCompletionResponse { id: string; object: string; created: number; model: string; choices: OpenAIChatCompletionChoice[]; usage?: unknown; system_fingerprint?: string; }

async function callOpenAIJson<T>(client: ReturnType<typeof createNativeOpenAIClient>, system: string, user: string): Promise<T> {
  const req = {
    model: (client as unknown as { config?: { modelName?: string } }).config?.modelName || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system } as OpenAIMessage,
      { role: 'user', content: user } as OpenAIMessage
    ],
    temperature: (client as unknown as { config?: { temperature?: number } }).config?.temperature ?? 0.2,
    response_format: { type: 'json_object' as const }
  };
  const response = await (client as unknown as { callOpenAI: (r: typeof req) => Promise<OpenAIChatCompletionResponse> }).callOpenAI(req);
  const content = response?.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('OpenAI 回傳內容為空');
  return JSON.parse(content) as T;
}

function getSystemPrompt(): string {
  return `你是一位專業的履歷分析專家，請嚴格依指示輸出有效 JSON，嚴禁幻覺與補造資料。`;
}

function buildFormDataText(
  additionalText?: string,
  education?: Education[],
  experience?: Experience[],
  projects?: Project[],
  skills?: string,
  personalInfo?: PersonalInfo | null,
  links?: Links | null
): string {
  let text = '';
  if (additionalText) text += `額外資訊：\n${additionalText}\n\n`;
  if (education && education.length > 0) {
    text += `教育背景資訊：\n${education.map(edu => {
      const duration = edu.isCurrent ? `${edu.startMonth}/${edu.startYear} - 現在` : `${edu.startMonth}/${edu.startYear} - ${edu.endMonth}/${edu.endYear}`;
      return `- ${edu.school} ${edu.degree} ${edu.major} (${duration}) GPA: ${edu.gpa}`;
    }).join('\n')}\n\n`;
  }
  if (experience && experience.length > 0) {
    text += `工作經驗資訊：\n${experience.map(exp => {
      const duration = exp.isCurrent ? `${exp.startMonth}/${exp.startYear} - 現在` : `${exp.startMonth}/${exp.startYear} - ${exp.endMonth}/${exp.endYear}`;
      return `- ${exp.company} ${exp.position} (${exp.location})\n  期間：${duration}\n  描述：${exp.description}`;
    }).join('\n\n')}\n\n`;
  }
  if (projects && projects.length > 0) {
    text += `專案經驗資訊：\n${projects.map(project => {
      const duration = project.isCurrent ? `${project.startMonth}/${project.startYear} - 現在` : `${project.startMonth}/${project.startYear} - ${project.endMonth}/${project.endYear}`;
      return `- ${project.name}\n  期間：${duration}\n  描述：${project.description}`;
    }).join('\n\n')}\n\n`;
  }
  if (skills) text += `技能列表：\n${skills}\n\n`;
  if (personalInfo) text += `個人基本資料：\n地址：${personalInfo.address}\n電話：${personalInfo.phone}\n郵箱：${personalInfo.email}\n\n`;
  if (links) text += `連結：\nLinkedIn：${links.linkedin}\nGitHub：${links.github}\n作品集：${links.portfolio}\n\n`;
  return text;
}

export async function POST(request: NextRequest) {
  // derive service_type from URL
  const pathname = new URL(request.url).pathname;
  const match = pathname.match(/\/api\/analyze\/(create|optimize)/);
  if (!match) return NextResponse.json({ error: 'invalid service_type' }, { status: 400 });
  const serviceType: 'create' | 'optimize' = match[1] as 'create' | 'optimize';

  const authResult = await requireProUser();
  if (!authResult.isAuthenticated || !authResult.isProUser) {
    return NextResponse.json(
      {
        error: authResult.error || '此功能僅限 Pro 用戶使用',
        requiresProPlan: !authResult.isProUser,
        requiresAuth: !authResult.isAuthenticated,
      },
      { status: authResult.isAuthenticated ? 403 : 401 }
    );
  }

  const usageResult = await checkUsageLimit();
  if (!usageResult.success) return usageResult.response!;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API 配置錯誤' }, { status: 500 });

  const client = createNativeOpenAIClient(apiKey);

  try {
    const isMultipart = (request.headers.get('content-type') || '').includes('multipart/form-data');

    let rawText = '';
    if (isMultipart) {
      const form = await request.formData();
      const files = form.getAll('files') as File[];
      const additionalText = (form.get('additionalText') as string) || '';
      const educationData = form.get('education') as string;
      const experienceData = form.get('experience') as string;
      const projectsData = form.get('projects') as string;
      const skillsData = form.get('skills') as string;
      const personalInfoData = form.get('personalInfo') as string;
      const linksData = form.get('links') as string;

      let education: Education[] = [];
      let experience: Experience[] = [];
      let projects: Project[] = [];
      let skills = '';
      let personalInfo: PersonalInfo | null = null;
      let links: Links | null = null;

      try { if (educationData) education = JSON.parse(educationData); } catch {}
      try { if (experienceData) experience = JSON.parse(experienceData); } catch {}
      try { if (projectsData) projects = JSON.parse(projectsData); } catch {}
      try { if (skillsData) skills = JSON.parse(skillsData); } catch {}
      try { if (personalInfoData) personalInfo = JSON.parse(personalInfoData); } catch {}
      try { if (linksData) links = JSON.parse(linksData); } catch {}

      // Extract text from text-based files
      let textContent = '';
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (ext && (SUPPORTED_FILE_TYPES.DOCUMENTS as readonly string[]).includes(ext)) {
          try {
            const content = await processTextFile(file);
            textContent += `檔案 ${file.name}:\n${content}\n\n`;
          } catch {}
        }
      }

      rawText = `${textContent}${buildFormDataText(additionalText, education, experience, projects, skills, personalInfo, links)}`.trim();
    } else {
      const body = await request.json().catch(() => ({}));
      rawText = (body.resume as string) || (body.text as string) || '';
    }

    if (!rawText) {
      return NextResponse.json({ error: '缺少必要參數: resume/text 或無法從檔案中提取文字' }, { status: 400 });
    }

    const systemPrompt = getSystemPrompt();

    let unified: UnifiedResumeAnalysisResult;

    if (serviceType === 'create') {
      const user = generateEvaluateResumeUserPrompt({
        resume: { personalInfo: {}, summary: '', achievements: [], experience: [], education: [], projects: [], skills: [] } as UnifiedResume,
        contextNote: `原始輸入：\n${rawText}`,
      });
      const result = await callOpenAIJson<UnifiedResumeAnalysisResult>(client, systemPrompt, user);
      unified = UnifiedResumeAnalysisSchema.parse(result);
    } else {
      const extractUser = generateExtractResumeUserPrompt({ rawText });
      const extracted = await callOpenAIJson<{ resume: UnifiedResume }>(client, systemPrompt, extractUser);

      const evaluateUser = generateEvaluateResumeUserPrompt({ resume: extracted.resume });
      const evaluated = await callOpenAIJson<UnifiedResumeAnalysisResult>(client, systemPrompt, evaluateUser);
      unified = UnifiedResumeAnalysisSchema.parse(evaluated);
    }

    try {
      if (serviceType === 'create') await logResumeBuild(`analyzed ${rawText.length} chars`);
      else await logResumeOptimize(`analyzed ${rawText.length} chars`);
    } catch {}

    return NextResponse.json({ success: true, data: unified, type: 'text_analysis' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: '履歷分析失敗', details: message }, { status: 500 });
  }
}