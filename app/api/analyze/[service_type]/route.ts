import { logResumeBuild, logResumeOptimize } from '@/lib/actions/activity';
import { callOpenAIJson, callOpenAIJsonWithVision, fileToBase64, VisionContentItem } from '@/lib/api/openai-utils';
import { requireProUser } from '@/lib/auth/server';
import { createNativeOpenAIClient, processTextFile, SUPPORTED_FILE_TYPES } from '@/lib/openai-client-native';
import { generateEvaluateSystemPrompt } from '@/lib/prompts/evaluate-system-prompt';
import { generateEvaluateUserPrompt } from '@/lib/prompts/evaluate-user-prompt';
import { generateExtractSystemPrompt } from '@/lib/prompts/extract-system-prompt';
import { generateExtractUserPrompt } from '@/lib/prompts/extract-user-prompt';
import { UnifiedResume, UnifiedResumeAnalysisResult, UnifiedResumeAnalysisSchema } from '@/lib/types/resume-unified';
import type { Education, Experience, Links, PersonalInfo, Project } from '@/lib/upload-utils';
import { checkUsageLimit } from '@/lib/utils/usage-check';
import { NextRequest, NextResponse } from 'next/server';

interface AnyObject { [key: string]: unknown }

function toStringArray(v: unknown): string[] { return Array.isArray(v) ? v.map(String) : []; }
function asObject(v: unknown): AnyObject { return (v && typeof v === 'object') ? (v as AnyObject) : {}; }
/*
  Normalize AI 回傳結果：
  1. 修補欄位名稱差異（如 organization/orgnization、period/duration、school/institution）
  2. 確保各陣列型別欄位皆為陣列
  3. 字串化未知欄位，避免型別不一致造成驗證失敗
*/
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
  const normalizeProjects = (arr: unknown): Array<{ name: string; period?: string; description?: string; technologies: string[]; outcomes: string[] }> => {
    if (!Array.isArray(arr)) return [];
    return arr.map((p) => {
      const v = asObject(p);
      return {
        name: String(v.name ?? ''),
        period: v.period ? String(v.period) : undefined,
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
    grade: obj.grade ? String(obj.grade) : 'F',
    comment: obj.comment ? String(obj.comment) : ''
  } as AnyObject;

  return normalized;
}

// 將 multipart 表單中的結構化欄位轉為可閱讀文字
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
  if (personalInfo) text += `個人基本資料：\n姓名：${personalInfo.name}\n地址：${personalInfo.address}\n電話：${personalInfo.phone}\n郵箱：${personalInfo.email}\n\n`;
  if (links) text += `連結：\nLinkedIn：${links.linkedin}\nGitHub：${links.github}\n作品集：${links.portfolio}\n\n`;
  return text;
}

export async function POST(request: NextRequest) {
  // 從路由讀取 service_type(create/optimize)
  const pathname = new URL(request.url).pathname;
  const match = pathname.match(/\/api\/analyze\/(create|optimize)/);
  if (!match) return NextResponse.json({ error: 'invalid service_type' }, { status: 400 });
  const serviceType: 'create' | 'optimize' = match[1] as 'create' | 'optimize';

  // 權限：需為已登入且 Pro 用戶
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

  // 用量限制檢查
  const usageResult = await checkUsageLimit();
  if (!usageResult.success) return usageResult.response!;

  // 建立 OpenAI Client
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API 配置錯誤' }, { status: 500 });

  const client = createNativeOpenAIClient(apiKey);

  try {
    // 根據 Content-Type 分成兩種情況處理：multipart（含檔案上傳）或 JSON（純文字輸入）
    const isMultipart = (request.headers.get('content-type') || '').includes('multipart/form-data');

    let rawText = '';
    const visionItems: VisionContentItem[] = [];
    let locale: string = 'zh-tw';
    
    if (isMultipart) {
      // 解析表單資料與檔案
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

      // 嘗試解析字串化的 JSON 欄位
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
          // 純文字文件：先在後端解析內容
          try {
            const content = await processTextFile(file);
            textContent += `檔案 ${file.name}:\n${content}\n\n`;
          } catch {}
        } else if ((SUPPORTED_FILE_TYPES.IMAGES as readonly string[]).includes(ext) || (SUPPORTED_FILE_TYPES.PDF as readonly string[]).includes(ext)) {
          // 影像/PDF：先轉 base64，稍後用 Vision 進行 OCR 合併
          try {
            const base64 = await fileToBase64(file);
            const mime = file.type || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg');
            visionItems.push({ type: 'image_url', image_url: { url: `data:${mime};base64,${base64}`, detail: 'high' } });
          } catch {}
        }
      }

      // 若有影像/PDF，使用 Vision 做 OCR 後與文本合併
      const ocrResult = visionItems.length
        ? await callOpenAIJsonWithVision<{ text?: string }>(client, '你是一位專業 OCR 助手。請從使用者提供的圖片或 PDF 中精準擷取履歷文字內容，不要推測或發明內容。僅輸出 JSON 物件：{"text": string}。', visionItems, '請擷取以下所有檔案中的可讀文字，按閱讀順序合併。')
        : { text: '' };

      // 最終 rawText = 文件文字 + OCR 文字 + 表單結構化文字
      const ocrText = ocrResult.text || '';
      const separator = textContent && ocrText ? '\n\n' : '';
      rawText = `${textContent}${separator}${ocrText}\n\n${buildFormDataText(additionalText, education, experience, projects, skills, personalInfo, links)}`.trim();
    } else {
      // JSON 模式：從 body 取得 resume/text 與 locale
      const body = await request.json().catch(() => ({}));
      rawText = (body.resume as string) || (body.text as string) || '';
      if (typeof (body as AnyObject).locale === 'string') locale = String((body as AnyObject).locale).toLowerCase();
    }

    if (!rawText) {
      return NextResponse.json({ error: '缺少必要參數: resume/text 或無法從檔案中提取文字' }, { status: 400 });
    }

    // 抽取（只產出 resume 結構）
    const extractUser = generateExtractUserPrompt({ rawText });
    const extractSystem = generateExtractSystemPrompt();
    const extracted = await callOpenAIJson<{ resume: UnifiedResume }>(client, extractSystem, extractUser);

    // 評估（產出 highlights/issues/scores，並可能微調 resume）
    const evaluateUser = generateEvaluateUserPrompt(extracted.resume);
    const evaluateSystem = generateEvaluateSystemPrompt({ locale });
    const evaluated = await callOpenAIJson<UnifiedResumeAnalysisResult>(client, evaluateSystem, evaluateUser);

    // Normalize AI 回傳結果
    const unifiedResult = UnifiedResumeAnalysisSchema.parse(normalizeUnifiedOutput(evaluated));

    // 行為記錄：依 serviceType 分別記錄 build/optimize
    try {
      if (serviceType === 'create') await logResumeBuild(`analyzed ${rawText.length} chars`);
      else await logResumeOptimize(`analyzed ${rawText.length} chars`);
    } catch {}

    // 回傳 unifiedResult
    return NextResponse.json({ success: true, data: unifiedResult, type: 'text_analysis' });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: '履歷分析失敗', details: message }, { status: 500 });
  }
}