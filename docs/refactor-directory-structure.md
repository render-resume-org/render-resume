# 專案目錄架構重構

## todos

- [] 重構 components/
  - [x] 分析當前 components/ 架構問題
  - [] 根據方案一進行重構

## 專案目錄架構設計

根據對當前專案的分析和 Next.js 15 最佳實踐，建議採用以下目錄架構：

### 整體架構原則

1. **功能導向分層**：按業務功能模組組織，而非技術類型
2. **就近原則**：相關檔案放在一起，減少跨目錄依賴
3. **清晰分層**：區分 app 路由、共享組件、業務邏輯和工具函數
4. **統一命名**：採用 kebab-case 命名規範
5. **頁面路由對應**：features/ 下的結構對應 app/ 的路由結構

### 建議的目錄結構

#### 方案一：Feature-First 架構（推薦）

```
project-root/
├── app/                           # Next.js 15 App Router
│   ├── (protected)/              # 受保護的路由群組
│   │   ├── dashboard/            # 路由頁面檔案
│   │   ├── analyze/
│   │   ├── upload-create/
│   │   ├── upload-optimize/
│   │   ├── results/
│   │   ├── account-settings/
│   │   ├── activity/
│   │   ├── service-selection/
│   │   └── payment/
│   ├── (static)/                 # 靜態頁面路由群組
│   │   ├── faq/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   ├── admin/                    # 管理員路由
│   ├── auth/                     # 認證相關路由
│   ├── api/                      # API 路由
│   │   ├── analyze/
│   │   ├── payment/
│   │   ├── smart-chat/
│   │   ├── generate-pdf/
│   │   └── hooks/
│   │
│   ├── features/                 # Feature-specific 程式碼
│   │   ├── dashboard/
│   │   │   ├── components/       # dashboard 專用組件
│   │   │   │   ├── stats-cards.tsx
│   │   │   │   ├── recent-activity.tsx
│   │   │   │   └── usage-overview.tsx
│   │   │   ├── hooks/            # dashboard 專用 hooks
│   │   │   │   └── use-dashboard-data.ts
│   │   │   ├── services/         # dashboard 專用邏輯
│   │   │   │   └── dashboard-api.ts
│   │   │   └── types/            # dashboard 專用類型
│   │   │       └── dashboard.ts
│   │   │
│   │   ├── account-settings/
│   │   │   ├── components/
│   │   │   │   ├── profile-card.tsx
│   │   │   │   ├── subscription-info.tsx
│   │   │   │   └── billing-history.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-account-settings.ts
│   │   │   └── services/
│   │   │       └── settings-api.ts
│   │   │
│   │   ├── analyze/
│   │   │   ├── components/
│   │   │   │   ├── file-upload.tsx
│   │   │   │   ├── analysis-progress.tsx
│   │   │   │   └── service-selector.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-analysis.ts
│   │   │   └── services/
│   │   │       └── analysis-api.ts
│   │   │
│   │   ├── results/
│   │   │   ├── components/
│   │   │   │   ├── score-display.tsx
│   │   │   │   ├── grade-tabs.tsx
│   │   │   │   └── detailed-feedback.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-results.ts
│   │   │   └── types/
│   │   │       └── results.ts
│   │   │
│   │   ├── upload/
│   │   │   ├── components/
│   │   │   │   ├── upload-dropzone.tsx
│   │   │   │   ├── form-sections/
│   │   │   │   │   ├── personal-info.tsx
│   │   │   │   │   ├── experience.tsx
│   │   │   │   │   └── education.tsx
│   │   │   │   └── upload-tips.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-upload.ts
│   │   │   └── services/
│   │   │       └── upload-api.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── components/
│   │   │   │   ├── checkout-form.tsx
│   │   │   │   └── payment-methods.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-payment.ts
│   │   │   └── services/
│   │   │       └── payment-api.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       │   ├── user-management.tsx
│   │       │   └── email-campaigns.tsx
│   │       ├── hooks/
│   │       │   └── use-admin.ts
│   │       └── services/
│   │           └── admin-api.ts
│   │
│   ├── components/               # 全域共享組件
│   │   ├── ui/                   # shadcn/ui 基礎組件
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── dialog.tsx
│   │   ├── layout/               # 佈局相關組件
│   │   │   ├── header.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── footer.tsx
│   │   ├── auth/                 # 認證相關組件
│   │   │   ├── login-form.tsx
│   │   │   ├── auth-guard.tsx
│   │   │   └── user-dropdown.tsx
│   │   ├── shared/               # 跨功能共享組件
│   │   │   ├── smart-chat/
│   │   │   │   ├── chat-interface.tsx
│   │   │   │   └── message-card.tsx
│   │   │   ├── pdf-preview/
│   │   │   │   └── pdf-viewer.tsx
│   │   │   ├── feature-cards.tsx
│   │   │   └── loading-spinner.tsx
│   │   └── emails/               # 郵件模板組件
│   │       ├── welcome-email.tsx
│   │       └── analysis-complete.tsx
│   │
│   ├── hooks/                    # 全域共享 hooks
│   │   ├── use-auth.ts
│   │   ├── use-mobile.ts
│   │   └── use-navigation.ts
│   │
│   ├── lib/                      # 全域共享邏輯和工具
│   │   ├── auth/
│   │   │   ├── supabase-client.ts
│   │   │   └── auth-utils.ts
│   │   ├── ai/
│   │   │   ├── openai-client.ts
│   │   │   └── prompts/
│   │   ├── utils/
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── validation.ts
│   │   └── config/
│   │       ├── constants.ts
│   │       └── env.ts
│   │
│   ├── types/                    # 全域類型定義
│   │   ├── global.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── public/                      # 靜態資源
└── docs/                        # 專案文檔
```

