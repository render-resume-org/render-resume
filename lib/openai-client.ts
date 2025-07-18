import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from '@langchain/openai';
import { z } from 'zod';
import {
    DEFAULT_AI_CONFIG,
    generateSystemPrompt
} from './config/resume-analysis-config';
import { Education, Experience, Project, PersonalInfo, Links } from '@/lib/upload-utils';

// 重新導出 AIConfig，保持向後兼容
export interface AIConfig {
    modelName?: string;
    temperature?: number;
    systemPrompt?: string;
    maxConcurrency?: number;
}

// 內部使用的完整配置接口，確保必要欄位存在
interface InternalAIConfig {
    modelName: string;
    temperature: number;
    systemPrompt: string;
    maxConcurrency?: number;
}

// 支援的文檔類型
export const SUPPORTED_FILE_TYPES = {
    PDF: ['pdf'],
    IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    DOCUMENTS: ['txt', 'md', 'json', 'csv'] // 這些需要轉換為文字
} as const;

export type SupportedFileType = keyof typeof SUPPORTED_FILE_TYPES;

// 文檔上傳介面
export interface DocumentUpload {
    file: File | Buffer;
    fileName: string;
    fileType: string;
    content?: string; // 預處理的文字內容
}

export interface FileAnalysisOptions {
    documents: DocumentUpload[];
    additionalText?: string;
    education?: Education[];
    experience?: Experience[];
    projects?: Project[];
    skills?: string;
    personalInfo?: PersonalInfo;
    links?: Links;
    useVision?: boolean; // 是否使用 Vision 模型處理圖片/PDF
}

// 移除舊的 resumeAnalysisConfig，改用動態配置
export const DEFAULT_CONFIG: AIConfig = {
    modelName: DEFAULT_AI_CONFIG.modelName,
    temperature: DEFAULT_AI_CONFIG.temperature ?? 0.1,
    systemPrompt: generateSystemPrompt(),
    maxConcurrency: DEFAULT_AI_CONFIG.maxConcurrency
};

// 定義回應的 Schema
export const ResumeAnalysisSchema = z.object({
    profile: z.object({
        name: z.string().describe("候選人姓名").optional(),
        title: z.string().describe("專業頭銜").optional(),
        brief_introduction: z.string().describe("個人簡介").optional(),
        email: z.string().describe("電子郵件").optional(),
        phone: z.string().describe("電話號碼").optional(),
        location: z.string().describe("所在地點").optional(),
        linkedin: z.string().describe("LinkedIn連結").optional(),
        github: z.string().describe("GitHub連結").optional(),
        website: z.string().describe("個人網站").optional(),
        portfolio: z.string().describe("作品集連結").optional()
    }).describe("個人基本資料").optional(),
    projects: z.array(z.object({
        name: z.string().describe("項目名稱").optional(),
        description: z.string().describe("技術挑戰與解決方案").optional(),
        technologies: z.array(z.string()).describe("使用的技術").optional(),
        role: z.string().describe("擔任角色").optional(),
        contribution: z.string().describe("貢獻").optional(),
        duration: z.string().describe("進行期間").optional()
    })),
    expertise: z.array(z.string()).describe("完整技術聯集列表"),
    projects_summary: z.string().describe("項目摘要").optional(),
    expertise_summary: z.string().describe("技能摘要").optional(),
    work_experiences: z.array(z.object({
        company: z.string().describe("公司名稱").optional(),
        position: z.string().describe("職位").optional(),
        duration: z.string().describe("工作期間").optional(),
        description: z.string().describe("工作描述").optional(),
        contribution: z.string().describe("個人貢獻").optional(),
        technologies: z.array(z.string()).describe("使用的技術").optional()
    })),
    work_experiences_summary: z.string().describe("工作經驗摘要").optional(),
    education_background: z.array(z.object({
        institution: z.string().describe("學校名稱").optional(),
        degree: z.string().describe("學位").optional(),
        major: z.string().describe("主修科系").optional(),
        duration: z.string().describe("在學期間").optional(),
        gpa: z.string().describe("成績").optional(),
        courses: z.array(z.string()).describe("相關課程").optional(),
        achievements: z.array(z.string()).describe("學術成就").optional()
    })),
    education_summary: z.string().describe("教育背景摘要").optional(),
    achievements: z.array(z.string()).describe("成就列表").optional(),
    achievements_summary: z.string().describe("成就摘要").optional(),
    missing_content: z.object({
        critical_missing: z.array(z.string()).describe("關鍵缺失項目"),
        recommended_additions: z.array(z.string()).describe("建議補充內容"),
        impact_analysis: z.string().describe("缺失內容對整體評估的影響分析"),
        priority_suggestions: z.array(z.string()).describe("優先補強建議"),
        follow_ups: z.array(z.object({
            title: z.string().describe("問題標題"),
            question: z.string().describe("互動式問題內容")
        })).describe("互動式後續問題，協助補齊缺失資料")
    }).describe("缺失內容分析"),
    scores: z.array(z.object({
        category: z.string().describe("評分類別"),
        grade: z.enum(['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'] as const).describe('Grade (A+, A, A-, B+, B, B-, C+, C, C-, D, F)'),
        description: z.string().describe("評分描述"),
        comment: z.string().describe("AI評語"),
        icon: z.string().describe("圖示表情符號"),
    })).describe("技術履歷細節完整度評分列表")
});

