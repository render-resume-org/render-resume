// API 請求和回應的型別定義
import { Education, Experience, Project, PersonalInfo, Links } from '@/utils/upload-utils';

export interface AnalysisProject {
    name: string;
    description: string;
    technologies: string[];
    role: string;
    contribution: string;
    duration?: string;
}

export interface WorkExperience {
    company: string;
    position: string;
    duration: string;
    description: string;
    contribution?: string;
    technologies?: string[];
}

export interface EducationBackground {
    institution: string;
    degree: string;
    major: string;
    duration: string;
    gpa?: string;
    courses?: string[];
    achievements?: string[];
}

export interface Profile {
    name?: string;
    title?: string;
    brief_introduction?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    portfolio?: string;
}

// Define letter grade type
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export interface AnalysisScore {
    category: string;
    grade: LetterGrade;
    description: string;
    comment: string;
    icon: string;
    suggestions: string[];
}

export interface MissingContent {
    critical_missing: string[];
    recommended_additions: string[];
    impact_analysis: string;
    priority_suggestions: string[];
    follow_ups: {
        title: string;
        question: string;
    }[];
}

export interface ResumeAnalysisResult {
    profile?: Profile;
    projects: AnalysisProject[];
    expertise: string[];
    projects_summary: string;
    expertise_summary: string;
    work_experiences: WorkExperience[];
    work_experiences_summary: string;
    education_background: EducationBackground[];
    education_summary: string;
    achievements: string[];
    achievements_summary: string;
    missing_content?: MissingContent;
    scores?: AnalysisScore[];
}

// 文檔上傳相關類型
export interface DocumentUploadRequest {
    files: File[];
    additionalText?: string;
    useVision?: boolean;
}

export interface FileUploadMetadata {
    filesProcessed: number;
    fileNames: string[];
    useVision: boolean;
    totalSize?: number;
}

// API 請求參數 - 統一使用 POST
export interface AnalyzeGetParams {
    resume: string;
    text?: string;
}

export interface AnalyzePostBody {
    resume?: string;
    text?: string;
    systemPrompt?: string;
    userPrompt?: string;
    serviceType?: 'create' | 'optimize';
}

// API 回應格式 - 新增 type 欄位區分回應類型
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    details?: string;
    type?: 'text_analysis' | 'document_analysis' | 'custom_prompt';
    metadata?: FileUploadMetadata;
}

export interface ResumeAnalysisResponse extends ApiResponse<ResumeAnalysisResult> {
    type: 'text_analysis';
}

export interface CustomPromptResponse extends ApiResponse<{ result: string }> {
    type: 'custom_prompt';
}

export interface DocumentAnalysisResponse extends ApiResponse<ResumeAnalysisResult> {
    type: 'document_analysis';
    metadata: FileUploadMetadata;
}

// 前端使用的工具函數型別 - 移除 method 參數
export interface ResumeAnalysisOptions {
    resume: string;
    text?: string;
}

export interface DocumentAnalysisOptions {
    files: File[];
    additionalText?: string;
    education?: Education[];
    experience?: Experience[];
    projects?: Project[];
    skills?: string;
    personalInfo?: PersonalInfo;
    links?: Links;
    useVision?: boolean;
}

export interface CustomPromptOptions {
    systemPrompt: string;
    userPrompt: string;
}

// 支援的文件類型
export type SupportedFileExtension = 
    | 'pdf'
    | 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp'
    | 'txt' | 'md' | 'json' | 'csv';

export interface FileValidationResult {
    isValid: boolean;
    fileType?: 'PDF' | 'IMAGES' | 'DOCUMENTS';
    error?: string;
}

// 批次分析類型
export interface BatchAnalysisOptions {
    resumes: string[];
    batchSize?: number;
    concurrency?: number;
    onProgress?: (progress: { completed: number; total: number; current?: string }) => void;
    onError?: (error: Error, resume: string) => void;
}

export interface BatchAnalysisResult {
    successful: ResumeAnalysisResult[];
    failed: Array<{ resume: string; error: string }>;
    summary: {
        total: number;
        successful: number;
        failed: number;
    };
}

// 統一的分析選項類型
export type AnalysisOptions = 
    | ResumeAnalysisOptions 
    | DocumentAnalysisOptions 
    | CustomPromptOptions;

// 統一的分析回應類型
export type AnalysisResponse = 
    | ResumeAnalysisResponse 
    | DocumentAnalysisResponse 
    | CustomPromptResponse; 