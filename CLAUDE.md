# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `pnpm dev` (uses turbopack for faster builds)
- **Build**: `pnpm build`
- **Start production**: `pnpm start`
- **Lint**: `pnpm lint`
- **Package manager**: Always use `pnpm` (not npm or yarn)

## Architecture Overview

RenderResume is a Next.js 15 application with App Router that provides AI-powered resume analysis and generation services. The application uses a multi-dimensional evaluation system based on Fortune 500 standards.

### Core Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **UI Components**: Radix UI with shadcn/ui components
- **AI/ML**: LangChain, OpenAI GPT (including GPT-4 Vision)
- **Database/Auth**: Supabase (PostgreSQL + Auth)
- **Email**: Resend with React Email templates
- **Payment**: Third-party payment API integration
- **File Processing**: PDF, image, text processing with batch support
- **PDF Generation**: Puppeteer with Chromium for server-side rendering

### Project Structure

```
app/
├── (protected)/          # Auth-protected pages (dashboard, analyze, etc.)
├── api/                  # API routes for analysis, payment, email hooks
├── auth/                 # Authentication pages
└── admin/               # Admin panel for user/email management

components/
├── analysis/            # Resume analysis components
├── smart-chat/          # Interactive Q&A components  
├── ui/                  # shadcn/ui base components
├── upload/              # File upload components
└── emails/              # React Email templates

lib/
├── supabase/            # Supabase client configurations
├── prompts/             # AI prompt templates
├── types/               # TypeScript definitions
└── utils/               # Utility functions including cn() for className merging
```

### Key API Endpoints

- `/api/analyze/[service_type]` - Resume analysis (create/optimize)
- `/api/payment/checkout` - Payment processing
- `/api/payment/callback` - Payment webhook handling  
- `/api/hooks/send-email` - Supabase Auth email webhook
- `/api/smart-chat` - Interactive Q&A for resume optimization
- `/api/generate-pdf` - PDF generation from HTML content

### AI Analysis System

The core feature is a six-dimensional evaluation model:
1. Technical Depth & Breadth (25%)
2. Project Complexity & Impact (25%)
3. Professional Experience Completeness (20%)
4. Educational Background Relevance (15%)
5. Achievements & Validation (10%)
6. Overall Professional Image (5%)

Results include A+ to F grades with detailed Chain of Thought reasoning and improvement suggestions.

### Development Guidelines

- **Styling**: Use `cn()` function for conditional classNames (required by .cursor/rules)
- **UI Components**: Check `@/components/ui` for shadcn components before creating new ones
- **Typography**: Resume content uses serif fonts (Times New Roman) for PDF consistency
- **Responsive Design**: A4-sized resume previews with precise PDF matching
- **File Processing**: Supports PDF, images, text files with batch analysis capabilities

### Environment Configuration

Required environment variables include OpenAI API keys, Supabase configuration, payment API settings, email service keys, and webhook secrets. See README.md for complete setup.

### Testing & Quality

- Admin email system supports template previews and batch sending
- Payment integration includes callback simulation for testing
- PDF generation maintains 1:1 visual consistency with browser previews
- Resume analysis supports both single and batch processing modes