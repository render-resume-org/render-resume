# Resume Analysis API Documentation

## 概述

這是一個基於 LangChain 和 OpenAI GPT 模型的專業履歷分析 API，支援文字內容分析和文檔上傳分析。API 提供結構化的履歷解析，包括項目分析、技能提取、工作經驗整理和成就總結。

## 環境設置

### 安裝依賴

```bash
npm install @langchain/core @langchain/openai langchain zod
```

### 環境變數

創建 `.env.local` 文件：

```env
OPENAI_API_KEY=your_openai_api_key_here

# 可選配置
# OPENAI_MODEL=gpt-4.1-mini
# OPENAI_TEMPERATURE=0.3
```

## 支援的文件類型

### PDF 文檔
- `.pdf` - 使用 GPT-4 Vision 模型處理

### 圖片格式
- `.jpg`, `.jpeg` - JPEG 圖片
- `.png` - PNG 圖片  
- `.gif` - GIF 圖片
- `.webp` - WebP 圖片

### 文字文檔
- `.txt` - 純文字文件
- `.md` - Markdown 文件
- `.json` - JSON 文件
- `.csv` - CSV 文件

## API 端點

### GET /api/analyze

分析文字格式的履歷內容。

**查詢參數：**
- `resume` (必需): 履歷文字內容
- `text` (可選): 額外的背景資訊

**範例請求：**
```bash
curl "http://localhost:3000/api/analyze?resume=軟體工程師，具有5年React開發經驗..."
```

**回應格式：**
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "expertise": [...],
    "projects_summary": "...",
    "expertise_summary": "...",
    "work_experiences": [...],
    "work_experiences_summary": "...",
    "achievements": [...],
    "achievements_summary": "..."
  }
}
```

### POST /api/analyze

支援三種請求類型：

#### 1. JSON 文字分析

**請求標頭：**
```
Content-Type: application/json
```

**請求體：**
```json
{
  "resume": "履歷文字內容",
  "text": "額外資訊（可選）"
}
```

#### 2. 自定義提示分析

**請求體：**
```json
{
  "systemPrompt": "你是履歷分析專家...",
  "userPrompt": "請分析這份履歷..."
}
```

#### 3. 文檔上傳分析

**請求標頭：**
```
Content-Type: multipart/form-data
```

**表單欄位：**
- `files` (必需): 一個或多個文件
- `additionalText` (可選): 額外資訊
- `useVision` (可選): 是否使用 Vision 模型 (預設: true)

**範例請求：**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -F "files=@resume.pdf" \
  -F "files=@portfolio.png" \
  -F "additionalText=應徵前端工程師職位" \
  -F "useVision=true"
```

**文檔上傳回應格式：**
```json
{
  "success": true,
  "data": {
    "projects": [...],
    "expertise": [...],
    // ... 其他分析結果
  },
  "metadata": {
    "filesProcessed": 2,
    "fileNames": ["resume.pdf", "portfolio.png"],
    "useVision": true
  }
}
```

## 前端使用

### 基本文字分析

```typescript
import { analyzeResume } from '@/lib/api/resume-analysis';

const result = await analyzeResume({
  resume: "軟體工程師履歷內容...",
  text: "額外背景資訊",
  method: 'POST'
});

if (result.success) {
  console.log('分析結果:', result.data);
}
```

### 文檔上傳分析

```typescript
import { analyzeDocuments } from '@/lib/api/resume-analysis';

const files = [pdfFile, imageFile]; // File 物件陣列

const result = await analyzeDocuments({
  files: files,
  additionalText: "應徵軟體工程師",
  useVision: true
});

if (result.success) {
  console.log('文檔分析結果:', result.data);
  console.log('處理的文件:', result.metadata?.fileNames);
}
```

### 自定義提示

```typescript
import { customPromptAnalysis } from '@/lib/api/resume-analysis';

const result = await customPromptAnalysis({
  systemPrompt: "你是專業的履歷顧問...",
  userPrompt: "請評估這份履歷的競爭力..."
});

if (result.success) {
  console.log('AI 回應:', result.data?.result);
}
```

### 批次分析

