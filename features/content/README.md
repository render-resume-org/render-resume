# Content Feature

> 內容模組，負責處理公告、FAQ、靜態頁面等內容相關功能

## 目錄結構

```
features/content/
├── components/        # UI 組件
├── lib/               # 數據和基礎設施配置
├── services/          # 業務邏輯和資料存取
├── utils/             # 工具函數
├── hooks/             # 自定義 hooks
└── types/             # TypeScript 類型定義
```

## 相關頁面

- `/` - 首頁
- `/announcements` - 公告
- `/terms` - 服務條款
- `/privacy` - 隱私政策
- `/dashboard` - 儀表板

## Components

請統一透過 `index.ts` 來 import components

### 首頁相關組件：

- `hero-section.tsx` - 主視覺區塊
- `pain-points-section.tsx` - 痛點展示區塊
- `features-section.tsx` - 功能特色區塊
- `resume-demo-section.tsx` - 履歷範例展示區塊
- `faq-section.tsx` - 常見問題區塊
- `structured-data.tsx` - 結構化數據（SEO）

### 公告相關組件：

- `announcement-preview-card.tsx` - 公告預覽卡片
- `announcement-detail-card.tsx` - 公告詳情卡片

### 電子郵件模板相關組件：

- `BaseEmailTemplate.tsx` - 基礎郵件模板
- `BetaReleaseEmailTemplate.tsx` - 測試版發布郵件模板
- `SignupEmailTemplate.tsx` - 註冊郵件模板
- `WaitlistWelcomeEmailTemplate.tsx` - 候補名單歡迎郵件模板

### 法律文件相關組件：

- `legal-document.tsx` - 法律文件展示組件

### 儀表板相關組件：

- `banner-card.tsx` - 橫幅卡片組件
- `recent-announcements.tsx` - 最新公告顯示組件
- `feature-cards.tsx` - 功能卡片組件

## Lib

- `landing-content.ts` - 首頁相關數據（痛點貼文、特色亮點、FAQ 等）
- `privacy-content.ts` - 隱私政策內容數據
- `terms-content.ts` - 服務條款內容數據
- `email-templates.ts` - 郵件模板

## Services

- `announcements.ts` - 公告服務，處理公告的查詢、分頁和瀏覽次數統計

## Utils

## Hooks

## Types

- `legal-document.ts` - 法律文件類型定義
