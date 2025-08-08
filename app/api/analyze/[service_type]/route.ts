import { logResumeBuild, logResumeOptimize } from '@/lib/actions/activity';
import { callOpenAIJson, callOpenAIJsonWithVision, fileToBase64, VisionContentItem } from '@/lib/api/openai-utils';
import { requireProUser } from '@/lib/auth/server';
import { createNativeOpenAIClient, processTextFile, SUPPORTED_FILE_TYPES } from '@/lib/openai-client-native';
import { generateEvaluateResumeUserPrompt } from '@/lib/prompts/analyze-evaluate-prompt';
import { generateExtractResumeUserPrompt } from '@/lib/prompts/analyze-extract-prompt';
import { generateUnifiedSystemPrompt } from '@/lib/prompts/unified-system-prompt';
import { UnifiedResume, UnifiedResumeAnalysisResult, UnifiedResumeAnalysisSchema } from '@/lib/types/resume-unified';
import type { Education, Experience, Links, PersonalInfo, Project } from '@/lib/upload-utils';
import { checkUsageLimit } from '@/lib/utils/usage-check';
import { NextRequest, NextResponse } from 'next/server';

interface AnyObject { [key: string]: unknown }

function toStringArray(val: unknown): string[] { return Array.isArray(val) ? val.map(String) : []; }
function asObject(v: unknown): AnyObject { return (v && typeof v === 'object') ? (v as AnyObject) : {}; }
function normalizeUnifiedOutput(result: unknown): unknown {
  if (!result || typeof result !== 'object') return result;
  const obj = asObject(result);
  const resume = asObject(obj.resume);

  const normalizeAchievements = (arr: unknown): Array<{ title: string; organization?: string; period?: string; description?: string; outcomes: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((a): { title: string; organization?: string; period?: string; description?: string; outcomes: string[] } => {
      const v = asObject(a);
      return {
        title: String(v.title ?? ''),
        organization: v.organization ? String(v.organization) : (v.orgnization ? String(v.orgnization) : undefined),
        period: v.period ? String(v.period) : undefined,
        description: v.description ? String(v.description) : undefined,
        outcomes: toStringArray(v.outcomes),
      };
    });
  };
  const normalizeExperience = (arr: unknown): Array<{ title: string; company?: string; period?: string; description?: string; outcomes: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((x) => {
      const v = asObject(x);
      return {
        title: String(v.title ?? v.position ?? ''),
        company: v.company ? String(v.company) : undefined,
        period: v.period ? String(v.period) : (v.duration ? String(v.duration) : undefined),
        description: v.description ? String(v.description) : undefined,
        outcomes: toStringArray(v.outcomes),
      };
    });
  };
  const normalizeEducation = (arr: unknown): Array<{ degree: string; school: string; period?: string; gpa?: string; relevant_courses: string[]; outcomes: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((e) => {
      const v = asObject(e);
      return {
        degree: String(v.degree ?? ''),
        school: String(v.school ?? v.institution ?? ''),
        period: v.period ? String(v.period) : (v.duration ? String(v.duration) : undefined),
        gpa: v.gpa ? String(v.gpa) : undefined,
        relevant_courses: toStringArray(v.relevant_courses ?? v.courses),
        outcomes: toStringArray(v.outcomes),
      };
    });
  };
  const normalizeProjects = (arr: unknown): Array<{ name: string; description?: string; technologies: string[]; outcomes: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => {
      const v = asObject(p);
      return {
        name: String(v.name ?? ''),
        description: v.description ? String(v.description) : undefined,
        technologies: toStringArray(v.technologies),
        outcomes: toStringArray(v.outcomes),
      };
    });
  };
  const normalizeSkills = (arr: unknown): Array<{ category: string; items: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((s) => {
      const v = asObject(s);
      return {
        category: String(v.category ?? ''),
        items: toStringArray(v.items ?? v.skills),
      };
    });
  };

  const normalized = {
    ...obj,
    resume: {
      personalInfo: resume.personalInfo ? {
        name: asObject(resume.personalInfo).name ? String(asObject(resume.personalInfo).name) : '',
        title: asObject(resume.personalInfo).title ? String(asObject(resume.personalInfo).title) : '',
        email: asObject(resume.personalInfo).email ? String(asObject(resume.personalInfo).email) : '',
        phone: asObject(resume.personalInfo).phone ? String(asObject(resume.personalInfo).phone) : '',
        location: asObject(resume.personalInfo).location ? String(asObject(resume.personalInfo).location) : '',
        links: asObject(resume.personalInfo).links ? {
          linkedin: asObject(asObject(resume.personalInfo).links).linkedin ? String(asObject(asObject(resume.personalInfo).links).linkedin) : '',
          github: asObject(asObject(resume.personalInfo).links).github ? String(asObject(asObject(resume.personalInfo).links).github) : '',
          website: asObject(asObject(resume.personalInfo).links).website ? String(asObject(asObject(resume.personalInfo).links).website) : '',
          portfolio: asObject(asObject(resume.personalInfo).links).portfolio ? String(asObject(asObject(resume.personalInfo).links).portfolio) : ''
        } : undefined,
      } : undefined,
      summary: resume.summary ? String(resume.summary) : '',
      achievements: normalizeAchievements(resume.achievements),
      experience: normalizeExperience(resume.experience),
      education: normalizeEducation(resume.education),
      projects: normalizeProjects(resume.projects),
      skills: normalizeSkills(resume.skills),
    },
    highlights: Array.isArray(obj.highlights) ? obj.highlights : [],
    issues: Array.isArray(obj.issues) ? obj.issues : [],
    scores: Array.isArray(obj.scores) ? obj.scores : [],
  } as AnyObject;

  return normalized;
}

