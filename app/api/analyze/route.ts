import { logResumeBuild, logResumeOptimize } from '@/lib/actions/activity';
import { requireProUser } from '@/lib/auth/server';
import { generateServiceSpecificSystemPrompt } from '@/lib/config/resume-analysis-config';
import type { DocumentUpload } from '@/lib/openai-client-native';
import { createNativeOpenAIClient, processTextFile, SUPPORTED_FILE_TYPES, validateFileType } from '@/lib/openai-client-native';
import type { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { Education, Experience, Links, PersonalInfo, Project } from '@/lib/upload-utils';
import { checkUsageLimit } from '@/lib/utils/usage-check';
import { NextRequest, NextResponse } from 'next/server';

// 輔助函數：構建表單數據文本
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
    
    if (additionalText) {
        text += `額外資訊：\n${additionalText}\n\n`;
    }
    
    if (education && education.length > 0) {
        text += `教育背景資訊：\n${education.map(edu => {
            const duration = edu.isCurrent ? 
                `${edu.startMonth}/${edu.startYear} - 現在` : 
                `${edu.startMonth}/${edu.startYear} - ${edu.endMonth}/${edu.endYear}`;
            return `- ${edu.school} ${edu.degree} ${edu.major} (${duration}) GPA: ${edu.gpa}`;
        }).join('\n')}\n\n`;
    }
    
    if (experience && experience.length > 0) {
        text += `工作經驗資訊：\n${experience.map(exp => {
            const duration = exp.isCurrent ? 
                `${exp.startMonth}/${exp.startYear} - 現在` : 
                `${exp.startMonth}/${exp.startYear} - ${exp.endMonth}/${exp.endYear}`;
            return `- ${exp.company} ${exp.position} (${exp.location})\n  期間：${duration}\n  描述：${exp.description}`;
        }).join('\n\n')}\n\n`;
    }
    
    if (projects && projects.length > 0) {
        text += `專案經驗資訊：\n${projects.map(project => {
            const duration = project.isCurrent ? 
                `${project.startMonth}/${project.startYear} - 現在` : 
                `${project.startMonth}/${project.startYear} - ${project.endMonth}/${project.endYear}`;
            return `- ${project.name}\n  期間：${duration}\n  描述：${project.description}`;
        }).join('\n\n')}\n\n`;
    }
    
    if (skills) {
        text += `技能列表：\n${skills}\n\n`;
    }
    
    if (personalInfo) {
        text += `個人基本資料：\n地址：${personalInfo.address}\n電話：${personalInfo.phone}\n郵箱：${personalInfo.email}\n\n`;
    }
    
    if (links) {
        text += `連結：\nLinkedIn：${links.linkedin}\nGitHub：${links.github}\n作品集：${links.portfolio}\n\n`;
    }
    
    return text;
}

// 驗證輸入數據的輔助函數
function validateCreateServiceInput(experience: Experience[], projects: Project[]): { isValid: boolean; error?: string } {
    const hasValidExperience = experience.some(exp => 
        exp.company.trim() !== '' || 
        exp.position.trim() !== '' || 
        exp.description.trim() !== ''
    );
    
    const hasValidProjects = projects.some(proj => 
        proj.name.trim() !== '' || 
        proj.description.trim() !== ''
    );
    
    if (!hasValidExperience && !hasValidProjects) {
        return { 
            isValid: false, 
            error: '請至少填寫一項工作經驗或專案經驗' 
        };
    }
    
    return { isValid: true };
}

function validateOptimizeServiceInput(files: File[]): { isValid: boolean; error?: string } {
    if (files.length === 0) {
        return { 
            isValid: false, 
            error: '請選擇要分析的文件' 
        };
    }
    
    return { isValid: true };
}

