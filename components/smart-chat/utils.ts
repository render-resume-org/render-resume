// =====================
// Helper Functions & Constants
// =====================

// 罐頭訊息
export const CANNED_MESSAGES = [
  "你先問我！",
  '下一題！',
  "我的專案經驗夠吸引人嗎？",
  "我的技能描述可以怎麼改善？",
  "工作經驗的描述有什麼問題？",
  "如何讓我的成就更突出？",
  "履歷格式有什麼建議？",
  "我缺少哪些關鍵資訊？",
  "如何量化我的工作成果？",
  "我的履歷適合哪些職位？",
  "如何突出我的領導能力？",
  "我的教育背景需要補強嗎？"
];

export function getRandomCannedMessages(): string[] {
  const fixedFirst = CANNED_MESSAGES[0]; // "你先問我！"
  const others = CANNED_MESSAGES.slice(2);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return [fixedFirst, ...shuffled.slice(0, 3)];
}

// 相似度閾值設定（集中管理，方便調整與維護）
export const SIMILARITY_THRESHOLDS = {
  suggestionToSuggestion: 0.90, // 建議與建議
  excerptTitle: 0.8,           // excerpt 與 excerpt 標題
  excerptContent: 0.7,         // excerpt 與 excerpt 內容
  templateMatch: 0.15,          // excerpt/template 與模板的相似度
};

// 消息動畫變體
export const messageVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2
    }
  }
}; 