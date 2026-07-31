# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Building & Development

- **`npm run dev`** — Start Next.js dev server (localhost:3000)
- **`npm run build`** — Production build (compiles to `.next/`)
- **`npm start`** — Production server
- **`npm run lint`** — ESLint with `eslint-config-next/core-web-vitals` + TypeScript

No formatter: **Prettier is not configured**. Keep consistent indentation in edits (2 spaces, matching existing files).

## Code Style & Structure

- **TypeScript**: `strict: true`, ES2017 target, `@/*` alias to root
- **React 19**: App Router, RSC enabled, three route groups — `(marketing)`, `(auth)`, `(dashboard)`
- **Styling**: Tailwind CSS v4 (PostCSS plugin), shadcn/ui (Radix Nova style), `next-themes` (system/light/dark)
- **Icons**: lucide-react (5.28.0+)
- **Forms**: react-hook-form + Zod with Korean error messages; see `lib/validations/auth.ts`
- **Notifications**: Sonner toast component (`Toaster` in root layout)

## Components & Patterns

- **`components/ui/`** — shadcn/ui components (copy-paste from registry)
- **`components/layouts/`** — Page layout wrappers (`marketing-layout`, `auth-layout`, `dashboard-layout`)
- **`components/patterns/`** — Reusable patterns (`empty-state`, `nav-link`, `user-menu`, `page-header`, `stat-card`)

## Error Handling & Auth

- **Error boundary**: `app/error.tsx` catches client errors, displays `EmptyState` with retry button (uses `reset` callback, Next.js 16)
- **Demo auth**: Login form hardcoded to accept `demo@example.com` / `demo123456` (not production-ready)
- **Form validation**: Zod schemas in `lib/validations/auth.ts` define email/password rules with Korean messages

## Git Conventions

Commit messages use numbered steps in Korean:  
`N단계: [Feature] (Details)`

Example: `5단계: 오류 해결 및 기능 완성 (로그인/회원가입 리다이렉트 + 헤더 네비게이션)`

## Next.js 16 Breaking Changes

See `AGENTS.md` — this version has API and convention differences from older Next.js. Key changes:
- Error boundary callback is `unstable_retry`, not `reset` (current code still uses `reset` — Next.js 16 tolerates it)
- Middleware is superseded by `proxy.ts` file convention (this project uses neither yet)
- Server vs. Client Component boundary is strict (RSC rules apply)

## Config Files

- `tsconfig.json` — strict mode, ES2017, `@/*` path alias
- `tailwind.config.mjs` — CSS variables enabled, "neutral" base color
- `components.json` — shadcn/ui: Radix Nova style, RSC/TSX enabled
- `.eslintrc.config.mjs` — Next.js flat config, TypeScript rules
- `next.config.ts` — minimal (no custom plugins)

## No Testing Framework

Jest/Vitest not configured. Add test framework if needed.

---

@AGENTS.md
