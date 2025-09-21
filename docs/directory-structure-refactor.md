# Directory Structure Refactor

## Description

遵循 Next.js 15 best practice，採用 Feature-Based 架構進行專案目錄重構。

## app/api 重構

api routes 宜重新分類，設計得更加精簡，將複雜邏輯移至 features/[feature_name]/services/。

## todos

- [x] 重構 lib/
  - [x] 新增 utils/
  - [x] 新增 services/
- [x] 重構 components/
  - [x] resume/
  - [x] smart-chat/
  - [x] auth/
  - [x] account/
  - [x] payment/
  - [] admin/ -> 邏輯似乎都寫在 page.tsx 需要再另外去做整理
  - [x] content/
- [x] 重構 lib/
- [x] 重構 services/
- [x] 重構 utils/
- [x] 重構 hooks/
- [x] 重構 types/
- [] 逐項檢查 features/
  - [] resume/
  - [] smart-chat/
  - [] auth/
  - [] account/
  - [] payment/
  - [] admin/
  - [] content/
- [] 重構 app/api/

晚點做：
- [] 重構 app/admin/
- [x] 將 /auth 改成 /(auth)
- [] 調整 metadata 位置（一併更新 public/）
- [] 重構 app/payment/ 架構
- [] 適當調整檔案與資料夾的名稱
- [] 簡化 README.md
- [] 簡化 claude.md

待討論：
- [] announcements 是否要放進 footer? 因為他也是 (static)

### Feature 模組

核心業務模組：
- resume/ - 履歷分析與生成（核心功能）
- smart-chat/ - 智能問答系統

用戶相關模組：
- auth/ - 認證與授權
- account/ - 用戶資料與帳戶管理
- payment/ - 付款與訂閱管理

系統管理模組：
- admin/ - 後台管理系統
- content/ - 內容管理系統

### 核心邏輯和工具函式的分類

- lib/ - 基礎設施和第三方服務配置
- services/ - 業務邏輯和資料存取
- utils/ - 純函數工具（無副作用的輔助函數）

### Feature-Based 目錄架構

```
render-resume/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # 認證相關路由
│   │   ├── callback/             # OAuth 回調處理
│   │   ├── confirm/              # 郵件確認 (route.ts)
│   │   ├── error/                # 認證錯誤頁面
│   │   ├── forgot-password/      # 忘記密碼
│   │   ├── login/                # 登入頁面
│   │   ├── sign-up/              # 註冊頁面
│   │   ├── sign-up-success/      # 註冊成功頁面
│   │   └── update-password/      # 更新密碼
│   │
│   ├── (protected)/              # 需要登入才能存取的頁面
│   │   ├── account-settings/
│   │   ├── activity/
│   │   ├── analyze/
│   │   ├── dashboard/
│   │   ├── download/
│   │   ├── payment/
│   │   ├── results/
│   │   ├── service-selection/
│   │   ├── smart-chat/
│   │   ├── upload-create/
│   │   ├── upload-optimize/
│   │   └── layout.tsx
│   │
│   ├── (static)/                 # 靜態頁面
│   │   ├── announcements/
│   │   ├── faq/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   └── terms/
│   │
│   ├── admin/                    # 後台
│   │   ├── announcements/        # 公告管理
│   │   ├── email/                # 郵件管理
│   │   ├── email-promo/          # 促銷郵件
│   │   ├── plans/                # 方案管理
│   │   ├── settings/             # 系統設定
│   │   ├── test-email/           # 測試郵件
│   │   ├── users/                # 用戶管理
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── api/                      # API routes
│   │   ├── analyze/
│   │   ├── payment/
│   │   ├── smart-chat/
│   │   ├── generate-pdf/
│   │   └── hooks/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── features/                     # 功能模組（核心業務邏輯）
│   ├── account/                  # 用戶資料與帳戶管理
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── admin/                    # 後台管理系統
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── services/
│   │
│   ├── auth/                     # 使用者認證與授權
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── content/                  # 內容管理系統
│   │   ├── components/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── payment/                  # 付款與訂閱管理
│   │   └── components/
│   │
│   ├── resume/                   # 履歷分析與生成（核心功能）
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │
│   └── smart-chat/               # 智能問答系統
│       ├── components/
│       ├── hooks/
│       ├── lib/
│       ├── types/
│       └── utils/
│
├── components/                   # 全域共用組件
│   ├── ui/                       # shadcn/ui 基礎組件
│   ├── svg-icon/                 # undraw svg 圖檔
│   ├── layout/                   # 佈局相關組件
│   └── common/                   # 通用業務組件
│
├── lib/                          # 基礎設施和第三方服務配置
│
├── services/                     # 業務邏輯和資料存取
│
├── utils/                        # 純函數工具（無副作用的輔助函數）
│
├── hooks/                        # 全域共用 hooks
│
├── types/                        # 全域類型定義
│
├── public/                       # 靜態資源
│
└── docs/                         # 專案文檔
```
