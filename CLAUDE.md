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

### Development Guidelines

- **Styling**: Use `cn()` function for conditional classNames (required by .cursor/rules)
- **UI Components**: Check `@/components/ui` for shadcn components before creating new ones
- **Feature Documentation**: When making changes to files under `features/`, MUST update the corresponding README.md in that feature folder to document the changes