#### 方案二：傳統分層架構

```
project-root/
├── app/                           # Next.js 15 App Router
│   ├── (protected)/              # 路由頁面檔案
│   ├── (static)/
│   ├── admin/
│   ├── auth/
│   ├── api/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                    # 組件庫
│   ├── ui/                       # shadcn/ui 基礎組件
│   ├── layout/                   # 佈局相關組件
│   ├── auth/                     # 認證相關組件
│   ├── features/                 # Feature-specific 複雜組件
│   │   ├── dashboard/
│   │   │   ├── stats-cards.tsx
│   │   │   ├── recent-activity.tsx
│   │   │   └── usage-overview.tsx
│   │   ├── account-settings/
│   │   │   ├── profile-card.tsx
│   │   │   └── subscription-info.tsx
│   │   ├── analyze/
│   │   │   ├── file-upload.tsx
│   │   │   └── analysis-progress.tsx
│   │   ├── results/
│   │   │   ├── score-display.tsx
│   │   │   └── grade-tabs.tsx
│   │   └── upload/
│   │       ├── upload-dropzone.tsx
│   │       └── form-sections/
│   ├── shared/                   # 跨功能共享組件
│   │   ├── smart-chat/
│   │   ├── pdf-preview/
│   │   └── feature-cards.tsx
│   └── emails/                   # 郵件模板組件
│
├── hooks/                        # React Hooks
│   ├── features/                 # Feature-specific hooks
│   │   ├── use-dashboard.ts
│   │   ├── use-analysis.ts
│   │   ├── use-upload.ts
│   │   └── use-payment.ts
│   ├── use-auth.ts              # 共享 hooks
│   ├── use-mobile.ts
│   └── use-navigation.ts
│
├── lib/                          # 業務邏輯和工具
│   ├── services/                 # API 服務層
│   │   ├── features/            # Feature-specific 服務
│   │   │   ├── dashboard-api.ts
│   │   │   ├── analysis-api.ts
│   │   │   ├── upload-api.ts
│   │   │   └── payment-api.ts
│   │   ├── auth-service.ts      # 共享服務
│   │   └── api-client.ts
│   ├── auth/                    # 認證相關
│   ├── ai/                      # AI 相關功能
│   ├── pdf/                     # PDF 處理
│   ├── email/                   # 郵件服務
│   ├── utils/                   # 工具函數
│   └── config/                  # 配置檔案
│
├── types/                       # TypeScript 類型定義
│   ├── features/                # Feature-specific 類型
│   │   ├── dashboard.ts
│   │   ├── analysis.ts
│   │   ├── upload.ts
│   │   └── payment.ts
│   ├── global.ts               # 全域類型
│   ├── auth.ts
│   └── api.ts
│
├── public/                      # 靜態資源
└── docs/                        # 專案文檔
```

