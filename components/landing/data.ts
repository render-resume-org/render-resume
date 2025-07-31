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
    imageSrc: "/images/analyze-screenshot.png",
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
    imageSrc: "/images/recognition-screenshot.png",
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
    imageSrc: "/images/grading-screenshot.png",
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
    imageSrc: "/images/smart-chat-screenshot.png",
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
    imageSrc: "/images/preview-screenshot.png",
    imageAlt: "STAR 原則重構展示",
    layout: "imageRight" as const
  },
]; 

// Threads posts data for before section
export const threadsPosts = [
  {
    author: {
      name: "陳小雅",
      handle: "xiaoya_dev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    content: "不知道有沒有人也是這樣，有東西能放作品集，但一直懶得整理😩 每次要寫履歷的時候才發現，明明做過很多專案，但就是不知道怎麼包裝...",
    timestamp: "2h",
    likes: 342,
    replies: 89,
    reposts: 23,
    shares: 45,
    isThread: true,
    isLastInThread: false,
    index: 0
  },
  {
    author: {
      name: "陳小雅",
      handle: "xiaoya_dev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    content: "而且每次投履歷都石沉大海，不知道是不是履歷寫得太爛了...感覺自己明明有實力，但就是不會包裝 😭 有人推薦好的履歷工具嗎？",
    timestamp: "2h",
    likes: 156,
    replies: 45,
    reposts: 12,
    shares: 23,
    isThread: true,
    isLastInThread: false,
    index: 1
  },
  {
    author: {
      name: "陳小雅",
      handle: "xiaoya_dev",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    content: "真的不想再被履歷搞到焦慮了... #求職焦慮 #履歷困擾",
    timestamp: "2h",
    likes: 89,
    replies: 67,
    reposts: 8,
    shares: 15,
    isThread: true,
    isLastInThread: true,
    index: 2
  },
  {
    author: {
      name: "阿傑",
      handle: "ajay_fullstack",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    content: "完全懂！我之前也是這樣，寫履歷的時候總覺得自己很厲害，但寫出來就變得很平淡...後來發現是沒有用對方法",
    timestamp: "1h",
    likes: 234,
    replies: 34,
    reposts: 15,
    shares: 28,
    isThread: false,
    isLastInThread: false,
    index: 3
  },
  {
    author: {
      name: "小美",
      handle: "mei_ui_designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    content: "我也是！每次看到別人漂亮的履歷就覺得自己寫的好醜...而且不知道該突出什麼重點，感覺什麼都想寫但什麼都寫不好",
    timestamp: "45m",
    likes: 189,
    replies: 28,
    reposts: 9,
    shares: 12,
    isThread: false,
    isLastInThread: false,
    index: 4
  },
  {
    author: {
      name: "阿明",
      handle: "ming_backend",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    content: "最煩的是每次都要根據不同職位調整履歷，但改來改去感覺都差不多...有沒有什麼工具可以自動優化履歷的？",
    timestamp: "30m",
    likes: 156,
    replies: 42,
    reposts: 11,
    shares: 18,
    isThread: false,
    isLastInThread: false,
    index: 5
  }
];

// Before & After section data
export const beforeAfterData = {
  before: {
    title: "使用 RenderResume 之前",
    subtitle: "傳統履歷的常見問題",
    imagePlaceholder: "before-resume-placeholder.jpg", // 用戶會自己放圖片
    issues: [
      "經驗描述空泛，缺乏具體量化成果",
      "技能列表雜亂，無法突出核心競爭力",
      "工作經歷平鋪直敘，沒有故事性",
      "缺乏行業關鍵字，ATS 系統難以識別",
      "版面設計老舊，缺乏現代感",
      "沒有明確的職涯目標定位"
    ]
  },
  after: {
    title: "使用 RenderResume 之後",
    subtitle: "AI 優化後的專業履歷",
    imagePlaceholder: "after-resume-placeholder.jpg", // 用戶會自己放圖片
    highlights: [
      "STAR 原則重構，每段經歷都有說服力",
      "技能分類清晰，核心競爭力一目了然",
      "量化成果突出，具體數據展現價值",
      "行業關鍵字優化，ATS 通過率大幅提升",
      "專業版面設計，符合現代審美標準",
      "精準職涯定位，目標明確具體"
    ]
  }
}; 