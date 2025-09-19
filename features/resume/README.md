# Resume Feature

> 履歷模組，負責處理履歷上傳、分析、編輯和生成等功能

## 目錄結構

```
features/resume/
├── components/        # UI 組件
├── lib/               # 數據和基礎設施配置
├── services/          # 業務邏輯和資料存取
├── utils/             # 工具函數
├── hooks/             # 自定義 hooks
└── types/             # TypeScript 類型定義
```

## 相關頁面

- `/service-selection` - 履歷服務選擇
- `/upload-create` - 資料上傳（從零打造新履歷）
- `/upload-optimize` - 資料上傳（優化現有履歷）
- `/results` - 分析結果

## Components

請統一透過 `index.ts` 來 import components

### 資料上傳相關組件：

- `additional-text-input.tsx` - 額外文字輸入
- `education-input.tsx` - 學歷輸入
- `experience-input.tsx` - 工作經驗輸入
- `links-input.tsx` - 連結輸入
- `personal-input.tsx` - 個人資訊輸入
- `project-input.tsx` - 專案經驗輸入
- `skills-input.tsx` - 技能輸入
- `upload-dropzone.tsx` - 檔案拖拽上傳
- `uploaded-files-list.tsx` - 已上傳檔案列表

### 履歷服務選擇相關組件：

- `service-card.tsx` - 服務選擇卡片

### 分析結果相關組件：

- `resume-grade.tsx` - 履歷評分組件
- `resume-comment.tsx` - 履歷評語組件
- `resume-highlights-issues-section.tsx` - 履歷亮點與問題展示組件

## Lib

- `results-config.ts` - 結果相關配置（評分映射、動畫配置）

## Services

## Utils

- `number-grade-mapping.ts` - 數字評分轉換與等級顏色配置

## Hooks

- `use-animated-score.ts` - 評分動畫效果 hook

## Types

- `grade.ts` - 評分相關類型定義