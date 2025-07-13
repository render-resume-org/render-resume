# RenderResume - AI 履歷生成器

*[English](#english) | [繁體中文](#繁體中文)*

---

## 繁體中文

### 📝 專案簡介

RenderResume 是一個採用 AI 技術的專業履歷與作品集生成器，基於 Fortune 500 企業標準的六維度評估模型，運用 STAR 原則架構，協助求職者打造具有競爭力的履歷。

### ✨ 主要特色

- **🧠 AI 智能解析** - 上傳履歷、作品集、PDF、圖片或文字文件，支援批次分析
- **📊 六維度專業評分** - Fortune 500 標準，A+~F 等第，完整 Chain of Thought 推理
- **💬 智能問答優化** - 互動式 Q&A、AI 建議側邊欄、即時履歷優化
- **⭐ STAR 原則重構** - 自動將經歷重構為有說服力的 STAR 框架
- **📈 個性化建議** - 針對缺失內容給出具體補強建議
- **🌐 多語言支援** - 支援繁體中文與英文介面
- **📧 管理員郵件群發** - 多模板、篩選、即時預覽、批次發送
- **💳 訂閱/金流整合** - 支援第三方金流 API，升級/回調/訂閱管理
- **🔗 Email Hooks** - Supabase Auth 驗證郵件自訂，React 模板，Resend 整合

### 🎯 六維度評估模型

1. **💻 技術深度與廣度** (25%)
2. **🚀 項目複雜度與影響力** (25%)
3. **💼 專業經驗完整度** (20%)
4. **🎓 教育背景匹配度** (15%)
5. **🏆 成果與驗證** (10%)
6. **✨ 整體專業形象** (5%)

### 🛠 技術架構

- **前端**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **AI**: LangChain, OpenAI GPT (含 GPT-4 Vision)
- **檔案處理**: PDF、圖片、文字、批次上傳
- **金流/訂閱**: 應援科技 API，訂閱升級、回調、到期管理
- **資料庫/驗證**: Supabase, Supabase Auth
- **郵件**: Resend, React 電子郵件模板，Supabase Hooks
- **部署**: Vercel

### 📋 系統需求

- Node.js 18.0 或更高
- **pnpm**（推薦）
- 現代瀏覽器

### 🚀 快速開始

1. 複製專案
```bash
git clone https://github.com/ruby0322/render-resume.git
cd render-resume
```
2. 安裝相依套件
```bash
pnpm install # 推薦
# 或 npm install / yarn install
```
3. 設定環境變數 `.env.local`
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.3
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# 金流
PAYMENT_API_BASE=https://payment-api.testing.oen.tw
MERCHANT_ID=ruby0322
# Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=RenderResume <noreply@yourdomain.com>
SEND_EMAIL_HOOK_SECRET=v1,whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
4. 啟動開發伺服器
```bash
pnpm dev # 推薦
# 或 npm run dev / yarn dev
```

### 📚 主要功能

- **AI 履歷分析**：支援 PDF、圖片、文字、批次上傳，智能 Q&A、AI 建議
- **評分系統**：六維度、A+~F、完整推理、缺失分析、互動補充
- **訂閱/金流**：升級、回調、訂單驗證、到期管理
- **郵件系統**：管理員群發、篩選、模板、即時預覽、批次發送
- **Email Hooks**：Supabase Auth 驗證郵件自訂、React 模板、Resend 整合

### 🔗 重要 API 端點

- `/api/analyze`：履歷分析（GET/POST，支援文字、文件、批次）
- `/api/payment/checkout`：建立支付
- `/api/payment/callback`：支付回調
- `/api/hooks/send-email`：Supabase Auth 郵件 webhook
- `/api/test-email`：測試郵件模板

### 🧪 測試與最佳實踐

- **金流測試**：用 Postman/curl 模擬 callback，詳見 `docs/payment-integration.md`
- **郵件測試**：用 `/api/test-email` 預覽/發送測試郵件
- **批次分析**：支援多履歷同時分析，詳見 `docs/resume-analysis-api.md`
- **管理員郵件**：建議先小量測試，預覽內容再批次發送

### 📁 專案結構

```
render-resume/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── (protected)/       # 受保護頁面
│   ├── auth/              # 身份驗證頁面
│   └── globals.css        # 全域樣式
├── components/            # React 元件（analysis, smart-chat, profile, emails, subscription, upload, ui...）
├── lib/                  # AI/金流/郵件/型別/工具
├── docs/                 # API、金流、郵件、管理員文件
├── types/                # TypeScript 型別
├── public/               # 靜態資源
```

### 📄 進階文件

- [docs/resume-analysis-api.md](docs/resume-analysis-api.md)
- [docs/payment-integration.md](docs/payment-integration.md)
- [docs/admin-email-system.md](docs/admin-email-system.md)
- [docs/email-hook-setup.md](docs/email-hook-setup.md)

### 🤝 貢獻指南

1. Fork 專案，建立分支，提交 PR
2. 參考 `docs/` 取得 API、金流、郵件等詳細技術說明

### 📞 聯絡資訊

- [GitHub Issues](https://github.com/ruby0322/render-resume/issues)

---

## English

### 📝 Project Overview

RenderResume is an AI-powered resume and portfolio generator using Fortune 500 standards and the STAR methodology, helping job seekers create competitive resumes.

### ✨ Key Features

- **🧠 AI Analysis**: Upload resumes, portfolios, PDFs, images, or text files; supports batch analysis
- **📊 Six-Dimensional Scoring**: Fortune 500-based, A+~F, full Chain of Thought reasoning
- **💬 Smart Q&A Optimization**: Interactive Q&A, AI suggestions sidebar, real-time resume improvement
- **⭐ STAR Methodology**: Automatically restructures experiences into compelling STAR narratives
- **📈 Personalized Recommendations**: Concrete suggestions for missing content
- **🌐 Multi-language Support**: Traditional Chinese & English
- **📧 Admin Bulk Email**: Multiple templates, filtering, instant preview, batch sending
- **💳 Subscription/Payment Integration**: Third-party payment API, upgrade/callback/plan management
- **🔗 Email Hooks**: Supabase Auth custom emails, React templates, Resend integration

### 🎯 Six-Dimensional Evaluation Model

1. **💻 Technical Depth & Breadth** (25%)
2. **🚀 Project Complexity & Impact** (25%)
3. **💼 Professional Experience Completeness** (20%)
4. **🎓 Educational Background Relevance** (15%)
5. **🏆 Achievements & Validation** (10%)
6. **✨ Overall Professional Image** (5%)

### 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Radix UI
- **AI**: LangChain, OpenAI GPT (incl. GPT-4 Vision)
- **File Processing**: PDF, image, text, batch upload
- **Payment/Subscription**: OEN Payment API, upgrade/callback/plan management
- **Database/Auth**: Supabase, Supabase Auth
- **Email**: Resend, React email templates, Supabase Hooks
- **Deployment**: Vercel

### 📋 System Requirements

- Node.js 18.0+
- **pnpm** (recommended)
- Modern browser

### 🚀 Quick Start

1. Clone the repo
```bash
git clone https://github.com/ruby0322/render-resume.git
cd render-resume
```
2. Install dependencies
```bash
pnpm install # recommended
# or npm install / yarn install
```
3. Set up `.env.local`
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.3
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# Payment
PAYMENT_API_BASE=https://payment-api.testing.oen.tw
MERCHANT_ID=ruby0322
# Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=RenderResume <noreply@yourdomain.com>
SEND_EMAIL_HOOK_SECRET=v1,whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
4. Start the dev server
```bash
pnpm dev # recommended
# or npm run dev / yarn dev
```

### 📚 Main Features

- **AI Resume Analysis**: PDF, image, text, batch upload, smart Q&A, AI suggestions
- **Scoring System**: Six dimensions, A+~F, full reasoning, missing content analysis, interactive follow-ups
- **Subscription/Payment**: Upgrade, callback, order validation, expiry management
- **Email System**: Admin bulk email, filtering, templates, instant preview, batch sending
- **Email Hooks**: Supabase Auth custom emails, React templates, Resend integration

### 🔗 Key API Endpoints

- `/api/analyze`: Resume analysis (GET/POST, text, file, batch)
- `/api/payment/checkout`: Create payment
- `/api/payment/callback`: Payment callback
- `/api/hooks/send-email`: Supabase Auth email webhook
- `/api/test-email`: Test email templates

### 🧪 Testing & Best Practices

- **Payment**: Use Postman/curl to simulate callback (see `docs/payment-integration.md`)
- **Email**: Use `/api/test-email` to preview/send test emails
- **Batch Analysis**: Analyze multiple resumes at once (see `docs/resume-analysis-api.md`)
- **Admin Email**: Test with small batches, preview before sending

### 📁 Project Structure

```
render-resume/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (protected)/       # Protected pages
│   ├── auth/              # Auth pages
│   └── globals.css        # Global styles
├── components/            # React components (analysis, smart-chat, profile, emails, subscription, upload, ui...)
├── lib/                  # AI/payment/email/types/utils
├── docs/                 # API, payment, email, admin docs
├── types/                # TypeScript types
├── public/               # Static assets
```

### 📄 Advanced Docs

- [docs/resume-analysis-api.md](docs/resume-analysis-api.md)
- [docs/payment-integration.md](docs/payment-integration.md)
- [docs/admin-email-system.md](docs/admin-email-system.md)
- [docs/email-hook-setup.md](docs/email-hook-setup.md)

### 🤝 Contributing

1. Fork, branch, submit PR
2. Reference `docs/` for API, payment, email, admin technical details

### 📞 Contact

- [GitHub Issues](https://github.com/ruby0322/render-resume/issues)

---

*© 2024 RenderResume Team. All rights reserved.*