```typescript
import { batchAnalyzeResumes } from '@/lib/api/resume-analysis';

const result = await batchAnalyzeResumes({
  resumes: ["履歷1內容", "履歷2內容", "履歷3內容"],
  additionalTexts: ["背景1", "背景2", "背景3"]
});

console.log(`成功: ${result.summary.successful}, 失敗: ${result.summary.failed}`);
result.results.forEach((analysis, index) => {
  console.log(`履歷 ${index + 1}:`, analysis);
});
```

## React 組件範例

### 文檔上傳組件

```tsx
import DocumentAnalyzer from '@/components/document-analyzer';

export default function AnalysisPage() {
  return (
    <div>
      <h1>履歷分析</h1>
      <DocumentAnalyzer />
    </div>
  );
}
```

### 文字分析組件

```tsx
import ResumeAnalyzer from '@/components/resume-analyzer';

export default function TextAnalysisPage() {
  return (
    <div>
      <h1>文字履歷分析</h1>
      <ResumeAnalyzer />
    </div>
  );
}
```

## 技術架構

### 模組結構

```
lib/
├── openai-client.ts          # OpenAI 客戶端（支援文檔上傳）
├── types/
│   └── resume-analysis.ts    # TypeScript 類型定義
└── api/
    └── resume-analysis.ts    # 前端 API 工具函數

app/api/analyze/
└── route.ts                  # Next.js API 路由處理器

components/
├── resume-analyzer.tsx       # 文字分析組件
└── document-analyzer.tsx     # 文檔上傳分析組件
```

### 主要功能

- **模組化設計**: 清晰的職責分離
- **類型安全**: 完整的 TypeScript 支援
- **文檔上傳**: 支援 PDF、圖片和文字文檔
- **Vision 模型**: 使用 GPT-4 Vision 處理視覺內容
- **錯誤處理**: 完善的錯誤處理和驗證
- **批次處理**: 支援多個履歷同時分析
- **拖拽上傳**: 現代化的文件上傳體驗

### LangChain 整合

- 使用 `@langchain/openai` 進行 OpenAI API 整合
- 支援 `ChatPromptTemplate` 進行提示管理
- 使用 Zod 進行回應驗證和類型安全

## 文件處理限制

- **文件大小**: 最大 10MB
- **文件數量**: 建議一次上傳不超過 5 個文件
- **支援格式**: 僅支援列出的文件類型
- **Vision 模型**: PDF 和圖片文件需要啟用 Vision 模型

## 疑難排解

### 常見問題

1. **API Key 錯誤**
   ```
   錯誤: OpenAI API 配置錯誤
   解決: 檢查 .env.local 中的 OPENAI_API_KEY
   ```

2. **文件上傳失敗**
   ```
   錯誤: 不支援的文件類型
   解決: 確認文件格式在支援列表中
   ```

3. **Vision 模型錯誤**
   ```
   錯誤: 需要啟用 Vision 模型來處理 PDF 文件
   解決: 設定 useVision: true 或使用文字提取
   ```

4. **文件過大**
   ```
   錯誤: 文件過大 (最大 10MB)
   解決: 壓縮文件或分割成多個小文件
   ```

### 除錯建議

- 檢查瀏覽器開發者工具的網路標籤
- 查看伺服器控制台日誌
- 驗證環境變數設定
- 確認文件格式和大小符合要求

## 效能優化

### 快取策略

```typescript
// 實作結果快取
const cacheKey = `analysis_${hashContent(resumeContent)}`;
const cachedResult = await cache.get(cacheKey);
if (cachedResult) return cachedResult;
```

### 請求限制

```typescript
// 實作速率限制
const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 分鐘
  max: 100 // 最多 100 次請求
});
```

### 非同步處理

```typescript
// 大型文件非同步處理
const jobId = await queueAnalysis(files);
return { jobId, status: 'processing' };
```

## 安全考量

- **文件驗證**: 嚴格的文件類型和大小檢查
- **內容過濾**: 防止惡意內容上傳
- **API 限制**: 實作速率限制和使用配額
- **資料隱私**: 不儲存上傳的文件內容

## 更新日誌

### v2.0.0 (最新)
- ✅ 新增文檔上傳功能
- ✅ 支援 PDF 和圖片分析
- ✅ 整合 GPT-4 Vision 模型
- ✅ 拖拽上傳介面
- ✅ 批次文件處理
- ✅ 完善的錯誤處理

### v1.0.0
- ✅ 基本文字履歷分析
- ✅ LangChain 整合
- ✅ TypeScript 支援
- ✅ React 組件 