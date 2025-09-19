# Smart Chat Feature

> AI 智慧問答模組，負責處理履歷分析、優化建議、互動式問答等智慧對話功能

## 目錄結構

```
features/smart-chat/
├── components/        # UI 組件
├── hooks/             # 自定義 hooks
├── lib/               # 配置和工具
├── types/             # TypeScript 類型定義
├── utils/             # 工具函數
└── services/          # 業務邏輯和資料存取
```

## 相關頁面

- `/smart-chat` - 履歷編輯器

## Components （此區塊還需要進一步分類整理）

請統一透過 `index.ts` 來 import components

### 主要聊天組件：

- `smart-chat.tsx` - 智慧問答主組件
- `desktop-chat-panel.tsx` - 桌面版聊天面板
- `mobile-chat-panel.tsx` - 行動版聊天面板
- `draggable-fab.tsx` - 可拖拽浮動按鈕

### 訊息相關組件：

- `chat-message-card.tsx` - 聊天訊息卡片
- `chat-input.tsx` - 聊天輸入框
- `loading-message.tsx` - 載入中訊息
- `canned-messages.tsx` - 罐頭訊息組件

### 建議與 AI 組件：

- `ai-suggestions-sidebar.tsx` - AI 建議側邊欄
- `suggestion-card.tsx` - 建議卡片
- `excerpt-card.tsx` - 摘錄卡片

### 履歷編輯器組件：

- `resume-editor-context.tsx` - 履歷編輯器上下文
- `resume-editor-preview.tsx` - 履歷編輯器預覽
- `preview-action-panel.tsx` - 預覽操作面板
- `zoom-toolbar.tsx` - 縮放工具欄

### 問題與警告組件：

- `issue-bar.tsx` - 問題狀態欄
- `issue-dropdown.tsx` - 問題下拉選單
- `chat-limit-alert.tsx` - 聊天限制警告

### 使用者介面組件：

- `user-avatar.tsx` - 使用者頭像

## Hooks

- `use-chat-logic.ts` - 聊天邏輯主要 hook，處理訊息管理、檔案上傳、建議生成等
- `use-similarity-check.ts` - 相似度檢查 hook（建議、摘錄、模板相似度比對）
- `use-excerpt-processor.ts` - 摘錄處理 hook（重複檢測、顯示管理）
- `use-scroll-manager.ts` - 滾動管理 hook（自動滾動、智能滾動）
- `use-template-manager.ts` - 模板管理 hook（建議模板狀態管理）
- `use-input-manager.ts` - 輸入管理 hook（textarea 高度調整、輸入處理）
- `use-canned-messages.ts` - 罐頭訊息 hook（預設訊息選項管理）

## Lib

- `resume-editor-config.ts` - 履歷編輯器配置（對話限制、罐頭訊息、相似度閾值、動畫設定等）

## Types

- `resume-editor.ts` - 履歷編輯器相關類型定義（PatchOp、ChatMessage、建議記錄等）

## Utils

- `issue-mapper.ts` - 問題對映工具，將統一問題格式轉換為建議模板

## Services
