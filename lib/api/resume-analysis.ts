import { Education, Experience, Project, PersonalInfo, Links } from '@/lib/upload-utils';
import type {
    AnalyzePostBody,
    ApiResponse,
    BatchAnalysisOptions,
    BatchAnalysisResult,
    CustomPromptOptions,
    CustomPromptResponse,
    ResumeAnalysisOptions,
    ResumeAnalysisResponse,
    ResumeAnalysisResult
} from '@/lib/types/resume-analysis';

const API_BASE_URL = '/api';

/**
 * 分析履歷內容（文字）- 統一使用 POST 方法
 */
export async function analyzeResume(options: ResumeAnalysisOptions): Promise<ResumeAnalysisResponse> {
    const { resume, text } = options;

    if (!resume) {
        throw new Error('履歷內容不能為空');
    }

    try {
        const body: AnalyzePostBody = { resume };
        if (text) body.text = text;

        const response = await fetch(`${API_BASE_URL}/analyze/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Handle specific authentication and authorization errors
            if (response.status === 401) {
                throw new Error(errorData.requiresAuth ? 
                    '請先登入才能使用此功能' : 
                    (errorData.error || '身份驗證失敗，請重新登入')
                );
            }
            
            if (response.status === 403) {
                throw new Error(errorData.requiresProPlan ? 
                    '此功能僅限 Pro 會員使用，請升級您的方案後重試' : 
                    (errorData.error || '權限不足')
                );
            }
            
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Resume analysis error:', error);
        throw error instanceof Error ? error : new Error('履歷分析請求失敗');
    }
}

/**
 * 分析上傳的文檔
 */
export async function analyzeDocuments(options: {
    files: File[];
    additionalText?: string;
    education?: Education[];
    experience?: Experience[];
    projects?: Project[];
    skills?: string;
    personalInfo?: PersonalInfo;
    links?: Links;
    useVision?: boolean;
    serviceType?: 'create' | 'optimize';
}): Promise<ApiResponse<ResumeAnalysisResult>> {
    console.log('📁 [Frontend API] Starting document analysis:', {
        filesCount: options.files.length,
        fileNames: options.files.map(f => f.name),
        fileSizes: options.files.map(f => f.size),
        additionalText: options.additionalText ? 'provided' : 'none',
        education: options.education ? `${options.education.length} entries` : 'none',
        experience: options.experience ? `${options.experience.length} entries` : 'none',
        projects: options.projects ? `${options.projects.length} entries` : 'none',
        skills: options.skills ? 'provided' : 'none',
        personalInfo: options.personalInfo ? 'provided' : 'none',
        links: options.links ? 'provided' : 'none',
        useVision: options.useVision,
        serviceType: options.serviceType || 'create'
    });

    // 檢查是否有有效的經驗內容
    const hasValidExperience = (experienceList?: Experience[]) => {
        return experienceList?.some(exp => 
            exp.company.trim() !== '' || 
            exp.position.trim() !== '' || 
            exp.description.trim() !== ''
        ) || false;
    };

    // 檢查是否有有效的專案內容
    const hasValidProjects = (projectsList?: Project[]) => {
        return projectsList?.some(proj => 
            proj.name.trim() !== '' || 
            proj.description.trim() !== ''
        ) || false;
    };

    // 根據 serviceType 決定是否需要檔案
    if (options.serviceType === 'optimize' && (!options.files || options.files.length === 0)) {
        console.error('❌ [Frontend API] No files provided for optimize service');
        return {
            success: false,
            error: '請選擇要分析的文件'
        };
    }

    // 對於 create 服務，檢查是否有經驗或專案資料
    if (options.serviceType === 'create' && !hasValidExperience(options.experience) && !hasValidProjects(options.projects)) {
        console.error('❌ [Frontend API] No valid experience or projects provided for create service');
        return {
            success: false,
            error: '請至少填寫一項工作經驗或專案經驗'
        };
    }

    try {
        console.log('📋 [Frontend API] Creating FormData');
        const formData = new FormData();
        
        // 添加文件（只有在有檔案時才添加）
        if (options.files && options.files.length > 0) {
            options.files.forEach((file, index) => {
                console.log(`📄 [Frontend API] Adding file ${index + 1}: ${file.name} (${file.size} bytes)`);
                formData.append('files', file);
            });
        } else {
            console.log('📄 [Frontend API] No files to add');
        }
        
        // 添加額外資訊
        if (options.additionalText) {
            console.log('📝 [Frontend API] Adding additional text');
            formData.append('additionalText', options.additionalText);
        }
        
        // 添加教育資訊
        if (options.education) {
            console.log('🎓 [Frontend API] Adding education data');
            formData.append('education', JSON.stringify(options.education));
        }
        
        // 添加工作經驗
        if (options.experience) {
            console.log('💼 [Frontend API] Adding experience data');
            formData.append('experience', JSON.stringify(options.experience));
        }
        
        // 添加項目經驗
        if (options.projects) {
            console.log('🚀 [Frontend API] Adding projects data');
            formData.append('projects', JSON.stringify(options.projects));
        }
        
        // 添加技能
        if (options.skills) {
            console.log('⚡ [Frontend API] Adding skills data');
            formData.append('skills', JSON.stringify(options.skills));
        }
        
        // 添加個人資訊
        if (options.personalInfo) {
            console.log('👤 [Frontend API] Adding personal info data');
            formData.append('personalInfo', JSON.stringify(options.personalInfo));
        }
        
        // 添加連結
        if (options.links) {
            console.log('🔗 [Frontend API] Adding links data');
            formData.append('links', JSON.stringify(options.links));
        }
        
        // 添加 Vision 設定
        formData.append('useVision', String(options.useVision ?? true));
        console.log('👁️ [Frontend API] Vision enabled:', options.useVision ?? true);

        // 添加服務類型
        formData.append('serviceType', options.serviceType || 'create');
        console.log('🔧 [Frontend API] Service type:', options.serviceType || 'create');

        console.log(`🚀 [Frontend API] Sending request to /api/analyze/${options.serviceType || 'create'}`);
        const response = await fetch(`/api/analyze/${options.serviceType || 'create'}`, {
            method: 'POST',
            body: formData,
        });

        console.log('📋 [Frontend API] Response status:', response.status);
        console.log('📋 [Frontend API] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error('❌ [Frontend API] Response not ok:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({ error: '請求失敗' }));
            console.error('❌ [Frontend API] Error data:', errorData);
            
            // Handle specific authentication and authorization errors
            if (response.status === 401) {
                return {
                    success: false,
                    error: errorData.requiresAuth ? 
                        '請先登入才能使用此功能' : 
                        (errorData.error || '身份驗證失敗，請重新登入')
                };
            }
            
            if (response.status === 403) {
                return {
                    success: false,
                    error: errorData.requiresProPlan ? 
                        '此功能僅限 Pro 會員使用，請升級您的方案後重試' : 
                        (errorData.error || '權限不足')
                };
            }
            
            return {
                success: false,
                error: errorData.error || `請求失敗 (${response.status})`
            };
        }

        const data = await response.json();
        console.log('✅ [Frontend API] Response received successfully');
        console.log('📊 [Frontend API] Response data keys:', Object.keys(data));
        console.log('📊 [Frontend API] Response success:', data.success);
        console.log('📊 [Frontend API] Response type:', data.type);

        if (data.success && data.data) {
            console.log('✅ [Frontend API] Analysis completed successfully');
            console.log('📊 [Frontend API] Analysis result keys:', Object.keys(data.data));
            return {
                success: true,
                data: data.data,
                metadata: data.metadata
            };
        } else {
            console.error('❌ [Frontend API] Analysis failed:', data.error);
            return {
                success: false,
                error: data.error || '分析失敗'
            };
        }
    } catch (error) {
        console.error('❌ [Frontend API] Network or parsing error:', error);
        if (error instanceof Error) {
            console.error('❌ [Frontend API] Error message:', error.message);
            console.error('❌ [Frontend API] Error stack:', error.stack);
        }
        return {
            success: false,
            error: error instanceof Error ? error.message : '網路錯誤'
        };
    }
}

/**
 * 使用自定義提示進行分析
 */
export async function customPromptAnalysis(options: CustomPromptOptions): Promise<CustomPromptResponse> {
    const { systemPrompt, userPrompt } = options;

    if (!systemPrompt || !userPrompt) {
        throw new Error('系統提示和用戶提示都不能為空');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemPrompt,
                userPrompt,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            // Handle specific authentication and authorization errors
            if (response.status === 401) {
                throw new Error(errorData.requiresAuth ? 
                    '請先登入才能使用此功能' : 
                    (errorData.error || '身份驗證失敗，請重新登入')
                );
            }
            
            if (response.status === 403) {
                throw new Error(errorData.requiresProPlan ? 
                    '此功能僅限 Pro 會員使用，請升級您的方案後重試' : 
                    (errorData.error || '權限不足')
                );
            }
            
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Custom prompt analysis error:', error);
        throw error instanceof Error ? error : new Error('自定義分析請求失敗');
    }
}

/**
 * 批次分析多個履歷
 */
export async function batchAnalyzeResumes(options: BatchAnalysisOptions): Promise<BatchAnalysisResult> {
    const { resumes } = options;

    if (!resumes || resumes.length === 0) {
        throw new Error('履歷列表不能為空');
    }

    const results: BatchAnalysisResult = {
        successful: [],
        failed: [],
        summary: {
            total: resumes.length,
            successful: 0,
            failed: 0
        }
    };

    // 並行處理所有履歷
    const promises = resumes.map(async (resume) => {
        try {
            const response = await analyzeResume({ resume });
            
            if (response.success && response.data) {
                results.successful.push(response.data);
                results.summary.successful++;
            } else {
                throw new Error(response.error || '分析失敗');
            }
        } catch (error) {
            results.failed.push({
                resume: resume.substring(0, 100) + '...',
                error: error instanceof Error ? error.message : '未知錯誤'
            });
            results.summary.failed++;
        }
    });

    await Promise.allSettled(promises);
    return results;
}

/**
 * 驗證文件類型
 */
export function validateFileType(fileName: string): boolean {
    const supportedExtensions = [
        'pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp',
        'txt', 'md', 'json', 'csv'
    ];
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension ? supportedExtensions.includes(extension) : false;
}

/**
 * 獲取文件類型分類
 */
export function getFileTypeCategory(fileName: string): 'PDF' | 'IMAGES' | 'DOCUMENTS' | null {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return null;

    if (extension === 'pdf') return 'PDF';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'IMAGES';
    if (['txt', 'md', 'json', 'csv'].includes(extension)) return 'DOCUMENTS';
    
    return null;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 檢查文件是否需要 Vision 模型
 */
export function requiresVisionModel(files: File[]): boolean {
    return files.some(file => {
        const category = getFileTypeCategory(file.name);
        return category === 'PDF' || category === 'IMAGES';
    });
}

/**
 * 計算總文件大小
 */
export function getTotalFileSize(files: File[]): number {
    return files.reduce((total, file) => total + file.size, 0);
}

// React Hook 風格的 API（可選）
export function useResumeAnalysis() {
    return {
        analyzeResume,
        analyzeDocuments,
        customPromptAnalysis,
        batchAnalyzeResumes,
        validateFileType,
        getFileTypeCategory,
        formatFileSize,
        requiresVisionModel,
        getTotalFileSize
    };
} 