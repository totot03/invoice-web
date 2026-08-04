# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Building & Development

- **`npm run dev`** — Start Next.js dev server (localhost:3000)
- **`npm run build`** — Production build (compiles to `.next/`)
- **`npm start`** — Production server
- **`npm run lint`** — ESLint with `eslint-config-next/core-web-vitals` + TypeScript
- **`npm run format`** — Prettier code formatting
- **`npm run format:check`** — Check formatting without modifying files

## Code Style & Structure

- **TypeScript**: `strict: true`, ES2017 target, `@/*` alias to root
- **React 19**: App Router, RSC enabled, three route groups — `(marketing)`, `(auth)`, `(dashboard)`
- **Styling**: Tailwind CSS v4 (PostCSS plugin), shadcn/ui (Radix Nova style), `next-themes` (system/light/dark)
- **Icons**: lucide-react (^1.28.0)
- **Forms**: react-hook-form + Zod with Korean error messages; see `lib/validations/auth.ts`
- **Notifications**: Sonner toast component (`Toaster` in root layout)
- **Formatter**: Prettier configured with `semi: false`, `singleQuote: false`, `trailingComma: "es5"`, `printWidth: 100`, `tabWidth: 2`, `arrowParens: "avoid"`, `endOfLine: "lf"`. Run `npm run format` to apply or `npm run format:check` to verify.

## Components & Patterns

- **`components/ui/`** — shadcn/ui components (copy-paste from registry)
- **`components/layouts/`** — Page layout wrappers: `marketing-layout`, `auth-layout`, `dashboard-layout`, `site-header`, `site-footer`, `dashboard-header`, `dashboard-sidebar`
- **`components/patterns/`** — Reusable patterns: `empty-state`, `nav-link`, `user-menu`, `page-header`, `stat-card`, `logo`, `mobile-nav`, `section`

## Error Handling & Auth

- **Error boundary**: `app/error.tsx` catches client errors, displays `EmptyState` with retry button (uses `reset` callback). `app/not-found.tsx` handles 404 errors.
- **Demo auth**: Login form hardcoded in `app/(auth)/login/page.tsx` (line ~45) to accept `demo@example.com` / `demo123456` (not production-ready)
- **Form validation**: Zod schemas in `lib/validations/auth.ts` define email/password rules with Korean messages

## Git Conventions

Commit messages use numbered steps in Korean:  
`N단계: [Feature] (Details)`

Example: `5단계: 오류 해결 및 기능 완성 (로그인/회원가입 리다이렉트 + 헤더 네비게이션)`

## Code Review

코드 구현(신규 작성 또는 수정)을 완료한 직후 리뷰를 요청한다. 두 가지 방법이 있다:
- **`/review:code` 커맨드** (`.claude/commands/review/code.md`) — 슬래시 커맨드로 직접 실행, `git diff HEAD` 또는 지정 경로 전체 리뷰
- **`code-reviewer` 서브에이전트** (`.claude/agents/code-reviewer.md`) — 명시적 호출 시 백그라운드 전문 에이전트 실행

둘 모두 버그/성능/가독성/보안/개선안 5단계로 분석하고 리포트만 출력한다 (파일 자동 수정 안 함).

## Next.js 16 Breaking Changes

See `AGENTS.md` — this version has API and convention differences from older Next.js. Key changes:
- Error boundary callback is `unstable_retry`, not `reset` (current code still uses `reset` — Next.js 16 tolerates it, but new error boundaries should use `unstable_retry()`)
- Middleware is superseded by `proxy.ts` file convention (this project uses neither yet; when adding auth/redirect logic, use `proxy.ts` not `middleware.ts`)
- Server vs. Client Component boundary is strict (RSC rules apply)

## Config Files

- `tsconfig.json` — strict mode, ES2017, `@/*` path alias
- `postcss.config.mjs` + `app/globals.css` — Tailwind v4 uses PostCSS plugin, CSS variables via `@theme` directive (no separate `tailwind.config` file needed)
- `components.json` — shadcn/ui: Radix Nova style, RSC/TSX enabled
- `eslint.config.mjs` — Next.js flat config, TypeScript rules (not `.eslintrc.*`)
- `.prettierrc` — code formatting rules (see Code Style & Structure above)
- `next.config.ts` — minimal (no custom plugins)

## No Testing Framework

Jest/Vitest not configured. Add test framework if needed.

---

@AGENTS.md
