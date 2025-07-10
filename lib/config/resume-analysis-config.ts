export interface ScoreCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    weight: number; // 權重，用於未來可能的加權計算
    criteria: {
        [grade: string]: {
            description: string;
            requirements: string[];
        };
    };
}

export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'F';

export const SCORE_GRADES: LetterGrade[] = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'F'];

// 評分標準定義
export const GRADING_CRITERIA: Record<LetterGrade, { score: number; label: string; description: string }> = {
    'A+': { score: 97, label: '卓越表現', description: '業界頂尖水準（95-100分級別）' },
    'A': { score: 92, label: '優秀表現', description: '高於平均水準（90-94分級別）' },
    'A-': { score: 87, label: '良好表現', description: '穩定優質水準（85-89分級別）' },
    'B+': { score: 82, label: '滿意表現', description: '高於基準要求（80-84分級別）' },
    'B': { score: 77, label: '合格表現', description: '符合基準要求（75-79分級別）' },
    'B-': { score: 72, label: '基本表現', description: '接近基準要求（70-74分級別）' },
    'C+': { score: 65, label: '待改進', description: '低於基準要求（60-69分級別）' },
    'C': { score: 55, label: '需改進', description: '明顯不足（50-59分級別）' },
    'C-': { score: 45, label: '急需改進', description: '嚴重不足（40-49分級別）' },
    'F': { score: 20, label: '不合格', description: '完全不符合要求（39分以下級別）' }
};

