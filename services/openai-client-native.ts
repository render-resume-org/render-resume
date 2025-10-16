// 重新導出 AIConfig，保持向後兼容
export interface AIConfig {
    modelName?: string;
    temperature?: number;
    systemPrompt?: string;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    seed?: number;
    service_tier?: string;
    reasoning_effort?: string;
}

// 內部使用的完整配置接口，確保必要欄位存在
interface InternalAIConfig {
    modelName: string;
    temperature: number;
    systemPrompt: string;
    maxTokens?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    seed?: number;
    service_tier?: string;
    reasoning_effort?: string;
}

// 預設 AI 配置
export const DEFAULT_AI_CONFIG: AIConfig = {
    modelName: "gpt-5-mini",
    temperature: 1,
    service_tier: "priority",
    reasoning_effort: "low",
};

// 支援的文檔類型
export const SUPPORTED_FILE_TYPES = {
    PDF: ['pdf'],
    IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    DOCUMENTS: ['txt', 'md', 'json', 'csv']
} as const;

export type SupportedFileType = keyof typeof SUPPORTED_FILE_TYPES;

// OpenAI API 介面定義
interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{
        type: 'text' | 'image_url';
        text?: string;
        image_url?: {
            url: string;
            detail?: string;
        };
    }>;
}

interface OpenAIChatCompletionRequest {
    model: string;
    messages: OpenAIMessage[];
    temperature?: number;
    max_tokens?: number;
    response_format?: {
        type: 'json_object' | 'json_schema';
        json_schema?: {
            name: string;
            schema: Record<string, unknown>;
            strict?: boolean;
        };
    };
    seed?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    user?: string;
    service_tier?: string;
    reasoning_effort?: string;
}

interface OpenAIChatCompletionChoice {
    index: number;
    message: {
        role: string;
        content: string;
    };
    finish_reason: string;
}

interface OpenAIChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: OpenAIChatCompletionChoice[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    system_fingerprint?: string;
}

export interface NativeOpenAIClientOptions {
    apiKey?: string;
    config?: AIConfig;
    baseURL?: string;
}

/**
 * Native OpenAI Client with Direct API Integration
 * 
 * This client directly calls OpenAI's REST API while maintaining all LangChain configurations:
 * 
 * Features:
 * - Direct OpenAI API calls using fetch
 * - Structured output using OpenAI's native JSON schema mode
 * - Vision model support for image and PDF processing
 * - Automatic JSON schema conversion from Zod schemas
 * - Comprehensive error handling and validation
 * - Maintains compatibility with existing LangChain-based code
 * - Uses exact same configuration and prompts as LangChain version
 */
export class NativeOpenAIClient {
    private apiKey: string;
    private config: InternalAIConfig;
    private baseURL: string;

    constructor(options: NativeOpenAIClientOptions = {}) {
        console.log('🤖 [Native OpenAI Client] Initializing with options:', {
            modelName: options.config?.modelName || DEFAULT_AI_CONFIG.modelName,
            temperature: options.config?.temperature || DEFAULT_AI_CONFIG.temperature,
            hasSystemPrompt: !!(options.config?.systemPrompt),
            dynamicPrompt: !options.config?.systemPrompt,
            baseURL: options.baseURL || 'https://api.openai.com/v1'
        });

        // 確保 apiKey 有值，如果沒有提供則從環境變數取得
        this.apiKey = options.apiKey || process.env.OPENAI_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ [Native OpenAI Client] No API key provided, client may not function properly');
        }
        
        this.baseURL = options.baseURL || 'https://api.openai.com/v1';
        
        // 使用提供的配置或預設配置，並確保必要欄位存在
        const systemPrompt = options.config?.systemPrompt || '';
        
