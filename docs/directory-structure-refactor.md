# Directory Structure Refactor

## Description

遵循 Next.js 15 best practice，採用 Feature-Based 架構進行專案目錄重構。

## todos

- [x] 重構 lib/
  - [x] 新增 utils/
  - [x] 新增 services/
- [] 重構 components/
- [] 重構 lib/
- [] 重構 services/
- [] 重構 utils/
- [] 重構 hooks/
- [] 重構 types/
- [] 確認 features/
  - [] resume/
  - [] smart-chat/
  - [] files/
  - [] auth/
  - [] account/
  - [] payment/
  - [] admin/
  - [] content/
- [] 重構 app/api/

晚點做：
- [] 重構 app/admin/
- [] 將 /auth 改成 /(auth)
- [] 調整 metadata 位置（一併更新 public/）
- [] 重構 app/payment/ 架構
- [] 適當調整檔案與資料夾的名稱
- [] 簡化 README.md
- [] 簡化 claude.md

待討論：
- [] announcements 是否要放進 footer? 因為他也是 (static)

### 遷移策略

1. **按頁面遷移**：一次遷移一個頁面的相關組件
2. **保持功能完整**：確保每次遷移後對應頁面功能正常
3. **更新引用路徑**：同步更新所有import路徑
4. **測試驗證**：每個遷移步驟都要進行功能測試

### Feature 模組

核心業務模組：
- resume/ - 履歷分析與生成（核心功能）
- smart-chat/ - 智能問答系統
- files/ - 檔案管理系統

用戶相關模組：
- auth/ - 認證與授權
- account/ - 用戶資料與帳戶管理
- payment/ - 付款與訂閱管理

系統管理模組：
- admin/ - 後台管理系統
- content/ - 內容管理系統

### 核心邏輯和工具函式的分類

- lib/ - 基礎設施和第三方服務配置
- services/ - 業務邏輯和資料存取層
- utils/ - 純函數工具（無副作用的輔助函數）

### Feature-Based 目錄架構

```
render-resume/
├── app/                          # Next.js 15 App Router
│   ├── auth/                     # 認證相關路由
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
│   ├── auth/                     # 使用者認證與授權
│   │   ├── components/           # 登入、註冊、密碼重置組件
│   │   ├── hooks/                # 認證相關 hooks
│   │   ├── services/             # 認證 API 服務
│   │   ├── types/                # 認證相關類型
│   │   └── utils/                # 認證工具函數
│   │
│   ├── resume/                   # 履歷分析與生成（核心功能）
│   │   ├── components/           # 分析結果、履歷預覽、編輯組件
│   │   ├── services/             # AI 分析、PDF 生成服務
│   │   ├── hooks/                # 履歷處理相關 hooks
│   │   ├── types/                # 履歷相關類型定義
│   │   └── utils/                # 履歷處理工具函數
│   │
│   ├── smart-chat/               # 智能問答系統
│   │   ├── components/           # 聊天界面、訊息組件
│   │   ├── hooks/                # 聊天狀態管理 hooks
│   │   ├── services/             # 聊天 API 服務
│   │   ├── types/                # 聊天相關類型
│   │   └── utils/                # 聊天工具函數
│   │
│   ├── files/                    # 檔案管理系統
│   │   ├── components/           # 檔案上傳、下載、預覽組件
│   │   ├── hooks/                # 檔案處理 hooks
│   │   ├── services/             # 檔案處理、PDF 生成服務
│   │   ├── types/                # 檔案相關類型
│   │   └── utils/                # 檔案處理工具函數
│   │
│   ├── payment/                  # 付款與訂閱管理
│   │   ├── components/           # 付款界面、訂閱計畫組件
│   │   ├── hooks/                # 付款狀態管理 hooks
│   │   ├── services/             # 付款 API、訂閱服務
│   │   ├── types/                # 付款相關類型
│   │   └── utils/                # 付款工具函數
│   │
│   ├── account/                  # 用戶資料與帳戶管理
│   │   ├── components/           # 個人資料、帳戶設定組件
│   │   ├── hooks/                # 用戶資料管理 hooks
│   │   ├── services/             # 用戶 API 服務
│   │   ├── types/                # 用戶相關類型
│   │   └── utils/                # 用戶資料處理工具
│   │
│   ├── admin/                    # 後台管理系統
│   │   ├── components/           # 後台管理組件
│   │   ├── hooks/                # 管理功能 hooks
│   │   ├── services/             # 管理 API 服務
│   │   ├── types/                # 管理相關類型
│   │   └── utils/                # 管理工具函數
│   │
│   └── content/                  # 內容管理系統
│       ├── components/           # 公告、FAQ、靜態頁面組件
│       ├── hooks/                # 內容管理 hooks
│       ├── services/             # 內容 API 服務
│       ├── types/                # 內容相關類型
│       └── utils/                # 內容處理工具函數
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
└── docs/                         # 專案文檔
```