export type ResumeAnalysisResult = z.infer<typeof ResumeAnalysisSchema>;

export interface OpenAIClientOptions {
    apiKey?: string;
    config?: AIConfig;
}

/**
 * Dynamically converts a Zod schema to JSON Schema format for LangChain structured output
 * This ensures that any changes to the Zod schema are automatically reflected in the JSON schema
 */
function zodToJsonSchema(zodSchema: z.ZodSchema): Record<string, unknown> {
    console.log('🔄 [Schema Converter] Converting Zod schema to JSON schema dynamically');
    
    function convertZodType(schema: z.ZodSchema): Record<string, unknown> {
         
        const zodType = schema._def as unknown; // Keep as unknown
        
        // Handle ZodObject
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodObject') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shape = (zodType as any).shape();
            const properties: Record<string, unknown> = {};
            const required: string[] = [];
            
            for (const [key, value] of Object.entries(shape)) {
                const fieldSchema = value as z.ZodSchema;
                properties[key] = convertZodType(fieldSchema);
                
                // Check if field is required (not optional)
                if (!fieldSchema.isOptional()) {
                    required.push(key);
                }
            }
            
            return {
                type: "object",
                properties,
                ...(required.length > 0 && { required })
            };
        }
        
        // Handle ZodArray
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodArray') {
            return {
                type: "array",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items: convertZodType((zodType as any).type)
            };
        }
        
        // Handle ZodString
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodString') {
            const result: Record<string, unknown> = { type: "string" };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((zodType as any).description) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result.description = (zodType as any).description;
            }
            return result;
        }
        
        // Handle ZodNumber
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodNumber') {
            const result: Record<string, unknown> = { type: "number" };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((zodType as any).description) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result.description = (zodType as any).description;
            }
            return result;
        }
        
        // Handle ZodBoolean
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodBoolean') {
            const result: Record<string, unknown> = { type: "boolean" };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((zodType as any).description) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                result.description = (zodType as any).description;
            }
            return result;
        }
        
        // Handle ZodOptional
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodOptional') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return convertZodType((zodType as any).innerType);
        }
        
        // Handle ZodNullable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodNullable') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const innerSchema = convertZodType((zodType as any).innerType);
            if (typeof innerSchema === 'object' && innerSchema !== null && 'type' in innerSchema) {
                return {
                    ...innerSchema,
                    type: [innerSchema.type, "null"]
                };
            }
            return innerSchema;
        }
        
        // Handle ZodUnion (for nullable types)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((zodType as any).typeName === 'ZodUnion') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options = (zodType as any).options;
            // Check if it's a union with null (nullable)
            const hasNull = options.some((opt: z.ZodSchema) => (opt._def as unknown as { typeName: string }).typeName === 'ZodNull');
            if (hasNull && options.length === 2) {
                const nonNullOption = options.find((opt: z.ZodSchema) => (opt._def as unknown as { typeName: string }).typeName !== 'ZodNull');
                if (nonNullOption) {
                    const innerSchema = convertZodType(nonNullOption);
                    if (typeof innerSchema === 'object' && innerSchema !== null && 'type' in innerSchema) {
                        return {
                            ...innerSchema,
                            type: [innerSchema.type, "null"]
                        };
                    }
                }
            }
            // For other unions, return the first option (simplified)
            return convertZodType(options[0]);
        }
        
        // Default fallback
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.warn(`⚠️ [Schema Converter] Unsupported Zod type: ${(zodType as any).typeName}, defaulting to string`);
        return { type: "string" };
    }
    
    const convertedSchema = convertZodType(zodSchema);
    const jsonSchema = {
        title: "DynamicSchema",
        description: "Dynamically generated schema from Zod",
        ...convertedSchema
    };
    
    console.log('✅ [Schema Converter] Successfully converted Zod schema to JSON schema');
    
    // Safe access to properties
    const properties = 'properties' in jsonSchema ? jsonSchema.properties : {};
    if (properties && typeof properties === 'object') {
        console.log('📋 [Schema Converter] Generated schema keys:', Object.keys(properties));
    }
    
    return jsonSchema;
}

