# Account Feature

> 帳戶模組，負責處理用戶帳戶設定、訂閱管理、個人資料等功能

## 目錄結構

```
features/account/
├── components/        # UI 組件
├── lib/               # 數據和基礎設施配置
├── services/          # 業務邏輯和資料存取
├── utils/             # 工具函數
├── hooks/             # 自定義 hooks
└── types/             # TypeScript 類型定義
```

## 相關頁面

- `/account-settings` - 帳戶設定
- `/activity` - 活動紀錄
- `/dashboard` - 儀表板

## Components

請統一透過 `index.ts` 來 import components

### 帳戶設定相關組件：

- `account-settings-header.tsx` - 帳戶設定頁面標題
- `account-settings-avatar-card.tsx` - 使用者頭像設定卡片
- `account-settings-info-card.tsx` - 個人資訊設定卡片
- `account-settings-error-state.tsx` - 帳戶設定錯誤狀態
- `account-settings-skeleton.tsx` - 帳戶設定載入骨架
- `account-stats-card.tsx` - 帳戶統計卡片
- `current-plan-card.tsx` - 當前方案卡片
- `subscription-history-card.tsx` - 訂閱歷史卡片
- `redeem-code-card.tsx` - 兌換碼卡片

### 活動紀錄相關組件：

- `activity-content.tsx` - 活動紀錄內容
- `activity-filters.tsx` - 活動紀錄篩選器
- `activity-header.tsx` - 活動紀錄頁面標題

### 儀表板相關組件：

- `recent-activity.tsx` - 近期活動摘要
- `usage-stats.tsx` - 今日使用量和方案資訊

## Lib

- `activity-config.ts` - 活動類型配置，包含活動圖示映射和標籤翻譯

## Services

## Utils

## Hooks

## Types