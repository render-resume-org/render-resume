import { requireProUser } from '@/lib/auth/server';
import { generateServiceSpecificSystemPrompt } from '@/lib/config/resume-analysis-config';
import type { DocumentUpload } from '@/lib/openai-client-native';
import { createNativeOpenAIClient, processTextFile, SUPPORTED_FILE_TYPES, validateFileType } from '@/lib/openai-client-native';
import type { ResumeAnalysisResult } from '@/lib/types/resume-analysis';
import { Education, Experience, Project, PersonalInfo, Links } from '@/lib/upload-utils';
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
    
    try {
        const contentType = request.headers.get('content-type') || '';
        console.log('📋 [API] Content-Type:', contentType);
        
        // 處理文件上傳 (multipart/form-data)
        if (contentType.includes('multipart/form-data')) {
            console.log('📁 [API] Handling file upload request');
            return await handleFileUpload(request, authResult.user!);
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
async function handleFileUpload(request: NextRequest, user: { id: string; email: string }) {
    console.log('📁 [API] Starting file upload handling for user:', user.email);
    
    try {
        const formData = await request.formData();
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
        const serviceType = formData.get('serviceType') as 'create' | 'optimize' | null;

        // 解析 education 資料
        let education: Education[] = [];
        if (educationData) {
            try {
                education = JSON.parse(educationData);
                console.log('🎓 [API] Education data parsed:', education);
            } catch (error) {
                console.error('❌ [API] Failed to parse education data:', error);
            }
        }

        // 解析 experience 資料
        let experience: Experience[] = [];
        if (experienceData) {
            try {
                experience = JSON.parse(experienceData);
                console.log('💼 [API] Experience data parsed:', experience);
            } catch (error) {
                console.error('❌ [API] Failed to parse experience data:', error);
            }
        }

        // 解析 projects 資料
        let projects: Project[] = [];
        if (projectsData) {
            try {
                projects = JSON.parse(projectsData);
                console.log('🚀 [API] Projects data parsed:', projects);
            } catch (error) {
                console.error('❌ [API] Failed to parse projects data:', error);
            }
        }

        // 解析 skills 資料
        let skills: string = '';
        if (skillsData) {
            try {
                skills = JSON.parse(skillsData);
                console.log('⚡ [API] Skills data parsed:', skills);
            } catch (error) {
                console.error('❌ [API] Failed to parse skills data:', error);
            }
        }

        // 解析 personalInfo 資料
        let personalInfo: PersonalInfo | null = null;
        if (personalInfoData) {
            try {
                personalInfo = JSON.parse(personalInfoData);
                console.log('👤 [API] PersonalInfo data parsed:', personalInfo);
            } catch (error) {
                console.error('❌ [API] Failed to parse personalInfo data:', error);
            }
        }

        // 解析 links 資料
        let links: Links | null = null;
        if (linksData) {
            try {
                links = JSON.parse(linksData);
                console.log('🔗 [API] Links data parsed:', links);
            } catch (error) {
                console.error('❌ [API] Failed to parse links data:', error);
            }
        }

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

        // 檢查是否有有效的經驗內容
        const hasValidExperience = (experienceList: Experience[]) => {
            return experienceList.some(exp => 
                exp.company.trim() !== '' || 
                exp.position.trim() !== '' || 
                exp.description.trim() !== ''
            );
        };

        // 檢查是否有有效的專案內容
        const hasValidProjects = (projectsList: Project[]) => {
            return projectsList.some(proj => 
                proj.name.trim() !== '' || 
                proj.description.trim() !== ''
            );
        };

        // 根據 serviceType 驗證輸入
        if (serviceType === 'optimize') {
            if (files.length === 0) {
                console.error('❌ [API] No files uploaded for optimize service');
                return NextResponse.json(
                    { error: '請選擇要分析的文件' },
                    { status: 400 }
                );
            }
        } else if (serviceType === 'create') {
            if (!hasValidExperience(experience) && !hasValidProjects(projects)) {
                console.error('❌ [API] No valid experience or projects for create service');
                return NextResponse.json(
                    { error: '請至少填寫一項工作經驗或專案經驗' },
                    { status: 400 }
                );
            }
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            console.error('❌ [API] OPENAI_API_KEY is not configured');
            return NextResponse.json(
                { error: 'OpenAI API 配置錯誤' },
                { status: 500 }
            );
        }

        console.log('🔍 [API] Starting file validation and processing');
        // 驗證文件類型並處理文件
        const documents: DocumentUpload[] = [];
        
        // 只有在有檔案時才進行文件處理
        if (files.length > 0) {
            for (const file of files) {
                console.log(`📄 [API] Processing file: ${file.name} (${file.size} bytes)`);
                
                if (!validateFileType(file.name)) {
                    console.error(`❌ [API] Unsupported file type: ${file.name}`);
                    return NextResponse.json(
                        { error: `不支援的文件類型: ${file.name}` },
                        { status: 400 }
                    );
                }

                // 檢查文件大小 (10MB 限制)
                if (file.size > 10 * 1024 * 1024) {
                    console.error(`❌ [API] File too large: ${file.name} (${file.size} bytes)`);
                    return NextResponse.json(
                        { error: `文件過大: ${file.name} (最大 10MB)` },
                        { status: 400 }
                    );
                }

                const fileExtension = file.name.split('.').pop()?.toLowerCase();
                console.log(`📋 [API] File extension: ${fileExtension} for ${file.name}`);
                
                let content: string | undefined;

                // 對於文字文檔，預先讀取內容
                if (fileExtension && (SUPPORTED_FILE_TYPES.DOCUMENTS as readonly string[]).includes(fileExtension)) {
                    console.log(`📝 [API] Reading text content for: ${file.name}`);
                    try {
                        content = await processTextFile(file);
                        console.log(`✅ [API] Text content read successfully, length: ${content.length} for ${file.name}`);
                    } catch (error) {
                        console.error(`❌ [API] Failed to read text file ${file.name}:`, error);
                        return NextResponse.json(
                            { error: `無法讀取文件 ${file.name}: ${error instanceof Error ? error.message : '未知錯誤'}` },
                            { status: 400 }
                        );
                    }
                }

                documents.push({
                    file,
                    fileName: file.name,
                    fileType: file.type,
                    content
                });
                
                console.log(`✅ [API] Document prepared: ${file.name}`);
            }
        } else {
            console.log('📄 [API] No files to process, proceeding with form data only');
        }

        console.log('🤖 [API] Creating Native OpenAI client for document analysis');
        const client = createNativeOpenAIClient(apiKey);
        
        // 根據服務類型生成專屬的 system prompt
        let customSystemPrompt: string | undefined;
        if (serviceType === 'create' || serviceType === 'optimize') {
            console.log(`🎯 [API] Using service-specific system prompt for file upload: ${serviceType}`);
            customSystemPrompt = generateServiceSpecificSystemPrompt(serviceType);
        }
        
        console.log('🚀 [API] Starting document analysis');
        
        // 根據是否有檔案選擇不同的分析方法
        let result: ResumeAnalysisResult;
        if (documents.length > 0) {
            // 有檔案時使用 analyzeDocuments
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
            // 沒有檔案時使用 analyzeResume（僅處理表單數據）
            console.log('📝 [API] No documents provided, using analyzeResume for form data only');
            const formDataText = buildFormDataText(additionalText, education, experience, projects, skills, personalInfo, links);
            result = await client.analyzeResume(formDataText, undefined, customSystemPrompt);
        }
        
        console.log('✅ [API] Document analysis completed successfully');
        console.log('📊 [API] Analysis result keys:', Object.keys(result));
        console.log('📊 [API] Analysis result:', result);

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