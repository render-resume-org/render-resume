import {
  BarChart3,
  Brain,
  MessageSquare,
  Star,
  Upload,
} from "lucide-react";

export const stats = [
  { number: "6 維度", label: "評分標準" },
  { number: "5 分鐘", label: "優化履歷" },
  { number: "+N%", label: "面試機率" },
];

export const scoreCategories = [
  {
    icon: "💻",
    name: "技術深度與廣度",
    description: "評估技術棧掌握程度、架構設計能力與創新突破",
    weight: "25%"
  },
  {
    icon: "🚀", 
    name: "項目複雜度與影響力",
    description: "分析項目規模、技術挑戰與可量化的商業成果",
    weight: "25%"
  },
  {
    icon: "💼",
    name: "專業經驗完整度", 
    description: "評估職涯發展軌跡、領導能力與管理經驗",
    weight: "20%"
  },
  {
    icon: "🎓",
    name: "教育背景匹配度",
    description: "分析學歷與專業相關性、持續學習能力",
    weight: "15%"
  },
  {
    icon: "🏆",
    name: "成果與驗證",
    description: "識別專業成就、外部認可與量化影響力",
    weight: "10%"
  },
  {
    icon: "✨",
    name: "整體專業形象",
    description: "評估履歷呈現、溝通能力與個人品牌",
    weight: "5%"
  }
];

// Core features data
export const coreFeatures = [
  {
    id: 1,
    icon: Brain,
    title: "AI 智能解析",
    subtitle: "上傳即分析，深度挖掘職涯亮點！",
    description: [
      "還在為如何展現自己的專業能力煩惱嗎？上傳履歷、作品集甚至專案報告書，",
      "AI 馬上為你深度分析技術、項目複雜度和職業成就，給你最專業的履歷優化建議！",
      "不論是技術項目還是管理經驗，瞬間變身履歷達人！"
    ],
    imageSrc: "/images/analyze.png",
    imageAlt: "AI 智能解析界面展示",
    layout: "imageRight" as const
  },
  {
    id: 2,
    icon: Upload,
    title: "智能辨識結果",
    subtitle: "精準識別，自動分類專業技能！",
    description: [
      "上傳文件後不知道 AI 看懂了什麼？別擔心！",
      "系統會清楚展示辨識結果，讓你看到 AI 如何理解你的專業背景，",
      "從技術棧到項目成果，每個細節都透明呈現，確保分析準確無誤！"
    ],
    imageSrc: "/images/recognize.png",
    imageAlt: "智能辨識結果展示",
    layout: "imageLeft" as const
  },
  {
    id: 3,
    icon: BarChart3,
    title: "六維度專業評分",
    subtitle: "深度分析，精準定位職場競爭力！",
    description: [
      "想知道自己的履歷在 HR 眼中到底幾分嗎？不用再猜測了！",
      "基於 Fortune 500 企業標準，從技術深度、項目影響力、專業經驗等六維度評分，",
      "A+ 到 F 的等第評分，讓你清楚知道改進方向，精準提升競爭力！"
    ],
    imageSrc: "/images/grade.png",
    imageAlt: "六維度評分雷達圖展示",
    layout: "imageRight" as const
  },
  {
    id: 4,
    icon: MessageSquare,
    title: "智能問答優化",
    subtitle: "對話互動，挖掘更多履歷亮點！",
    description: [
      "擔心遺漏了重要的經歷或技能嗎？別怕！",
      "AI 會透過智能問答，針對你的背景提出精準問題，引導你補充有價值的細節，",
      "確保每一個履歷亮點都不被埋沒！就像有專業顧問在身邊一對一指導！"
    ],
    imageSrc: "/images/chat.png",
    imageAlt: "AI 智能問答界面展示",
    layout: "imageLeft" as const
  },
  {
    id: 5,
    icon: Star,
    title: "STAR 原則重構",
    subtitle: "一鍵套版，高效佈局，讓經歷說話更有力！",
    description: [
      "是不是常常覺得工作經歷寫得平淡無奇，無法突出自己的價值？",
      "AI 採用國際認可的 STAR 方法論，自動將你的經歷重構為：情境描述 → 任務界定 → 行動策略 → 成果量化，",
      "一鍵套版，節省寶貴時間！讓每一段經歷都有說服力，HR 一眼就能看見你的價值！"
    ],
    imageSrc: "/images/preview.png",
    imageAlt: "STAR 原則重構展示",
    layout: "imageRight" as const
  },
]; 