/**
 * OpenAI Client with Enhanced Validation
 * 
 * This client implements a dual-layer validation approach:
 * 1. PRIMARY: LangChain native structured output validation
 *    - Uses withStructuredOutput() for automatic JSON schema validation
 *    - Leverages OpenAI's JSON mode for more reliable structured responses
 *    - Provides better error handling and automatic retries
 * 
 * 2. SECONDARY: Zod validation as a fallback layer
 *    - Validates the LangChain output against TypeScript types
 *    - Provides additional type safety and runtime validation
 *    - Handles edge cases and data transformation (e.g., achievements format)
 * 
 * Fallback Strategy:
 * - If LangChain structured output fails, falls back to manual JSON parsing
 * - If Zod validation fails but LangChain validation passes, uses LangChain result
 * - Comprehensive error logging for debugging validation issues
 * 
 * Features:
 * - Automatic schema conversion from Zod to JSON Schema for LangChain
 * - Post-processing for achievement format normalization
 * - Detailed logging for validation success/failure tracking
 * - Graceful degradation to original parsing methods
 */
export class OpenAIClient {
    private chatModel: ChatOpenAI;
    private visionModel: ChatOpenAI;
    private structuredChatModel: Runnable; // LangChain structured output model
    private structuredVisionModel: Runnable; // LangChain structured output model
    private config: InternalAIConfig;
    private jsonParser: JsonOutputParser;

    constructor(options: OpenAIClientOptions = {}) {
        console.log('🤖 [OpenAI Client] Initializing with options:', {
            modelName: options.config?.modelName || DEFAULT_AI_CONFIG.modelName,
            temperature: options.config?.temperature || DEFAULT_AI_CONFIG.temperature,
            hasSystemPrompt: !!(options.config?.systemPrompt),
            dynamicPrompt: !options.config?.systemPrompt
        });

        // 確保 apiKey 有值，如果沒有提供則從環境變數取得
        const apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
        if (!apiKey) {
            console.warn('⚠️ [OpenAI Client] No API key provided, client may not function properly');
        }

        // 使用提供的配置或預設配置，並確保必要欄位存在
        const systemPrompt = options.config?.systemPrompt || generateSystemPrompt();
        
        this.config = {
            modelName: options.config?.modelName || DEFAULT_AI_CONFIG.modelName,
            temperature: options.config?.temperature ?? DEFAULT_AI_CONFIG.temperature ?? 0.2,
            systemPrompt: systemPrompt,
            maxConcurrency: options.config?.maxConcurrency ?? DEFAULT_AI_CONFIG.maxConcurrency
        };

        console.log('📋 [OpenAI Client] Final config:', {
            modelName: this.config.modelName,
            temperature: this.config.temperature,
            promptLength: this.config.systemPrompt.length
        });
        
        // Initialize JSON parser for LangChain structured output
        this.jsonParser = new JsonOutputParser();
        
        this.chatModel = new ChatOpenAI({
            apiKey: apiKey,
            temperature: this.config.temperature,
            modelName: this.config.modelName,
        });

        // Vision 模型用於處理圖片和 PDF
        this.visionModel = new ChatOpenAI({
            apiKey: apiKey,
            temperature: this.config.temperature,
            modelName: "gpt-4.1-mini", // 使用支援 Vision 的模型
        });

        // Initialize structured output models with LangChain native validation
        try {
            console.log('🔄 [OpenAI Client] Dynamically generating JSON schema from Zod schema...');
            
            // Dynamically convert Zod schema to JSON schema
            const dynamicJsonSchema = zodToJsonSchema(ResumeAnalysisSchema);
            
            console.log('✅ [OpenAI Client] Dynamic JSON schema generated successfully');
            console.log('📋 [OpenAI Client] Schema structure:', JSON.stringify(dynamicJsonSchema, null, 2));

            // Create structured output models using LangChain native format validation
            this.structuredChatModel = this.chatModel.withStructuredOutput(dynamicJsonSchema, {
                method: "json_mode"
            });
            
            this.structuredVisionModel = this.visionModel.withStructuredOutput(dynamicJsonSchema, {
                method: "json_mode"
            });
            
            console.log('✅ [OpenAI Client] LangChain structured output models initialized successfully with dynamic schema');
        } catch (error) {
            console.warn('⚠️ [OpenAI Client] Failed to initialize structured output models, falling back to regular models:', error);
            // Fallback to regular models if structured output fails
            this.structuredChatModel = this.chatModel;
            this.structuredVisionModel = this.visionModel;
        }
    }

