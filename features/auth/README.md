# Auth Feature

> 身份驗證模組，負責處理用戶註冊、登入、密碼重設等認證相關功能

## 目錄結構

```
features/auth/
├── components/        # UI 組件
├── lib/               # 數據和基礎設施配置
├── services/          # 業務邏輯和資料存取
├── utils/             # 工具函數
├── hooks/             # 自定義 hooks
└── types/             # TypeScript 類型定義
```

## 相關頁面

- `/auth/login` - 登入
- `/auth/sign-up` - 註冊
- `/auth/forgot-password` - 忘記密碼
- `/auth/update-password` - 更新密碼

## Components

請統一透過 `index.ts` 來 import components

### 認證相關組件：

- `login-form.tsx` - 登入表單組件
- `sign-up-form.tsx` - 註冊表單組件
- `forgot-password-form.tsx` - 忘記密碼表單組件
- `update-password-form.tsx` - 更新密碼表單組件

## Lib

## Services

- `auth.ts` - 身份驗證相關的服務層邏輯，包含用戶驗證、權限檢查等功能

## Utils

## Hooks

- `use-auth.ts` - 身份驗證核心 hook，處理登入、登出、用戶狀態管理等功能
- `use-auth-redirect.ts` - 身份驗證重定向 hook，處理已認證用戶的自動重定向邏輯

## Types