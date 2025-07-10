import { SCORE_CATEGORIES } from '../config/resume-analysis-config';
import { generateBaseSystemPrompt } from './base-system-prompt';
import { generateCreateResumeSystemPrompt } from './create-resume-prompt';
import { generateOptimizeResumeSystemPrompt } from './optimize-resume-prompt';

export { generateBaseSystemPrompt } from './base-system-prompt';
export { generateCreateResumeSystemPrompt } from './create-resume-prompt';
export { generateOptimizeResumeSystemPrompt } from './optimize-resume-prompt';
export { generateSmartChatSystemPrompt } from './smart-chat-prompt';

/**
 * 根據服務類型生成對應的系統提示
 * @param serviceType - 服務類型：'create' 或 'optimize'
 * @returns 對應的系統提示字符串
 */
export function generateServiceSpecificSystemPrompt(serviceType: 'create' | 'optimize'): string {
    switch (serviceType) {
        case 'create':
            return generateCreateResumeSystemPrompt(SCORE_CATEGORIES);
        case 'optimize':
            return generateOptimizeResumeSystemPrompt(SCORE_CATEGORIES);
        default:
            return generateBaseSystemPrompt(SCORE_CATEGORIES);
    }
}

/**
 * 生成預設的系統提示（向後兼容）
 * @returns 基礎系統提示字符串
 */
export function generateSystemPrompt(): string {
    return generateBaseSystemPrompt(SCORE_CATEGORIES);
} 