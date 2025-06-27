# RenderResume - AI 履歷生成器

*[English](#english) | [繁體中文](#繁體中文)*

---

## 繁體中文

### 📝 專案簡介

RenderResume 是一個採用 AI 技術的專業履歷與作品集生成器，基於 Fortune 500 企業標準的六維度評估模型，運用 STAR 原則架構，協助求職者打造具有競爭力的履歷。

### ✨ 主要特色

- **🧠 AI 智能解析** - 上傳履歷或作品集即可進行深度分析
- **📊 六維度專業評分** - 基於 Fortune 500 企業標準的評估體系
- **💬 智能問答優化** - 透過對話引導補充關鍵履歷亮點
- **⭐ STAR 原則重構** - 自動將經歷重新架構為有說服力的表達
- **📈 個性化建議** - 提供量身定制的履歷優化建議
- **🌐 多語言支援** - 支援繁體中文與英文介面

### 🎯 六維度評估模型

1. **💻 技術深度與廣度** (25%) - 技術棧掌握程度與創新能力
2. **🚀 項目複雜度與影響力** (25%) - 項目規模與商業成果
3. **💼 專業經驗完整度** (20%) - 職涯發展軌跡與領導經驗  
4. **🎓 教育背景匹配度** (15%) - 學歷相關性與持續學習
5. **🏆 成果與驗證** (10%) - 專業成就與外部認可
6. **✨ 整體專業形象** (5%) - 履歷呈現與個人品牌

### 🛠 技術架構

- **前端框架**: Next.js 15 with React 19
- **樣式設計**: Tailwind CSS + Radix UI
- **AI 整合**: LangChain + OpenAI GPT
- **檔案處理**: PDF 解析、圖片識別、文件上傳
- **部署平台**: Vercel
- **資料庫**: Supabase
- **身份驗證**: Supabase Auth

### 📋 系統需求

- Node.js 18.0 或更高版本
- npm 或 yarn 套件管理器
- 現代瀏覽器支援 (Chrome, Firefox, Safari, Edge)

### 🚀 快速開始

#### 1. 複製專案

```bash
git clone https://github.com/your-username/render-resume.git
cd render-resume
```

#### 2. 安裝相依套件

```bash
npm install
# 或
yarn install
```

#### 3. 設定環境變數

建立 `.env.local` 檔案：

```env
# OpenAI API 設定
OPENAI_API_KEY=your_openai_api_key_here

# Supabase 設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 可選配置
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.3
```

#### 4. 啟動開發伺服器

```bash
npm run dev
# 或
yarn dev
```

在瀏覽器開啟 [http://localhost:3000](http://localhost:3000) 查看應用程式。

### 📚 主要功能

#### AI 履歷分析

上傳支援多種格式：
- **PDF 文件** - 自動解析履歷內容
- **圖片格式** - JPG, PNG, GIF, WebP
- **文字文件** - TXT, MD, JSON, CSV

#### 評分系統

根據以下標準進行評估：
- **A+**: 95-100 分 - 頂尖表現
- **A**: 90-94 分 - 優秀表現  
- **B+**: 85-89 分 - 良好表現
- **B**: 80-84 分 - 中等偏上
- **C**: 70-79 分 - 中等表現
- **D**: 60-69 分 - 需要改進
- **F**: 低於 60 分 - 急需優化

### 🔧 開發指令

```bash
# 開發模式
npm run dev

# 建置專案
npm run build

# 啟動正式環境
npm start

# 代碼檢查
npm run lint
```

### 📁 專案結構

```
render-resume/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── (protected)/       # 受保護頁面
│   ├── auth/              # 身份驗證頁面
│   └── globals.css        # 全域樣式
├── components/            # React 元件
│   ├── ui/               # UI 基礎元件
│   ├── auth/             # 身份驗證元件
│   └── upload/           # 檔案上傳元件
├── lib/                  # 工具函式與配置
├── types/                # TypeScript 型別定義
├── docs/                 # 專案文件
└── public/               # 靜態資源
```

### 🤝 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 建立 Pull Request

### 📄 授權條款

此專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

### 📞 聯絡資訊

- 專案連結: [https://github.com/ruby0322/render-resume](https://github.com/ruby0322/render-resume)
- 問題回報: [GitHub Issues](https://github.com/ruby0322/render-resume/issues)

---

## English

### 📝 Project Overview

RenderResume is an AI-powered professional resume and portfolio generator built on Fortune 500 enterprise standards with a six-dimensional evaluation model, utilizing the STAR methodology framework to help job seekers create competitive resumes.

### ✨ Key Features

- **🧠 AI Intelligent Analysis** - Upload resumes or portfolios for deep analysis
- **📊 Six-Dimensional Professional Scoring** - Evaluation system based on Fortune 500 standards
- **💬 Smart Q&A Optimization** - Guided conversations to identify key resume highlights
- **⭐ STAR Methodology Reconstruction** - Automatically restructures experiences into compelling narratives
- **📈 Personalized Recommendations** - Tailored resume optimization suggestions
- **🌐 Multi-language Support** - Traditional Chinese and English interface support

### 🎯 Six-Dimensional Evaluation Model

1. **💻 Technical Depth & Breadth** (25%) - Technology stack mastery and innovation
2. **🚀 Project Complexity & Impact** (25%) - Project scale and business outcomes
3. **💼 Professional Experience Completeness** (20%) - Career trajectory and leadership experience
4. **🎓 Educational Background Relevance** (15%) - Academic relevance and continuous learning
5. **🏆 Achievements & Validation** (10%) - Professional accomplishments and external recognition
6. **✨ Overall Professional Image** (5%) - Resume presentation and personal branding

### 🛠 Technology Stack

- **Frontend Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS + Radix UI
- **AI Integration**: LangChain + OpenAI GPT
- **File Processing**: PDF parsing, image recognition, document upload
- **Deployment**: Vercel
- **Database**: Supabase
- **Authentication**: Supabase Auth

### 📋 System Requirements

- Node.js 18.0 or higher
- npm or yarn package manager
- Modern browser support (Chrome, Firefox, Safari, Edge)

### 🚀 Quick Start

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/render-resume.git
cd render-resume
```

#### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

#### 3. Environment Setup

Create a `.env.local` file:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional Configuration
OPENAI_MODEL=gpt-4o-mini
OPENAI_TEMPERATURE=0.3
```

#### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 📚 Main Features

#### AI Resume Analysis

Supports multiple file formats:
- **PDF Documents** - Automatic resume content parsing
- **Image Formats** - JPG, PNG, GIF, WebP
- **Text Documents** - TXT, MD, JSON, CSV

#### Scoring System

Evaluation based on the following criteria:
- **A+**: 95-100 points - Exceptional performance
- **A**: 90-94 points - Excellent performance
- **B+**: 85-89 points - Good performance
- **B**: 80-84 points - Above average
- **C**: 70-79 points - Average performance
- **D**: 60-69 points - Needs improvement
- **F**: Below 60 points - Requires significant optimization

### 🔧 Development Commands

```bash
# Development mode
npm run dev

# Build project
npm run build

# Start production
npm start

# Lint code
npm run lint
```

### 📁 Project Structure

```
render-resume/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (protected)/       # Protected pages
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── upload/           # File upload components
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
├── docs/                 # Project documentation
└── public/               # Static assets
```

### 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 📞 Contact

- Project Link: [https://github.com/your-username/render-resume](https://github.com/your-username/render-resume)
- Issue Tracker: [GitHub Issues](https://github.com/your-username/render-resume/issues)

---

*© 2024 RenderResume Team. All rights reserved.*