// 處理 Create 服務的邏輯
async function handleCreateService(
    client: ReturnType<typeof createNativeOpenAIClient>,
    files: File[],
    additionalText: string,
    education: Education[],
    experience: Experience[],
    projects: Project[],
    skills: string,
    personalInfo: PersonalInfo | null,
    links: Links | null,
    useVision: boolean
): Promise<ResumeAnalysisResult> {
    console.log('🎯 [API] Handling CREATE service');
    
    // 驗證 Create 服務的輸入
    const validation = validateCreateServiceInput(experience, projects);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }
    
    // 生成 Create 服務專屬的 system prompt
    const customSystemPrompt = generateServiceSpecificSystemPrompt('create');
    
    // 處理文件（如果有的話）
    const documents: DocumentUpload[] = [];
    if (files.length > 0) {
        for (const file of files) {
            console.log(`📄 [API] Processing file for CREATE service: ${file.name}`);
            
            if (!validateFileType(file.name)) {
                throw new Error(`不支援的文件類型: ${file.name}`);
            }
            
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`文件過大: ${file.name} (最大 10MB)`);
            }
            
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            let content: string | undefined;
            
            if (fileExtension && (SUPPORTED_FILE_TYPES.DOCUMENTS as readonly string[]).includes(fileExtension)) {
                content = await processTextFile(file);
            }
            
            documents.push({
                file,
                fileName: file.name,
                fileType: file.type,
                content
            });
        }
    }
    
    // 執行分析
    let result: ResumeAnalysisResult;
    if (documents.length > 0) {
        result = await client.analyzeDocuments({
            documents,
            additionalText: additionalText || undefined,
            education: education.length > 0 ? education : undefined,
            experience: experience.length > 0 ? experience : undefined,
            projects: projects.length > 0 ? projects : undefined,
            skills: skills || undefined,
            personalInfo: personalInfo || undefined,
            links: links || undefined,
            useVision,
            customSystemPrompt
        });
    } else {
        const formDataText = buildFormDataText(additionalText, education, experience, projects, skills, personalInfo, links);
        result = await client.analyzeResume(formDataText, undefined, customSystemPrompt);
    }
    
    // 記錄活動
    await logResumeBuild(`分析了 ${files.length} 個檔案，包含 ${education.length} 個教育經歷、${experience.length} 個工作經歷、${projects.length} 個專案`);
    
    return result;
}

// 處理 Optimize 服務的邏輯
async function handleOptimizeService(
    client: ReturnType<typeof createNativeOpenAIClient>,
    files: File[],
    additionalText: string,
    education: Education[],
    experience: Experience[],
    projects: Project[],
    skills: string,
    personalInfo: PersonalInfo | null,
    links: Links | null,
    useVision: boolean
): Promise<ResumeAnalysisResult> {
    console.log('🎯 [API] Handling OPTIMIZE service');
    
    // 驗證 Optimize 服務的輸入
    const validation = validateOptimizeServiceInput(files);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }
    
    // 生成 Optimize 服務專屬的 system prompt
    const customSystemPrompt = generateServiceSpecificSystemPrompt('optimize');
    
    // 處理文件
    const documents: DocumentUpload[] = [];
    for (const file of files) {
        console.log(`📄 [API] Processing file for OPTIMIZE service: ${file.name}`);
        
        if (!validateFileType(file.name)) {
            throw new Error(`不支援的文件類型: ${file.name}`);
        }
        
        if (file.size > 10 * 1024 * 1024) {
            throw new Error(`文件過大: ${file.name} (最大 10MB)`);
        }
        
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        let content: string | undefined;
        
        if (fileExtension && (SUPPORTED_FILE_TYPES.DOCUMENTS as readonly string[]).includes(fileExtension)) {
            content = await processTextFile(file);
        }
        
        documents.push({
            file,
            fileName: file.name,
            fileType: file.type,
            content
        });
    }
    
    // 執行分析
    const result = await client.analyzeDocuments({
        documents,
        additionalText: additionalText || undefined,
        education: education.length > 0 ? education : undefined,
        experience: experience.length > 0 ? experience : undefined,
        projects: projects.length > 0 ? projects : undefined,
        skills: skills || undefined,
        personalInfo: personalInfo || undefined,
        links: links || undefined,
        useVision,
        customSystemPrompt
    });
    
    // 記錄活動
    await logResumeOptimize(`分析了 ${files.length} 個檔案，包含 ${education.length} 個教育經歷、${experience.length} 個工作經歷、${projects.length} 個專案`);
    
    return result;
}

