# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Language

Always respond in Traditional Chinese (繁體中文).

## Development Commands

- **Development**: `pnpm dev` (uses turbopack for faster builds)
- **Build**: `pnpm build`
- **Start production**: `pnpm start`
- **Lint**: `pnpm lint`
- **Package manager**: Always use `pnpm` (not npm or yarn)

## Task Completion Requirements

After completing any coding task, you MUST automatically run the following commands to ensure code quality:

1. `pnpm lint` - Check for linting errors and code style issues
2. `pnpm build` - Verify the project builds successfully without errors

Do not mark any task as completed until both commands pass successfully. If either command fails, fix the issues before proceeding.

## Architecture Overview

RenderResume is a Next.js 15 application with App Router that provides AI-powered resume analysis and generation services.

### Core Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui components
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Email**: Resend with React Email templates
- **Payment**: Third-party payment API integration
- **PDF Generation**: Puppeteer with Chromium for server-side rendering

### Project Structure

採用 Feature-Based 架構：

```
app/                          # Next.js 15 App Router
├── (auth)/                   # 認證相關路由
├── (protected)/              # 需要登入才能存取的頁面
├── (static)/                 # 靜態頁面
├── admin/                    # 後台管理
└── api/                      # API routes

features/                     # 功能模組（核心業務邏輯）
├── account/                  # 用戶資料與帳戶管理
├── admin/                    # 後台管理系統
├── auth/                     # 使用者認證與授權
├── content/                  # 內容管理系統
├── payment/                  # 付款與訂閱管理
├── resume/                   # 履歷分析與生成（核心功能）
└── smart-chat/               # 智能問答系統

components/                   # 全域共用組件
├── ui/                       # shadcn/ui 基礎組件
├── svg-icon/                 # undraw svg 圖檔
├── layout/                   # 佈局相關組件
└── common/                   # 通用業務組件

lib/                          # 基礎設施和第三方服務配置
services/                     # 業務邏輯和資料存取
utils/                        # 純函數工具（無副作用的輔助函數）
hooks/                        # 全域共用 hooks
types/                        # 全域類型定義
```

### Key API Endpoints

- `/api/analyze/[service_type]` - Resume analysis (create/optimize)
- `/api/payment/checkout` - Payment processing
- `/api/payment/callback` - Payment webhook handling  
- `/api/hooks/send-email` - Supabase Auth email webhook
- `/api/smart-chat` - Interactive Q&A for resume optimization
- `/api/generate-pdf` - PDF generation from HTML content

### Development Guidelines

- **Styling**: Use `cn()` function for conditional classNames (required by .cursor/rules)
- **UI Components**: Check `@/components/ui` for shadcn components before creating new ones
- **Feature Documentation**: When making changes to files under `features/`, MUST update the corresponding README.md in that feature folder to document the changes
