import { createNativeOpenAIClient } from '@/services/openai-client-native';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface VisionContentItem {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: { url: string; detail?: 'low' | 'high' };
}

export interface VisionMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | VisionContentItem[];
}

export interface OpenAIChatCompletionChoice { index: number; message: { role: string; content: string }; finish_reason: string; }
export interface OpenAIChatCompletionResponse { id: string; object: string; created: number; model: string; choices: OpenAIChatCompletionChoice[]; usage?: unknown; system_fingerprint?: string; }

export async function callOpenAIJson<T>(
  client: ReturnType<typeof createNativeOpenAIClient>,
  system: string,
  user: string,
  temperature: number = (client as unknown as { config?: { temperature?: number } }).config?.temperature ?? 0.2,
): Promise<T> {
  const req = {
    model: (client as unknown as { config?: { modelName?: string } }).config?.modelName || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system } as OpenAIMessage,
      { role: 'user', content: user } as OpenAIMessage
    ],
    temperature,
    response_format: { type: 'json_object' as const }
  };
  const response = await (client as unknown as { callOpenAI: (r: typeof req) => Promise<OpenAIChatCompletionResponse> }).callOpenAI(req);
  const content = response?.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('OpenAI 回傳內容為空');
  return JSON.parse(content) as T;
}

export async function callOpenAIJsonWithVision<T>(
  client: ReturnType<typeof createNativeOpenAIClient>,
  system: string,
  items: VisionContentItem[],
  userText: string = '請針對提供的資源輸出 JSON 結果',
  temperature: number = (client as unknown as { config?: { temperature?: number } }).config?.temperature ?? 0.1,
): Promise<T> {
  const req = {
    model: (client as unknown as { config?: { modelName?: string } }).config?.modelName || 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system } as VisionMessage,
      { role: 'user', content: [{ type: 'text', text: userText }, ...items] } as VisionMessage
    ],
    temperature,
    response_format: { type: 'json_object' as const }
  };
  const response = await (client as unknown as { callOpenAI: (r: typeof req) => Promise<OpenAIChatCompletionResponse> }).callOpenAI(req as typeof req);
  const content = response?.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error('OpenAI 回傳內容為空');
  return JSON.parse(content) as T;
}

export async function fileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('base64');
}