        this.config = {
            modelName: options.config?.modelName || DEFAULT_AI_CONFIG.modelName || "gpt-4.1-mini",
            temperature: options.config?.temperature ?? DEFAULT_AI_CONFIG.temperature ?? 0.2,
            systemPrompt: systemPrompt,
            maxTokens: options.config?.maxTokens,
            topP: options.config?.topP,
            frequencyPenalty: options.config?.frequencyPenalty,
            presencePenalty: options.config?.presencePenalty,
            seed: options.config?.seed,
            service_tier: options.config?.service_tier || DEFAULT_AI_CONFIG.service_tier,
            reasoning_effort: options.config?.reasoning_effort || DEFAULT_AI_CONFIG.reasoning_effort,
        };

        console.log('📋 [Native OpenAI Client] Final config:', {
            modelName: this.config.modelName,
            temperature: this.config.temperature,
            promptLength: this.config.systemPrompt.length
        });
    }

    // 直接調用 OpenAI API
    private async callOpenAI(request: OpenAIChatCompletionRequest): Promise<OpenAIChatCompletionResponse> {
        console.log('🚀 [Native OpenAI Client] Making direct API call to OpenAI');
        console.log('📋 [Native OpenAI Client] Request details:', {
            model: request.model,
            messagesCount: request.messages.length,
            hasResponseFormat: !!request.response_format,
            temperature: request.temperature
        });

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ [Native OpenAI Client] API call failed:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json() as OpenAIChatCompletionResponse;
        console.log('raw response', data)
        console.log('✅ [Native OpenAI Client] API call successful:', {
            id: data.id,
            model: data.model,
            choices: data.choices.length,
            usage: data.usage
        });

        return data;
    }

    async customPrompt(systemPrompt: string, userInput: string): Promise<string> {
        console.log('🚀 [Native OpenAI Client] Making custom prompt call');
        
        const messages: OpenAIMessage[] = [
            {
                role: 'system',
                content: systemPrompt
            },
            {
                role: 'user',
                content: userInput
            }
        ];

        try {
            const request: OpenAIChatCompletionRequest = {
                model: this.config.modelName,
                messages,
                temperature: this.config.temperature,
                service_tier: this.config.service_tier,
                reasoning_effort: this.config.reasoning_effort,
            };

            const response = await this.callOpenAI(request);
            const content = response.choices[0].message.content;
            
            if (!content) {
                throw new Error('No content in response');
            }

            return content;
        } catch (error) {
            console.error("Native OpenAI custom prompt error:", error);
            throw new Error(`AI 請求失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
        }
    }

    /**
     * Vision/文件支援：直接傳遞 messages array，支援 input_file/input_text 格式
     */
    async customPromptWithFiles(messages: OpenAIMessage[]): Promise<string> {
        console.log('🚀 [Native OpenAI Client] Making custom prompt call with files');
        try {
            const request = {
                model: this.config.modelName,
                messages,
                temperature: this.config.temperature,
                service_tier: this.config.service_tier,
                reasoning_effort: this.config.reasoning_effort,
            };
            const response = await this.callOpenAI(request);
            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error('No content in response');
            }
            return content;
        } catch (error) {
            console.error("Native OpenAI custom prompt with files error:", error);
            throw new Error(`AI 請求失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
        }
    }
}

// 便利函數：快速創建客戶端實例
export function createNativeOpenAIClient(options?: NativeOpenAIClientOptions): NativeOpenAIClient;
export function createNativeOpenAIClient(apiKey?: string, config?: AIConfig, baseURL?: string): NativeOpenAIClient;
export function createNativeOpenAIClient(
    optionsOrApiKey?: NativeOpenAIClientOptions | string,
    config?: AIConfig,
    baseURL?: string
): NativeOpenAIClient {
    // 如果第一個參數是字符串，則使用舊的函數簽名（向後兼容）
    if (typeof optionsOrApiKey === 'string') {
        return new NativeOpenAIClient({
            apiKey: optionsOrApiKey,
            config,
            baseURL
        });
    }

    // 否則使用新的選項對象簽名
    return new NativeOpenAIClient(optionsOrApiKey);
}

// 文件處理工具函數
export async function processTextFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('utf-8');
}