import {
  BarChart3,
  Brain,
  MessageSquare,
  Star,
  Upload,
} from "lucide-react";

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
      name: "小雅",
      handle: "xiaoya_dev",
    },
    content: "不知道有沒有人也是這樣，有東西能放作品集，但一直懶得整理😰 明明做過很多專案，卻不知道怎麼呈現比較好...",
    likes: 342,
    replies: 89,
    reposts: 23,
    shares: 45,
  },
  {
    author: {
      name: "阿哲",
      handle: "azhe_dev",
    },
    content: "每次投履歷都石沉大海，不知道是不是履歷寫得太爛了...感覺自己明明有實力，但就是不太會包裝😭",
    likes: 156,
    replies: 45,
    reposts: 12,
    shares: 23,
  },
  {
    author: {
      name: "大貓",
      handle: "damao_dev",
    },
    content: "看到別人的漂亮履歷就覺得自己寫的好醜😢 而且不知道該突出什麼重點，感覺什麼都想寫但什麼都寫不好",
    likes: 89,
    replies: 67,
    reposts: 8,
    shares: 15,
  },
  {
    author: {
      name: "阿傑",
      handle: "ajay_fullstack",
    },
    content: "看了好多求職分享文還是不知道從何開始，我的經歷不多，要怎麼寫才能被看見啊？",
    likes: 234,
    replies: 34,
    reposts: 15,
    shares: 28,
  },
  {
    author: {
      name: "小卡",
      handle: "caca_ui_designer",
    },
    content: "好不容易寫完履歷，但也不知道寫出來的履歷有沒有競爭力…",
    likes: 189,
    replies: 28,
    reposts: 9,
    shares: 12,
  },
  {
    author: {
      name: "阿明",
      handle: "ming_backend",
    },
    content: "最煩的是每次都要根據不同職位調整履歷，超級麻煩又花時間！",
    likes: 156,
    replies: 42,
    reposts: 11,
    shares: 18,
  },
  {
    author: {
      name: "小美",
      handle: "mei_product_manager",
    },
    content: "每次寫履歷都要花很多心力在調整版面設計，有沒有專業又富有設計感的履歷模板啊？",
    likes: 203,
    replies: 56,
    reposts: 18,
    shares: 31,
  },
  {
    author: {
      name: "大雄",
      handle: "daxiong_data_analyst",
    },
    content: "對於哪種履歷格式較合適好像眾說紛紜，到底要用怎樣的格式比較好啊？",
    likes: 278,
    replies: 73,
    reposts: 24,
    shares: 42,
  }
];

// Before & After section data
export const beforeAfterData = {
  before: {
    title: "使用 RenderResume 之前",
    subtitle: "傳統履歷的常見問題",
    imagePlaceholder: "before-resume-placeholder.jpg",
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
    imagePlaceholder: "after-resume-placeholder.jpg",
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