export async function POST(request: NextRequest) {
    console.log('🚀 [API] POST /api/analyze - Request received (using Native OpenAI Client)');
    
    // 驗證用戶是否為 Pro 用戶
    console.log('🔐 [API] Checking Pro user authentication');
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
    
    console.log('✅ [API] Pro user authenticated:', authResult.user?.email);
    
    // 檢查用戶今日使用量是否超過限制
    const usageResult = await checkUsageLimit();
    if (!usageResult.success) {
        return usageResult.response!;
    }
    
    try {
        const contentType = request.headers.get('content-type') || '';
        console.log('📋 [API] Content-Type:', contentType);
        
        // 處理文件上傳 (multipart/form-data)
        if (contentType.includes('multipart/form-data')) {
            console.log('📁 [API] Handling file upload request');
            
            // 先檢查 serviceType 是否存在
            const formData = await request.formData();
            const serviceType = formData.get('serviceType') as 'create' | 'optimize';
            
            if (!serviceType) {
                console.error('❌ [API] Missing required parameter: serviceType');
                return NextResponse.json(
                    { error: '缺少必要參數: serviceType' },
                    { status: 400 }
                );
            }
            
            if (serviceType !== 'create' && serviceType !== 'optimize') {
                console.error(`❌ [API] Invalid service type: ${serviceType}`);
                return NextResponse.json(
                    { error: `不支援的服務類型: ${serviceType}` },
                    { status: 400 }
                );
            }
            
            return await handleFileUpload(formData, serviceType, authResult.user!);
        }
        
        console.log('📝 [API] Handling JSON request');
        // 處理 JSON 請求 (文字分析或自定義提示)
        const body = await request.json();
        console.log('📋 [API] Request body keys:', Object.keys(body));
        
        const { resume, text, systemPrompt, userPrompt, serviceType } = body;

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('❌ [API] OPENAI_API_KEY is not configured');
            return NextResponse.json(
                { error: 'OpenAI API 配置錯誤' },
                { status: 500 }
            );
        }

        console.log('🤖 [API] Creating Native OpenAI client');
        const client = createNativeOpenAIClient(apiKey);

        // 如果提供了自定義提示，使用自定義分析
        if (systemPrompt && userPrompt) {
            console.log('🎯 [API] Using custom prompt analysis');
            const result = await client.customPrompt(systemPrompt, userPrompt);
            console.log('✅ [API] Custom prompt analysis completed');
            return NextResponse.json({
                success: true,
                data: { result },
                type: 'custom_prompt'
            });
        }

        // 標準履歷分析
        if (!resume) {
            console.error('❌ [API] Missing required parameter: resume');
            return NextResponse.json(
                { error: '缺少必要參數: resume' },
                { status: 400 }
            );
        }

        console.log('📄 [API] Starting standard resume analysis');
        console.log('📋 [API] Resume content length:', resume.length);
        console.log('📋 [API] Additional text:', text ? 'provided' : 'none');
        console.log('🎯 [API] Service type:', serviceType || 'default');
        
        // 根據服務類型生成專屬的 system prompt
        let customSystemPrompt: string | undefined;
        if (serviceType === 'create' || serviceType === 'optimize') {
            console.log(`🎯 [API] Using service-specific system prompt for: ${serviceType}`);
            customSystemPrompt = generateServiceSpecificSystemPrompt(serviceType);
        }
        
        const result = await client.analyzeResume(resume, text, customSystemPrompt);
        console.log('✅ [API] Resume analysis completed');
        
        // 後端記錄 build/optimize resume
        try {
            if (serviceType === 'create') {
                await logResumeBuild(`分析了 ${resume.length} 字元的履歷內容`);
            } else if (serviceType === 'optimize') {
                await logResumeOptimize(`分析了 ${resume.length} 字元的履歷內容`);
            }
        } catch (e) {
            console.error('Error logging resume build/optimize:', e);
        }
        
        return NextResponse.json({
            success: true,
            data: result,
            type: 'text_analysis'
        });

    } catch (error) {
        console.error('❌ [API] Resume analysis error:', error);
        if (error instanceof Error) {
            console.error('❌ [API] Error message:', error.message);
            console.error('❌ [API] Error stack:', error.stack);
        }
        return NextResponse.json(
            { 
                error: '履歷分析失敗',
                details: error instanceof Error ? error.message : '未知錯誤'
            },
            { status: 500 }
        );
    }
}

