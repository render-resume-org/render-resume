# Admin Feature

> 管理員模組，負責處理用戶管理、系統設定、公告管理等後台管理功能

## 目錄結構

```
features/admin/
├── components/        # UI 組件
├── lib/               # 數據和基礎設施配置
├── services/          # 業務邏輯和資料存取
├── utils/             # 工具函數
├── hooks/             # 自定義 hooks
└── types/             # TypeScript 類型定義
```

## 相關頁面

- `/admin` - 管理員首頁
- `/admin/users` - 用戶管理
- `/admin/announcements` - 公告管理
- `/admin/email` - 郵件發送
- `/admin/email-promo` - 推廣郵件
- `/admin/test-email` - 測試郵件
- `/admin/plans` - 方案管理
- `/admin/settings` - 系統設定

## API 路由

- `/api/admin/auth` - 管理員驗證
- `/api/admin/dashboard` - 首頁數據
- `/api/admin/users` - 用戶管理 API
- `/api/admin/announcements` - 公告管理 API
- `/api/admin/subscriptions` - 訂閱管理 API
- `/api/admin/plans` - 方案管理 API
- `/api/admin/email-campaigns` - 郵件活動 API
- `/api/admin/email/send` - 郵件發送 API
- `/api/admin/email/preview` - 郵件預覽 API
- `/api/admin/email/batch-promo` - 批量推廣郵件 API

## Components

請統一透過 `index.ts` 來 import components


## Lib

- `admin-config.ts` - 管理員配置常數，包含角色和權限 ID 定義

## Services

- `admin-auth.ts` - 管理員驗證服務，參考 `/services/admin-auth.ts` 實作

## Utils

## Hooks

- `use-admin-data.ts` - 管理員數據獲取，參考 `/hooks/use-admin-data.ts` 實作

## Types

- `admin.ts` - 管理員相關類型定義
- `user-management.ts` - 用戶管理類型定義
- `email-campaign.ts` - 郵件活動類型定義