### 架構特色和優勢

#### 1. **路由對應的功能組織**
- `components/features/` 下的目錄結構直接對應 `app/` 的路由結構
- 每個路由頁面的相關組件都集中在對應的 features 子目錄中
- 便於快速定位和維護特定頁面的組件

#### 2. **清晰的組件分層**
- **UI組件** (`components/ui/`)：基礎UI組件庫
- **佈局組件** (`components/layout/`)：全站共用的佈局相關組件
- **認證組件** (`components/auth/`)：認證相關的獨立功能組件
- **頁面功能組件** (`components/features/`)：按路由組織的頁面特定組件
- **共享業務組件** (`components/shared/`)：跨頁面使用的複雜業務組件

#### 3. **避免過度分類**
- 不再按照 "resume相關" 或業務領域進行深度分類
- 直接按照頁面路由進行組織，更直觀易懂
- 減少了找組件時的思考負擔

#### 4. **維護性提升**
- 當需要修改特定頁面功能時，可以直接到對應的 features 子目錄
- 新增頁面時，創建對應的 features 子目錄即可
- 組件的職責邊界更加清晰

#### 5. **共享組件的合理處理**
- 跨多個頁面使用的複雜組件放在 `shared/` 目錄
- 避免了重複代碼，同時保持了組織結構的清晰

### 遷移策略

1. **按頁面遷移**：一次遷移一個頁面的相關組件
2. **保持功能完整**：確保每次遷移後對應頁面功能正常
3. **更新引用路徑**：同步更新所有import路徑
4. **測試驗證**：每個遷移步驟都要進行功能測試

## components/ 重構

### components/ 架構問題

經過分析當前的 components/ 目錄結構，發現以下主要架構問題：

#### 1. 目錄結構混亂且缺乏一致性
- **根目錄檔案過多**：components/ 根目錄有 20+ 個檔案，包含各種功能組件混雜
- **命名不一致**：有些使用 kebab-case（account-settings），有些使用 camelCase（smart-chat）
- **職責不清**：auth 相關組件既有目錄（components/auth/）又有根級檔案（auth-button.tsx、auth-redirect-handler.tsx）

#### 2. 功能模組分散且重複
- **重複的功能分組**：存在兩套平行的功能目錄結構
  - 舊結構：components/smart-chat/、components/upload/、components/preview/ 等
  - 新結構：components/features/resume/smart-chat/、components/features/resume/upload/ 等
- **功能邊界模糊**：相關功能散落在不同目錄中，例如：
  - Resume 相關：components/preview/、components/smart-chat/、components/upload/、components/results/
  - Auth 相關：components/auth/、root 級的 auth-*.tsx 檔案

#### 3. 深度巢狀結構
- **過度巢狀**：如 components/features/resume/smart-chat/ 造成路徑過長
- **不必要的中間層**：components/features/ 增加了額外的抽象層但沒有明確的組織優勢

#### 4. UI 組件與業務組件混合
- **shadcn/ui 組件**：components/ui/ 包含基礎 UI 組件（正確）
- **業務組件散亂**：業務邏輯組件散布在各個目錄中，缺乏統一的組織原則

#### 5. 檔案與目錄職責重疊
- **同名檔案與目錄**：如 components/announcements.tsx 和 components/announcements/
- **功能重複**：smart-chat.tsx 和 smart-chat/ 目錄存在職責重疊

#### 6. 缺乏清晰的分層架構
- **混合抽象層級**：頁面級組件、功能組件、通用組件沒有明確分層
- **依賴關係複雜**：組件間的依賴關係不夠清晰，影響可維護性

#### 建議的改善方向
1. **統一命名規範**：採用 kebab-case 或 camelCase 其中一種
2. **功能模組化**：按照業務功能重新組織目錄結構
3. **減少目錄深度**：避免過度巢狀的目錄結構
4. **清理重複結構**：移除舊的功能目錄，統一使用新的組織方式
5. **明確分層**：區分 UI 組件、功能組件、頁面組件的層級關係