function getSystemPrompt(locale?: string): string {
  return generateUnifiedSystemPrompt({ locale });
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
    const visionItems: VisionContentItem[] = [];
    let locale: string = 'zh-tw';
    if (isMultipart) {
      const form = await request.formData();
      const files = form.getAll('files') as File[];
      const additionalText = (form.get('additionalText') as string) || '';
      locale = ((form.get('locale') as string) || 'zh-tw').toLowerCase();
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

      let textContent = '';
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext) continue;
        if ((SUPPORTED_FILE_TYPES.DOCUMENTS as readonly string[]).includes(ext)) {
          try {
            const content = await processTextFile(file);
            textContent += `檔案 ${file.name}:\n${content}\n\n`;
          } catch {}
        } else if ((SUPPORTED_FILE_TYPES.IMAGES as readonly string[]).includes(ext) || (SUPPORTED_FILE_TYPES.PDF as readonly string[]).includes(ext)) {
          try {
            const base64 = await fileToBase64(file);
            const mime = file.type || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg');
            visionItems.push({ type: 'image_url', image_url: { url: `data:${mime};base64,${base64}`, detail: 'high' } });
          } catch {}
        }
      }

      const ocrResult = visionItems.length
        ? await callOpenAIJsonWithVision<{ text?: string }>(client, '你是一位專業 OCR 助手。請從使用者提供的圖片或 PDF 中精準擷取履歷文字內容，不要推測或發明內容。僅輸出 JSON 物件：{"text": string}。', visionItems, '請擷取以下所有檔案中的可讀文字，按閱讀順序合併。')
        : { text: '' };

      rawText = `${textContent}${ocrResult.text || ''}\n\n${buildFormDataText(additionalText, education, experience, projects, skills, personalInfo, links)}`.trim();
    } else {
      const body = await request.json().catch(() => ({}));
      rawText = (body.resume as string) || (body.text as string) || '';
      if (typeof (body as AnyObject).locale === 'string') locale = String((body as AnyObject).locale).toLowerCase();
    }

    if (!rawText) {
      return NextResponse.json({ error: '缺少必要參數: resume/text 或無法從檔案中提取文字' }, { status: 400 });
    }

    const systemPrompt = getSystemPrompt(locale);

    const extractUser = generateExtractResumeUserPrompt({ rawText });
    const extracted = await callOpenAIJson<{ resume: UnifiedResume }>(client, systemPrompt, extractUser);
    const evaluateUser = generateEvaluateResumeUserPrompt({ resume: extracted.resume, contextNote: `locale=${locale}` });
    const evaluated = await callOpenAIJson<UnifiedResumeAnalysisResult>(client, systemPrompt, evaluateUser);
    const unifiedResult = UnifiedResumeAnalysisSchema.parse(normalizeUnifiedOutput(evaluated));

    try {
      if (serviceType === 'create') await logResumeBuild(`analyzed ${rawText.length} chars`);
      else await logResumeOptimize(`analyzed ${rawText.length} chars`);
    } catch {}

    return NextResponse.json({ success: true, data: unifiedResult, type: 'text_analysis' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: '履歷分析失敗', details: message }, { status: 500 });
  }
}