// 評分項目配置
export const SCORE_CATEGORIES: ScoreCategory[] = [
    {
        id: 'technical_depth',
        name: '技術深度與廣度',
        description: '技術深度與廣度',
        icon: '💻',
        weight: 25,
        criteria: {
            'A+': {
                description: '技術領域頂尖專家，具備前瞻性技術視野，引領技術趨勢',
                requirements: [
                    '掌握前瞻性技術，引領技術趨勢',
                    '具備完整技術架構設計能力',
                    '在技術領域有深度創新和突破',
                    '具備跨技術棧的整合能力'
                ]
            },
            'A': {
                description: '資深技術專家，具備完整技術棧與架構能力，技術廣度優秀',
                requirements: [
                    '精通多項核心技術',
                    '具備系統架構設計經驗',
                    '擁有豐富的技術選型經驗',
                    '能獨立解決複雜技術問題'
                ]
            },
            'A-': {
                description: '熟練技術人員，具備獨立開發與解決複雜問題能力，技術深度良好',
                requirements: [
                    '熟練掌握主要技術棧',
                    '能獨立完成複雜功能開發',
                    '具備良好的代碼品質意識',
                    '有解決技術難題的經驗'
                ]
            },
            'B+': {
                description: '具備扎實技術能力，能完成中等複雜度技術任務，技術棧完整',
                requirements: [
                    '掌握常用技術工具',
                    '能完成中等複雜度開發任務',
                    '具備基本的最佳實務概念',
                    '有持續學習新技術的能力'
                ]
            },
            'B': {
                description: '具備基礎技術能力，能完成一般性技術任務，技術基礎穩固',
                requirements: [
                    '掌握基礎技術知識',
                    '能完成一般性開發任務',
                    '具備基本的程式設計能力',
                    '理解基本的軟體開發流程'
                ]
            },
            'B-': {
                description: '技術能力初級，能在指導下完成基本技術工作',
                requirements: [
                    '具備入門級技術能力',
                    '需要指導完成基本任務',
                    '正在學習核心技術概念',
                    '有基本的程式設計基礎'
                ]
            },
            'C+': {
                description: '技術能力有限，需要大幅培訓與指導',
                requirements: [
                    '技術能力需要提升',
                    '缺乏實務經驗',
                    '需要系統性培訓',
                    '技術基礎薄弱'
                ]
            },
            'C': {
                description: '技術能力不足，嚴重缺乏實務經驗',
                requirements: [
                    '技術基礎不足',
                    '缺乏實際開發經驗',
                    '需要從基礎開始培訓'
                ]
            },
            'C-': {
                description: '技術能力嚴重不足，無法勝任基本技術工作',
                requirements: [
                    '技術能力嚴重不足',
                    '無法獨立完成基本任務',
                    '需要重新學習技術基礎'
                ]
            },
            'F': {
                description: '技術能力嚴重不足，不符合基本要求',
                requirements: [
                    '完全不符合技術要求',
                    '無相關技術經驗',
                    '不適合技術職位'
                ]
            }
        }
    },
    {
        id: 'project_complexity',
        name: '項目複雜度與影響力',
        description: '項目複雜度與影響力',
        icon: '🚀',
        weight: 25,
        criteria: {
            'A+': {
                description: '主導企業級/產業級重大項目，具備顯著商業影響，創新突破',
                requirements: [
                    '主導企業級或產業級重大項目',
                    '項目具有顯著商業影響力',
                    '在項目中實現創新突破',
                    '具備可量化的重大成果'
                ]
            },
            'A': {
                description: '負責大型複雜項目，具備可量化的重大業務成果',
                requirements: [
                    '負責大型複雜項目的核心開發',
                    '項目具有明確的業務價值',
                    '能量化展示項目成果',
                    '在團隊中發揮關鍵作用'
                ]
            },
            'A-': {
                description: '參與大型項目並擔任核心角色，有明確的重要技術貢獻',
                requirements: [
                    '在大型項目中擔任重要角色',
                    '有明確的技術貢獻',
                    '解決項目中的關鍵技術問題',
                    '項目獲得良好效果'
                ]
            },
            'B+': {
                description: '完成中大型項目，具備明確的技術貢獻與成果展示',
                requirements: [
                    '獨立完成中大型項目',
                    '有明確的技術貢獻',
                    '能展示項目成果',
                    '項目具有一定複雜度'
                ]
            },
            'B': {
                description: '完成中型項目，具備基本的項目執行能力與成果',
                requirements: [
                    '完成中型項目開發',
                    '具備基本項目管理能力',
                    '能展示基本項目成果',
                    '項目按時交付'
                ]
            },
            'B-': {
                description: '參與中小型項目，有一定的項目經驗累積',
                requirements: [
                    '參與中小型項目開發',
                    '有基本項目經驗',
                    '能配合團隊完成任務',
                    '正在累積項目經驗'
                ]
            },
            'C+': {
                description: '項目經驗有限，角色與貢獻度不足',
                requirements: [
                    '項目經驗相對有限',
                    '在項目中角色較為邊緣',
                    '貢獻度有待提升'
                ]
            },
            'C': {
                description: '項目經驗不足，缺乏實質性貢獻',
                requirements: [
                    '項目經驗不足',
                    '缺乏實質性貢獻',
                    '需要更多項目實務經驗'
                ]
            },
            'C-': {
                description: '項目經驗嚴重不足，無重要項目參與',
                requirements: [
                    '幾乎無項目經驗',
                    '無重要項目參與記錄',
                    '缺乏項目實務能力'
                ]
            },
            'F': {
                description: '項目經驗嚴重缺乏，無實質性貢獻',
                requirements: [
                    '完全缺乏項目經驗',
                    '無任何實質性項目貢獻',
                    '不具備項目執行能力'
                ]
            }
        }
    },
    {
        id: 'professional_experience',
        name: '專業經驗完整度',
        description: '專業經驗完整度',
        icon: '💼',
        weight: 20,
        criteria: {
            'A+': {
                description: '職涯軌跡完美，具備戰略思維與卓越領導經驗',
                requirements: [
                    '職涯發展軌跡完美連貫',
                    '具備戰略思維和遠見',
                    '有卓越的領導管理經驗',
                    '在業界有一定影響力'
                ]
            },
            'A': {
                description: '職業發展優秀，具備成熟管理經驗與專業深度',
                requirements: [
                    '職業發展路徑清晰優秀',
                    '具備成熟的管理經驗',
                    '在專業領域有深度積累',
                    '有明確的職涯成長軌跡'
                ]
            },
            'A-': {
                description: '職業發展良好，具備穩定的專業成長軌跡與管理潛力',
                requirements: [
                    '職業發展軌跡良好',
                    '有穩定的專業成長',
                    '展現管理潛力',
                    '專業能力持續提升'
                ]
            },
            'B+': {
                description: '具備完整的職業經驗，專業發展軌跡清晰',
                requirements: [
                    '有完整的職業經驗',
                    '專業發展方向明確',
                    '職位有逐步提升',
                    '具備良好的工作穩定性'
                ]
            },
            'B': {
                description: '基本的職業經驗，具備一定的專業累積',
                requirements: [
                    '有基本的職業經驗',
                    '專業技能有所累積',
                    '工作經歷基本連貫',
                    '展現學習成長能力'
                ]
            },
            'B-': {
                description: '職業經驗尚可，但發展軌跡需要加強',
                requirements: [
                    '職業經驗相對較少',
                    '發展軌跡需要更清晰',
                    '專業深度有待加強',
                    '需要更多經驗累積'
                ]
            },
            'C+': {
                description: '職業經驗不足，缺乏連貫性與深度',
                requirements: [
                    '職業經驗相對不足',
                    '經驗缺乏連貫性',
                    '專業深度不夠',
                    '需要系統性提升'
                ]
            },
            'C': {
                description: '職業經驗明顯不足，發展軌跡不清晰',
                requirements: [
                    '職業經驗明顯不足',
                    '發展軌跡不夠清晰',
                    '缺乏專業深度',
                    '需要更多實務經驗'
                ]
            },
            'C-': {
                description: '職業經驗嚴重不足，無明確發展方向',
                requirements: [
                    '職業經驗嚴重不足',
                    '無明確發展方向',
                    '缺乏專業累積',
                    '職涯規劃需要指導'
                ]
            },
            'F': {
                description: '職業經驗嚴重不足，無法滿足基本要求',
                requirements: [
                    '完全缺乏相關職業經驗',
                    '無法滿足基本職位要求',
                    '需要從基礎開始累積經驗'
                ]
            }
        }
    },
    {
        id: 'education_alignment',
        name: '教育背景與專業匹配度',
        description: '教育背景與專業匹配度',
        icon: '🎓',
        weight: 15,
        criteria: {
            'A+': {
                description: '頂尖學府背景，專業與職涯完美匹配，持續學習能力卓越',
                requirements: [
                    '頂尖學府教育背景',
                    '專業與職涯完美匹配',
                    '持續學習能力卓越',
                    '有優秀的學術成就'
                ]
            },
            'A': {
                description: '優秀教育背景，專業相關性高，學習能力強，持續成長',
                requirements: [
                    '優秀的教育背景',
                    '專業與工作高度相關',
                    '展現強烈學習能力',
                    '有持續的知識更新'
                ]
            },
            'A-': {
                description: '良好教育背景，專業匹配度高，具備良好學習基礎',
                requirements: [
                    '良好的教育背景',
                    '專業匹配度較高',
                    '具備良好學習基礎',
                    '能運用所學於工作'
                ]
            },
            'B+': {
                description: '完整教育背景，專業相關性良好，學習能力穩定',
                requirements: [
                    '完整的教育背景',
                    '專業相關性良好',
                    '學習能力穩定',
                    '基礎知識扎實'
                ]
            },
            'B': {
                description: '基本教育背景，專業相關性一般，具備基礎學習能力',
                requirements: [
                    '基本的教育背景',
                    '專業有一定相關性',
                    '具備基礎學習能力',
                    '能適應工作要求'
                ]
            },
            'B-': {
                description: '教育背景尚可，專業匹配度有改善空間',
                requirements: [
                    '教育背景基本滿足',
                    '專業匹配度需改善',
                    '學習能力有待加強',
                    '需要補強相關知識'
                ]
            },
            'C+': {
                description: '教育背景不足，專業匹配度低',
                requirements: [
                    '教育背景相對不足',
                    '專業匹配度較低',
                    '需要額外培訓',
                    '基礎知識需要補強'
                ]
            },
            'C': {
                description: '教育背景明顯不足，專業相關性差',
                requirements: [
                    '教育背景明顯不足',
                    '專業相關性較差',
                    '需要系統性學習',
                    '基礎能力需要提升'
                ]
            },
            'C-': {
                description: '教育背景嚴重不足，與專業領域差距大',
                requirements: [
                    '教育背景嚴重不足',
                    '與專業領域差距很大',
                    '需要重新學習基礎',
                    '學習能力有問題'
                ]
            },
            'F': {
                description: '教育背景嚴重不足，完全不符合要求',
                requirements: [
                    '教育背景完全不符合',
                    '無相關專業基礎',
                    '不適合相關職位'
                ]
            }
        }
    },
    {
        id: 'achievements_validation',
        name: '成果與驗證',
        description: '成果與驗證',
        icon: '🏆',
        weight: 10,
        criteria: {
            'A+': {
                description: '具備業界認可的重大成就，有權威第三方驗證，影響力卓著',
                requirements: [
                    '業界認可的重大成就',
                    '有權威第三方驗證',
                    '影響力卓著',
                    '成果具有突破性'
                ]
            },
            'A': {
                description: '具備顯著的專業成就，有明確的量化指標與外部認可',
                requirements: [
                    '顯著的專業成就',
                    '明確的量化指標',
                    '獲得外部認可',
                    '成果可驗證'
                ]
            },
            'A-': {
                description: '具備重要的專業成果，有良好的量化數據支撐',
                requirements: [
                    '重要的專業成果',
                    '良好的數據支撐',
                    '成果具體可見',
                    '有一定影響力'
                ]
            },
            'B+': {
                description: '具備明確的工作成果，有部分量化指標與驗證',
                requirements: [
                    '明確的工作成果',
                    '部分量化指標',
                    '成果可以驗證',
                    '有實際價值'
                ]
            },
            'B': {
                description: '具備基本的工作成果，有初步的成就展示',
                requirements: [
                    '基本的工作成果',
                    '初步的成就展示',
                    '成果基本可信',
                    '有一定價值'
                ]
            },
            'B-': {
                description: '成就展示尚可，但量化驗證有待加強',
                requirements: [
                    '成就展示尚可',
                    '量化驗證不足',
                    '缺乏具體數據',
                    '成果需要更好展示'
                ]
            },
            'C+': {
                description: '成就展示有限，缺乏有效驗證',
                requirements: [
                    '成就展示較為有限',
                    '缺乏有效驗證',
                    '成果不夠具體',
                    '需要改善表達方式'
                ]
            },
            'C': {
                description: '成就展示不足，無法提供有效證明',
                requirements: [
                    '成就展示明顯不足',
                    '無法提供有效證明',
                    '缺乏具體成果',
                    '表達能力需要提升'
                ]
            },
            'C-': {
                description: '成就展示嚴重不足，無實質性成果',
                requirements: [
                    '成就展示嚴重不足',
                    '無實質性成果',
                    '缺乏工作亮點',
                    '需要積累更多成果'
                ]
            },
            'F': {
                description: '成就展示嚴重不足，無法提供有效證明',
                requirements: [
                    '完全無成就展示',
                    '無任何有效證明',
                    '無工作亮點',
                    '不符合基本要求'
                ]
            }
        }
    },
    {
        id: 'professional_image',
        name: '整體專業形象',
        description: '整體專業形象',
        icon: '✨',
        weight: 5,
        criteria: {
            'A+': {
                description: '履歷展現卓越的專業素養與強烈個人品牌，表達完美',
                requirements: [
                    '卓越的專業素養',
                    '強烈的個人品牌',
                    '表達完美清晰',
                    '履歷結構優秀'
                ]
            },
            'A': {
                description: '履歷結構優秀，專業形象清晰，表達能力強',
                requirements: [
                    '履歷結構優秀',
                    '專業形象清晰',
                    '表達能力強',
                    '內容組織良好'
                ]
            },
            'A-': {
                description: '履歷組織良好，專業表達清楚，整體形象佳',
                requirements: [
                    '履歷組織良好',
                    '專業表達清楚',
                    '整體形象佳',
                    '格式規範'
                ]
            },
            'B+': {
                description: '履歷結構完整，專業表達清晰，形象良好',
                requirements: [
                    '履歷結構完整',
                    '專業表達清晰',
                    '形象良好',
                    '內容基本完整'
                ]
            },
            'B': {
                description: '履歷基本完整，表達基本清晰，專業形象合格',
                requirements: [
                    '履歷基本完整',
                    '表達基本清晰',
                    '專業形象合格',
                    '符合基本要求'
                ]
            },
            'B-': {
                description: '履歷組織尚可，表達需要部分改善',
                requirements: [
                    '履歷組織尚可',
                    '表達需要改善',
                    '格式需要調整',
                    '內容需要優化'
                ]
            },
            'C+': {
                description: '履歷結構有問題，表達不夠清晰',
                requirements: [
                    '履歷結構有問題',
                    '表達不夠清晰',
                    '格式需要改進',
                    '內容組織混亂'
                ]
            },
            'C': {
                description: '履歷組織混亂，表達能力不足',
                requirements: [
                    '履歷組織混亂',
                    '表達能力不足',
                    '格式不規範',
                    '內容缺乏重點'
                ]
            },
            'C-': {
                description: '履歷品質差，專業形象不佳',
                requirements: [
                    '履歷品質差',
                    '專業形象不佳',
                    '表達嚴重不清',
                    '格式問題嚴重'
                ]
            },
            'F': {
                description: '履歷品質嚴重不足，無法滿足基本要求',
                requirements: [
                    '履歷品質嚴重不足',
                    '無法滿足基本要求',
                    '完全不符合標準',
                    '需要重新製作'
                ]
            }
        }
    }
];

// 基礎配置
export interface AIConfig {
    modelName: string;
    temperature?: number;
    maxConcurrency?: number;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
    modelName: "gpt-4.1-mini",
    temperature: 0.2,
    maxConcurrency: 3
};

// 從新的 prompts 模組導入系統提示生成器
export {
    generateBaseSystemPrompt,
    generateCreateResumeSystemPrompt,
    generateOptimizeResumeSystemPrompt, generateServiceSpecificSystemPrompt, generateSystemPrompt
} from '../prompts';

// 評分建議生成器
export function generateScoreSuggestions(categoryId: string, grade: LetterGrade): string[] {
    const category = SCORE_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return [];

    const criteria = category.criteria[grade];
    if (!criteria) return [];

    // 基於等級生成改進建議
    const gradeIndex = SCORE_GRADES.indexOf(grade);
    const nextGrades = SCORE_GRADES.slice(0, gradeIndex);
    
    if (nextGrades.length === 0) return ['已達到最高標準，繼續保持卓越表現'];

    const nextGrade = nextGrades[nextGrades.length - 1];
    const nextCriteria = category.criteria[nextGrade];
    
    if (!nextCriteria) return [];

    return nextCriteria.requirements.map(req => `建議：${req}`);
} 