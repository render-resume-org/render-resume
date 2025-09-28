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
- `/smart-chat` - 履歷編輯器
- `/download` - 履歷下載

## Components （此區塊還需要根據以上相關頁面進一步分類整理）

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

### 履歷預覽相關組件：

- `resume-preview.tsx` - 履歷預覽主組件
- `resume-header.tsx` - 履歷標題組件
- `resume-section.tsx` - 履歷區塊組件
- `section-registry.tsx` - 區塊註冊器
- `action-sidebar.tsx` - 操作側邊欄
- `bullet-focus-provider.tsx` - 條目焦點提供者
- `inline-text.tsx` - 內嵌文字組件

### 履歷區塊組件：

- `education-section.tsx` - 學歷區塊
- `experience-section.tsx` - 工作經驗區塊
- `projects-section.tsx` - 專案經驗區塊
- `skills-section.tsx` - 技能區塊
- `summary-section.tsx` - 摘要區塊
- `achievements-section.tsx` - 成就區塊

### 編輯對話框組件：

- `base-edit-dialog.tsx` - 基礎編輯對話框
- `editable-item-wrapper.tsx` - 可編輯項目包裝器
- `education-edit-dialog.tsx` - 學歷編輯對話框
- `experience-edit-dialog.tsx` - 工作經驗編輯對話框
- `projects-edit-dialog.tsx` - 專案編輯對話框
- `skills-edit-dialog.tsx` - 技能編輯對話框
- `summary-edit-dialog.tsx` - 摘要編輯對話框
- `form-tips.tsx` - 表單提示組件
- `edit-dialog-manager.tsx` - 編輯對話框管理器

### 條目系統組件：

- `bullet-text.tsx` - 條目文字組件

### 高亮預覽組件：

- `inline-highlight-preview.tsx` - 內嵌高亮預覽組件

## Lib

- `results-config.ts` - 結果相關配置（評分映射、動畫配置）
- `bullet-manager.ts` - 條目管理器
- `resume-templates.ts` - 履歷模板配置（模板樣式、字體、顏色、間距設定）
- `evaluate-user-prompt.ts` - 履歷評估用戶提示詞
- `evaluate-system-prompt.ts` - 履歷評估系統提示詞
- `extract-user-prompt.ts` - 履歷抽取用戶提示詞
- `extract-system-prompt.ts` - 履歷抽取系統提示詞

## Services

## Utils

- `number-grade-mapping.ts` - 數字評分轉換與等級顏色配置
- `resume-annotations.ts` - 履歷文字註解與高亮功能
- `pdf-cn.ts` - PDF 專用的 className 處理
- `optimized-to-unified.ts` - OptimizedResume 到 UnifiedResume 格式轉換
- `pdf-styles.ts` - PDF 樣式生成工具，提供 HTML 模板和樣式配置
- `template-styling.ts` - 履歷模板樣式服務，處理模板樣式應用和管理
- `upload-utils.ts` - 檔案上傳相關工具函數和類型定義

## Hooks

- `use-animated-score.ts` - 評分動畫效果 hook
- `use-bullet-point.ts` - 條目系統 hook

## Types

- `grade.ts` - 評分相關類型定義
- `inline-edit.ts` - 內嵌編輯相關類型定義
- `resume-analysis.ts` - 履歷分析結果類型定義
- `resume-unified.ts` - 統一履歷格式類型定義
- `resume.ts` - 基礎履歷類型定義