// 處理文件上傳的函數
async function handleFileUpload(formData: FormData, serviceType: 'create' | 'optimize', user: { id: string; email: string }) {
    console.log('📁 [API] Starting file upload handling for user:', user.email);
    
    // 檢查用戶今日使用量是否超過限制
    const usageResult = await checkUsageLimit();
    if (!usageResult.success) {
        return usageResult.response!;
    }
    
    try {
        console.log('📋 [API] FormData received');
        
        const files = formData.getAll('files') as File[];
        const additionalText = formData.get('additionalText') as string;
        const educationData = formData.get('education') as string;
        const experienceData = formData.get('experience') as string;
        const projectsData = formData.get('projects') as string;
        const skillsData = formData.get('skills') as string;
        const personalInfoData = formData.get('personalInfo') as string;
        const linksData = formData.get('links') as string;
        const useVision = formData.get('useVision') === 'true';

        // 解析各種數據
        const education = educationData ? JSON.parse(educationData) : [];
        const experience = experienceData ? JSON.parse(experienceData) : [];
        const projects = projectsData ? JSON.parse(projectsData) : [];
        const skills = skillsData ? JSON.parse(skillsData) : '';
        const personalInfo = personalInfoData ? JSON.parse(personalInfoData) : null;
        const links = linksData ? JSON.parse(linksData) : null;

        console.log('📊 [API] Upload details:', {
            filesCount: files.length,
            fileNames: files.map(f => f.name),
            fileSizes: files.map(f => f.size),
            additionalText: additionalText ? 'provided' : 'none',
            education: education.length > 0 ? `${education.length} entries` : 'none',
            experience: experience.length > 0 ? `${experience.length} entries` : 'none',
            projects: projects.length > 0 ? `${projects.length} entries` : 'none',
            skills: skills ? 'provided' : 'none',
            personalInfo: personalInfo ? 'provided' : 'none',
            links: links ? 'provided' : 'none',
            useVision,
            serviceType: serviceType || 'default',
            userId: user.id
        });

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('❌ [API] OPENAI_API_KEY is not configured');
            return NextResponse.json(
                { error: 'OpenAI API 配置錯誤' },
                { status: 500 }
            );
        }

        console.log('🤖 [API] Creating Native OpenAI client for document analysis');
        const client = createNativeOpenAIClient(apiKey);
        
        // 根據服務類型選擇對應的處理邏輯
        let result: ResumeAnalysisResult;
        
        if (serviceType === 'create') {
            result = await handleCreateService(
                client,
                files,
                additionalText,
                education,
                experience,
                projects,
                skills,
                personalInfo,
                links,
                useVision
            );
        } else {
            // serviceType 已經在 POST handler 中驗證過，這裡一定是 'optimize'
            result = await handleOptimizeService(
                client,
                files,
                additionalText,
                education,
                experience,
                projects,
                skills,
                personalInfo,
                links,
                useVision
            );
        }
        
        console.log('✅ [API] Document analysis completed successfully');
        console.log('📊 [API] Analysis result keys:', Object.keys(result));

        return NextResponse.json({
            success: true,
            data: result,
            type: 'document_analysis',
            metadata: {
                filesProcessed: files.length,
                fileNames: files.map(f => f.name),
                useVision,
                serviceType: serviceType || 'default',
                totalSize: files.reduce((sum, file) => sum + file.size, 0),
                userId: user.id
            }
        });

    } catch (error) {
        console.error('❌ [API] File upload error:', error);
        if (error instanceof Error) {
            console.error('❌ [API] Error message:', error.message);
            console.error('❌ [API] Error stack:', error.stack);
        }
        return NextResponse.json(
            { 
                error: '文件分析失敗',
                details: error instanceof Error ? error.message : '未知錯誤'
            },
            { status: 500 }
        );
    }
}

 