    // 智能解析 AI 回應中的 JSON
    private parseAIResponse(content: string): unknown {
        console.log('🔍 [OpenAI Client] Starting smart JSON parsing');
        
        // 移除所有可能的 markdown 代碼塊標記
        let cleanContent = content;
        
        // 處理 ```json...``` 格式
        const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
        const jsonBlockMatch = cleanContent.match(jsonBlockRegex);
        if (jsonBlockMatch) {
            console.log('📋 [OpenAI Client] Found JSON code block, extracting...');
            cleanContent = jsonBlockMatch[1];
        }
        
        // 處理單獨的 ``` 包圍的內容
        const codeBlockRegex = /```\s*([\s\S]*?)\s*```/;
        const codeBlockMatch = cleanContent.match(codeBlockRegex);
        if (codeBlockMatch && !jsonBlockMatch) {
            console.log('📋 [OpenAI Client] Found generic code block, extracting...');
            cleanContent = codeBlockMatch[1];
        }
        
        // 尋找 JSON 對象 - 從第一個 { 到最後一個 }
        const jsonObjectRegex = /\{[\s\S]*\}/;
        const jsonObjectMatch = cleanContent.match(jsonObjectRegex);
        if (jsonObjectMatch) {
            console.log('📋 [OpenAI Client] Found JSON object pattern');
            cleanContent = jsonObjectMatch[0];
        }
        
        // 清理常見的非 JSON 字符
        cleanContent = cleanContent
            .replace(/^[^\{]*/, '') // 移除開頭非 { 的字符
            .replace(/[^\}]*$/, '') // 移除結尾非 } 的字符
            .trim();
        
        console.log('🧹 [OpenAI Client] Cleaned content length:', cleanContent.length);
        console.log('🧹 [OpenAI Client] First 100 chars:', cleanContent.substring(0, 100));
        
        try {
            const parsed = JSON.parse(cleanContent);
            console.log('✅ [OpenAI Client] Successfully parsed JSON');
            return parsed;
        } catch (error) {
            console.error('❌ [OpenAI Client] JSON parsing failed:', error);
            console.log('📄 [OpenAI Client] Failed content:', cleanContent);
            throw new Error(`無法解析 AI 回應中的 JSON: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // 檢查文件類型
    private getFileType(fileName: string): SupportedFileType | null {
        console.log(`🔍 [OpenAI Client] Analyzing file type for: "${fileName}"`);
        const extension = fileName.split('.').pop()?.toLowerCase();
        console.log(`🔍 [OpenAI Client] Extracted extension: "${extension}"`);
        
        if (!extension) {
            console.log(`❌ [OpenAI Client] No extension found for: "${fileName}"`);
            return null;
        }

        for (const [type, extensions] of Object.entries(SUPPORTED_FILE_TYPES)) {
            console.log(`🔍 [OpenAI Client] Checking type "${type}" with extensions:`, extensions);
            if ((extensions as readonly string[]).includes(extension)) {
                console.log(`✅ [OpenAI Client] Match found: "${fileName}" -> type "${type}"`);
                return type as SupportedFileType;
            }
        }
        
        console.log(`❌ [OpenAI Client] No matching type found for extension "${extension}" in file "${fileName}"`);
        console.log(`🔍 [OpenAI Client] Available extensions:`, SUPPORTED_FILE_TYPES);
        return null;
    }

    // 將文件轉換為 base64（服務器端）
    private async fileToBase64(file: File): Promise<string> {
        if (file instanceof File) {
            // 在服務器端，File 對象需要轉換為 Buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return buffer.toString('base64');
        }
        throw new Error('Invalid file type');
    }

    // 處理文檔上傳和分析
    async analyzeDocuments(options: FileAnalysisOptions): Promise<ResumeAnalysisResult> {
        const { documents, additionalText, useVision = true } = options;
        
        console.log('🔍 [OpenAI Client] Starting document analysis:', {
            documentsCount: documents.length,
            additionalText: additionalText ? 'provided' : 'none',
            useVision,
            fileNames: documents.map(d => d.fileName)
        });
        
        if (documents.length === 0) {
            throw new Error("至少需要上傳一個文檔");
        }

        // 準備消息內容
        const messageContent: Array<{
            type: "text" | "image_url";
            text?: string;
            image_url?: {
                url: string;
                detail: string;
            };
        }> = [];
        let textContent = "";

        for (const doc of documents) {
            console.log(`📄 [OpenAI Client] Processing document: ${doc.fileName}`);
            
            const fileType = this.getFileType(doc.fileName);
            console.log(`📋 [OpenAI Client] File type detected: ${fileType} for ${doc.fileName}`);
            
            if (!fileType) {
                throw new Error(`不支援的文件類型: ${doc.fileName}`);
            }

            if (fileType === 'PDF' || fileType === 'IMAGES') {
                if (useVision) {
                    console.log(`👁️ [OpenAI Client] Using Vision model for ${doc.fileName}`);
                    // 使用 Vision 模型處理圖片和 PDF
                    const base64Content = await this.fileToBase64(doc.file as File);
                    console.log(`📊 [OpenAI Client] Base64 content length: ${base64Content.length} for ${doc.fileName}`);
                    
                    const mimeType = fileType === 'PDF' ? 'application/pdf' : 
                                   doc.fileName.endsWith('.png') ? 'image/png' :
                                   doc.fileName.endsWith('.jpg') || doc.fileName.endsWith('.jpeg') ? 'image/jpeg' :
                                   doc.fileName.endsWith('.gif') ? 'image/gif' :
                                   doc.fileName.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

                    console.log(`🎯 [OpenAI Client] MIME type: ${mimeType} for ${doc.fileName}`);

                    messageContent.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${base64Content}`,
                            detail: "high"
                        }
                    });
                } else {
                    throw new Error(`需要啟用 Vision 模型來處理 ${fileType} 文件`);
                }
            } else if (fileType === 'DOCUMENTS') {
                console.log(`📝 [OpenAI Client] Processing text document: ${doc.fileName}`);
                // 處理文字文檔
                if (doc.content) {
                    textContent += `\n\n=== ${doc.fileName} ===\n${doc.content}`;
                    console.log(`📄 [OpenAI Client] Text content length: ${doc.content.length} for ${doc.fileName}`);
                } else {
                    throw new Error(`文字文檔 ${doc.fileName} 需要提供內容`);
                }
            }
        }

        // 添加文字內容 - Enhanced prompt for structured output
        const promptText = `請分析以下履歷文檔並以 JSON 格式回傳結果：

${textContent}

${additionalText ? `\n額外資訊：\n${additionalText}` : ''}

請以 JSON 格式回傳分析結果，包含以下欄位：
- projects: 專案列表（每個專案包含 name, description, technologies, duration, role, contribution）
- projects_summary: 專案摘要
- expertise: 技能列表
- expertise_summary: 技能摘要
- work_experiences: 工作經驗列表（每個經驗包含 company, position, duration, description, contribution, technologies）
- work_experiences_summary: 工作經驗摘要
- education_background: 教育背景列表（每個教育經歷包含 institution, degree, major, duration, gpa, courses, achievements）
- education_summary: 教育背景摘要
- achievements: 成就列表
- achievements_summary: 成就摘要
- missing_content: 缺失內容分析（包含 critical_missing, recommended_additions, impact_analysis, priority_suggestions, follow_ups）
- scores: 評分列表（每個評分包含 category, grade, description, comment, icon）

特別注意：
1. 對於履歷內容，請盡可能保留所有詳細資訊
2. 僅整合明確提及的資訊，缺失資料必須留空
3. 嚴禁基於部分資訊進行推理或產生幻覺
4. 在 missing_content 中明確指出缺失的關鍵履歷要素
5. 使用 STAR 原則評估項目和工作經驗的完整性
6. missing_content 的 follow_ups 欄位必須包含 3-5 個互動式問題，每個問題需要包含 title（問題標題）和 question（問題內容）。語氣要年輕活潑但專業，協助補齊關鍵缺失資訊，避免生成履歷時產生幻覺。問題應針對具體缺失內容設計，格式為含有 title 和 question 兩個字串屬性的物件。

請確保回傳有效的 JSON 格式。`;

        console.log(`📝 [OpenAI Client] Final prompt text length: ${promptText.length}`);
        console.log(`📝 [OpenAI Client] Message content items: ${messageContent.length}`);

        messageContent.unshift({
            type: "text",
            text: promptText
        });

        // 選擇適當的模型 - Try structured output first
        const useVisionModel = useVision && documents.some(doc => 
            ['PDF', 'IMAGES'].includes(this.getFileType(doc.fileName) || '')
        );

        console.log(`🤖 [OpenAI Client] Using model: ${useVisionModel ? 'Vision (gpt-4.1-mini)' : 'Chat (gpt-4.1-mini)'}`);

        try {
            console.log('🚀 [OpenAI Client] Attempting LangChain structured output...');
            
            // Select the appropriate structured model
            const selectedModel = useVisionModel ? this.structuredVisionModel : this.structuredChatModel;
            
            // Create prompt template for structured output
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", this.config.systemPrompt],
                ["human", messageContent]
            ]);

            const chain = prompt.pipe(selectedModel);
            
            // Invoke with LangChain structured output
            const result = await chain.invoke({});
            console.log('✅ [OpenAI Client] LangChain structured output successful');
            
            // Validate with Zod as secondary validation
            try {
                const validatedResult = ResumeAnalysisSchema.parse(result);
                console.log('✅ [OpenAI Client] Zod secondary validation passed');
                return validatedResult;
            } catch (zodError) {
                console.warn('⚠️ [OpenAI Client] Zod secondary validation failed, but LangChain validation passed:', zodError);
                
                // Post-process achievements if needed
                if (result && typeof result === 'object' && result !== null) {
                    const resultObj = result as Record<string, unknown>;
                    if (resultObj.achievements && Array.isArray(resultObj.achievements) && 
                        resultObj.achievements.length > 0 && 
                        typeof resultObj.achievements[0] === 'object') {
                        
                        console.log('🔄 [OpenAI Client] Converting achievements from object array to string array');
                        resultObj.achievements = resultObj.achievements.map((item: unknown) => {
                            if (typeof item === 'object' && item !== null) {
                                const achievementObj = item as Record<string, unknown>;
                                return String(achievementObj.description || achievementObj.achievement || achievementObj.title || achievementObj.name) || JSON.stringify(item);
                            }
                            return String(item);
                        });
                    }
                    
                    // Try Zod validation again after post-processing
                    try {
                        const revalidatedResult = ResumeAnalysisSchema.parse(resultObj);
                        console.log('✅ [OpenAI Client] Zod validation passed after post-processing');
                        return revalidatedResult;
                    } catch {
                        console.warn('⚠️ [OpenAI Client] Final Zod validation failed, returning LangChain validated result');
                        return result as ResumeAnalysisResult;
                    }
                }
                
                return result as ResumeAnalysisResult;
            }
            
        } catch (structuredError) {
            console.warn('⚠️ [OpenAI Client] LangChain structured output failed, falling back to manual parsing:', structuredError);
            
            // Fallback to original manual parsing method
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", this.config.systemPrompt],
                ["human", "請分析以下履歷內容並以 JSON 格式回傳結果：\n\n履歷內容：\n{resume_content}\n\n額外資訊：\n{additional_text}\n\n請以 JSON 格式回傳分析結果，包含以下欄位：\n- projects: 專案列表（每個專案包含 name, description, technologies, duration, role, contribution）\n- projects_summary: 專案摘要\n- expertise: 技能列表\n- expertise_summary: 技能摘要\n- work_experiences: 工作經驗列表（每個經驗包含 company, position, duration, description, contribution, technologies）\n- work_experiences_summary: 工作經驗摘要\n- education_background: 教育背景列表（每個教育經歷包含 institution, degree, major, duration, gpa, courses, achievements）\n- education_summary: 教育背景摘要\n- achievements: 成就列表\n- achievements_summary: 成就摘要\n- missing_content: 缺失內容分析（包含 critical_missing, recommended_additions, impact_analysis, priority_suggestions, follow_ups）\n- scores: 評分列表（每個評分包含 category, grade, description, comment, icon, suggestions）\n\n特別注意：\n1. 對於履歷內容，請盡可能保留所有詳細資訊\n2. 僅整合明確提及的資訊，缺失資料必須留空\n3. 嚴禁基於部分資訊進行推理或產生幻覺\n4. 在 missing_content 中明確指出缺失的關鍵履歷要素\n5. 使用 STAR 原則評估項目和工作經驗的完整性\n6. missing_content 的 follow_ups 欄位必須包含 3-5 個互動式問題，每個問題需要包含 title（問題標題）和 question（問題內容）。語氣要年輕活潑但專業，協助補齊關鍵缺失資訊，避免生成履歷時產生幻覺。問題應針對具體缺失內容設計，格式為含有 title 和 question 兩個字串屬性的物件。\n\n請嚴格按照上述格式回傳 JSON 結果。"]
            ]);

            const chain = prompt.pipe(this.chatModel);

            try {
                const result = await chain.invoke({
                    resume_content: textContent,
                    additional_text: additionalText || "無"
                });

                // 解析 AI 回應
                const content = result.content as string;
                
                // 使用智能解析方法
                const parsedResult = this.parseAIResponse(content);
                
                // 檢查 achievements 的結構並進行自動轉換
                if (parsedResult && typeof parsedResult === 'object' && parsedResult !== null) {
                    const resultObj = parsedResult as Record<string, unknown>;
                    
                    if (resultObj.achievements && Array.isArray(resultObj.achievements) && 
                        resultObj.achievements.length > 0 && 
                        typeof resultObj.achievements[0] === 'object') {
                        
                        console.log('🔄 [OpenAI Client] Converting achievements from object array to string array (fallback)');
                        resultObj.achievements = resultObj.achievements.map((item: unknown) => {
                            if (typeof item === 'object' && item !== null) {
                                const achievementObj = item as Record<string, unknown>;
                                return String(achievementObj.description || achievementObj.achievement || achievementObj.title || achievementObj.name) || JSON.stringify(item);
                            }
                            return String(item);
                        });
                    }
                } else {
                    throw new Error('解析結果不是有效的對象');
                }
                
                // 使用 Zod 驗證結果
                return ResumeAnalysisSchema.parse(parsedResult);
            } catch (fallbackError) {
                console.error("Resume analysis fallback error:", fallbackError);
                throw new Error(`履歷分析失敗: ${fallbackError instanceof Error ? fallbackError.message : '未知錯誤'}`);
            }
        }
    }

    async analyzeResume(resumeContent: string, additionalText?: string): Promise<ResumeAnalysisResult> {
        try {
            console.log('🚀 [OpenAI Client] Attempting LangChain structured output for resume analysis...');
            
            // Create prompt template for structured output
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", this.config.systemPrompt],
                ["human", "請分析以下履歷內容並以 JSON 格式回傳結果：\n\n履歷內容：\n{resume_content}\n\n額外資訊：\n{additional_text}\n\n請以 JSON 格式回傳分析結果，包含以下欄位：\n- projects: 專案列表（每個專案包含 name, description, technologies, duration, role, contribution）\n- projects_summary: 專案摘要\n- expertise: 技能列表\n- expertise_summary: 技能摘要\n- work_experiences: 工作經驗列表（每個經驗包含 company, position, duration, description, contribution, technologies）\n- work_experiences_summary: 工作經驗摘要\n- education_background: 教育背景列表（每個教育經歷包含 institution, degree, major, duration, gpa, courses, achievements）\n- education_summary: 教育背景摘要\n- achievements: 成就列表\n- achievements_summary: 成就摘要\n- missing_content: 缺失內容分析（包含 critical_missing, recommended_additions, impact_analysis, priority_suggestions, follow_ups）\n- scores: 評分列表（每個評分包含 category, grade, description, comment, icon, suggestions）\n\n特別注意：\n1. 對於履歷內容，請盡可能保留所有詳細資訊\n2. 僅整合明確提及的資訊，缺失資料必須留空\n3. 嚴禁基於部分資訊進行推理或產生幻覺\n4. 在 missing_content 中明確指出缺失的關鍵履歷要素\n5. 使用 STAR 原則評估項目和工作經驗的完整性\n6. missing_content 的 follow_ups 欄位必須包含 3-5 個互動式問題，每個問題需要包含 title（問題標題）和 question（問題內容）。語氣要年輕活潑但專業，協助補齊關鍵缺失資訊，避免生成履歷時產生幻覺。問題應針對具體缺失內容設計，格式為含有 title 和 question 兩個字串屬性的物件。\n\n請確保回傳有效的 JSON 格式。"]
            ]);

            const chain = prompt.pipe(this.structuredChatModel);

            // Invoke with LangChain structured output
            const result = await chain.invoke({
                resume_content: resumeContent,
                additional_text: additionalText || "無"
            });

            console.log('✅ [OpenAI Client] LangChain structured output successful for resume analysis');
            
            // Validate with Zod as secondary validation
            try {
                const validatedResult = ResumeAnalysisSchema.parse(result);
                console.log('✅ [OpenAI Client] Zod secondary validation passed for resume analysis');
                return validatedResult;
            } catch (zodError) {
                console.warn('⚠️ [OpenAI Client] Zod secondary validation failed for resume analysis, but LangChain validation passed:', zodError);
                
                // Post-process achievements if needed
                if (result && typeof result === 'object' && result !== null) {
                    const resultObj = result as Record<string, unknown>;
                    if (resultObj.achievements && Array.isArray(resultObj.achievements) && 
                        resultObj.achievements.length > 0 && 
                        typeof resultObj.achievements[0] === 'object') {
                        
                        console.log('🔄 [OpenAI Client] Converting achievements from object array to string array');
                        resultObj.achievements = resultObj.achievements.map((item: unknown) => {
                            if (typeof item === 'object' && item !== null) {
                                const achievementObj = item as Record<string, unknown>;
                                return String(achievementObj.description || achievementObj.achievement || achievementObj.title || achievementObj.name) || JSON.stringify(item);
                            }
                            return String(item);
                        });
                    }
                    
                    // Try Zod validation again after post-processing
                    try {
                        const revalidatedResult = ResumeAnalysisSchema.parse(resultObj);
                        console.log('✅ [OpenAI Client] Zod validation passed after post-processing for resume analysis');
                        return revalidatedResult;
                    } catch {
                        console.warn('⚠️ [OpenAI Client] Final Zod validation failed for resume analysis, returning LangChain validated result');
                        return result as ResumeAnalysisResult;
                    }
                }
                
                return result as ResumeAnalysisResult;
            }
            
        } catch (structuredError) {
            console.warn('⚠️ [OpenAI Client] LangChain structured output failed for resume analysis, falling back to manual parsing:', structuredError);
            
            // Fallback to original manual parsing method
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", this.config.systemPrompt],
                ["human", "請分析以下履歷內容並以 JSON 格式回傳結果：\n\n履歷內容：\n{resume_content}\n\n額外資訊：\n{additional_text}\n\n請以 JSON 格式回傳分析結果，包含以下欄位：\n- projects: 專案列表（每個專案包含 name, description, technologies, duration, role, contribution）\n- projects_summary: 專案摘要\n- expertise: 技能列表\n- expertise_summary: 技能摘要\n- work_experiences: 工作經驗列表（每個經驗包含 company, position, duration, description, contribution, technologies）\n- work_experiences_summary: 工作經驗摘要\n- education_background: 教育背景列表（每個教育經歷包含 institution, degree, major, duration, gpa, courses, achievements）\n- education_summary: 教育背景摘要\n- achievements: 成就列表\n- achievements_summary: 成就摘要\n- missing_content: 缺失內容分析（包含 critical_missing, recommended_additions, impact_analysis, priority_suggestions, follow_ups）\n- scores: 評分列表（每個評分包含 category, grade, description, comment, icon, suggestions）\n\n特別注意：\n1. 對於履歷內容，請盡可能保留所有詳細資訊\n2. 僅整合明確提及的資訊，缺失資料必須留空\n3. 嚴禁基於部分資訊進行推理或產生幻覺\n4. 在 missing_content 中明確指出缺失的關鍵履歷要素\n5. 使用 STAR 原則評估項目和工作經驗的完整性\n6. missing_content 的 follow_ups 欄位必須包含 3-5 個互動式問題，每個問題需要包含 title（問題標題）和 question（問題內容）。語氣要年輕活潑但專業，協助補齊關鍵缺失資訊，避免生成履歷時產生幻覺。問題應針對具體缺失內容設計，格式為含有 title 和 question 兩個字串屬性的物件。\n\n請嚴格按照上述格式回傳 JSON 結果。"]
            ]);

            const chain = prompt.pipe(this.chatModel);

            try {
                const result = await chain.invoke({
                    resume_content: resumeContent,
                    additional_text: additionalText || "無"
                });

                // 解析 AI 回應
                const content = result.content as string;
                
                // 使用智能解析方法
                const parsedResult = this.parseAIResponse(content);
                
                // 檢查 achievements 的結構並進行自動轉換
                if (parsedResult && typeof parsedResult === 'object' && parsedResult !== null) {
                    const resultObj = parsedResult as Record<string, unknown>;
                    
                    if (resultObj.achievements && Array.isArray(resultObj.achievements) && 
                        resultObj.achievements.length > 0 && 
                        typeof resultObj.achievements[0] === 'object') {
                        
                        console.log('🔄 [OpenAI Client] Converting achievements from object array to string array (fallback)');
                        resultObj.achievements = resultObj.achievements.map((item: unknown) => {
                            if (typeof item === 'object' && item !== null) {
                                const achievementObj = item as Record<string, unknown>;
                                return String(achievementObj.description || achievementObj.achievement || achievementObj.title || achievementObj.name) || JSON.stringify(item);
                            }
                            return String(item);
                        });
                    }
                } else {
                    throw new Error('解析結果不是有效的對象');
                }
                
                // 使用 Zod 驗證結果
                return ResumeAnalysisSchema.parse(parsedResult);
            } catch (fallbackError) {
                console.error("Resume analysis fallback error:", fallbackError);
                throw new Error(`履歷分析失敗: ${fallbackError instanceof Error ? fallbackError.message : '未知錯誤'}`);
            }
        }
    }

    async customPrompt(systemPrompt: string, userInput: string): Promise<string> {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", "{user_input}"]
        ]);

        const chain = prompt.pipe(this.chatModel);

        try {
            const result = await chain.invoke({
                user_input: userInput
            });

            return result.content as string;
        } catch (error) {
            console.error("Custom prompt error:", error);
            throw new Error(`AI 請求失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
        }
    }
}

// 便利函數：快速創建客戶端實例
export function createOpenAIClient(options?: OpenAIClientOptions): OpenAIClient;
export function createOpenAIClient(apiKey?: string, config?: AIConfig): OpenAIClient;
export function createOpenAIClient(
    optionsOrApiKey?: OpenAIClientOptions | string,
    config?: AIConfig
): OpenAIClient {
    // 如果第一個參數是字符串，則使用舊的函數簽名（向後兼容）
    if (typeof optionsOrApiKey === 'string') {
        return new OpenAIClient({
            apiKey: optionsOrApiKey,
            config
        });
    }
    
    // 否則使用新的選項對象簽名
    return new OpenAIClient(optionsOrApiKey);
}

// 文件處理工具函數
export async function processTextFile(file: File): Promise<string> {
    // 在服務器端使用 arrayBuffer 和 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('utf-8');
}

export function validateFileType(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return false;

    return Object.values(SUPPORTED_FILE_TYPES).some(types => 
        (types as readonly string[]).includes(extension)
    );
}

/* 
使用範例：

// 1. 完全使用預設配置（最簡單）
const client1 = createOpenAIClient();

// 2. 只提供 API key，其他使用預設配置
const client2 = createOpenAIClient('your-api-key');

// 3. 使用選項對象方式（推薦）
const client3 = createOpenAIClient({
    apiKey: 'your-api-key',
    config: {
        modelName: 'gpt-4',
        temperature: 0.3
    }
});

// 4. 只覆蓋部分配置
const client4 = createOpenAIClient({
    config: {
        temperature: 0.1  // 只改變溫度，其他使用預設值
    }
});

// 5. 向後兼容的舊式調用
const client5 = createOpenAIClient('api-key', { modelName: 'gpt-3.5-turbo' });

// 6. 完全自定義配置
const client6 = createOpenAIClient({
    apiKey: 'your-api-key',
    config: {
        modelName: 'gpt-4',
        temperature: 0.2,
        systemPrompt: 'Custom system prompt',
        maxConcurrency: 5
    }
});
*/ 