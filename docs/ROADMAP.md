# 견적서 웹 뷰어 & PDF 다운로드 개발 로드맵

Notion에 입력한 견적서를 클라이언트가 별도 프로그램 없이 웹에서 확인하고 PDF로 저장할 수 있게 하는 MVP.

## 개요

**견적서 웹 뷰어 & PDF 다운로드**는 Notion으로 견적서를 관리하는 프리랜서·소규모 사업자(관리자)와 링크로 견적서를 전달받는 클라이언트를 위한 "이중 입력 없는 견적서 전달 도구"로 다음 기능을 제공합니다:

- **[F001] Notion 견적서 동기화 조회**: 연결된 Notion 데이터베이스에서 견적서 목록(고객명, 금액, 작성일)을 가져와 대시보드에 표시
- **[F002] 견적서 상세 열람**: 클라이언트가 로그인 없이 공유 링크로 접속해 품목·단가·수량·합계·유효기간 확인
- **[F003] PDF 다운로드**: 열람 페이지에서 현재 견적서를 PDF 파일로 저장 (`@react-pdf/renderer`)
- **[F010] 기본 인증**: 관리자용 회원가입/로그인/로그아웃 (Supabase Auth)
- **[F011] 공유 링크 생성**: 견적서별 추측 불가능한 고유 토큰 링크 생성 및 복사

### 기술 스택

| 영역 | 스택 | 현재 상태 |
|------|------|----------|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript 5 | ✅ 설치 완료 |
| 스타일링 | TailwindCSS v4, shadcn/ui, lucide-react | ✅ 설치 완료 |
| 폼·검증 | React Hook Form 7, Zod 4 | ✅ 설치 완료 |
| 백엔드 | Supabase (Auth + PostgreSQL) | ⬜ 미설치 (`@supabase/supabase-js`) |
| 외부 연동 | Notion API | ⬜ 미설치 (`@notionhq/client`) |
| PDF | @react-pdf/renderer | ⬜ 미설치 |
| 배포 | Vercel | ⬜ 미구성 |

> ⚠️ **Next.js 16 주의**: 미들웨어는 `middleware.ts`가 아닌 `proxy.ts` 파일 컨벤션을 사용하고, 에러 바운더리 콜백은 `reset`이 아닌 `unstable_retry`를 사용한다. 코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드를 확인할 것 (`AGENTS.md` 참조).

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `docs/ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-routing-structure.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오를 정상 시나리오/에러 처리/엣지 케이스 3범주로 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `009`라면 `008`과 `007`을 예시로 참조.
- 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **구현 직후, 예외 없이 Playwright MCP로 테스트를 수행한다** (API 연동·비즈니스 로직 작업은 특히 정상 시나리오/에러 처리/엣지 케이스 3범주를 빠짐없이 검증)
- 테스트는 `browser_navigate`, `browser_click`, `browser_fill_form`, `browser_snapshot`, `browser_network_requests` 등 **실제 브라우저 동작으로 확인하며, 코드 리딩이나 추정으로 대체하지 않는다**
- 각 단계 후 작업 파일 내 단계 진행 상황과 테스트 결과(통과/실패)를 기록
- **🚦 게이트 원칙: "구현 완료 → 테스트 수행 → 통과"를 하나의 게이트로 취급한다. 테스트를 통과하기 전까지 해당 Task의 구현 사항은 완료(✅)로 표시하지 않는다.** 테스트 미수행·실패 항목은 미완료(`-`) 상태로 유지하고, 원인을 수정한 뒤 재테스트하여 통과한 경우에만 완료 처리한다
- 테스트 실패 시 다음 단계로 진행하지 않는다
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축

- **Task 001: 프로젝트 구조 및 라우팅 설정** - 우선순위 (부분 완료)
  - See: `/tasks/001-routing-structure.md`
  - ✅ 인증 라우트 그룹 생성 — `app/(auth)/layout.tsx`, `login/page.tsx`, `register/page.tsx`
  - ✅ 대시보드 라우트 그룹 생성 — `app/(dashboard)/layout.tsx`, `dashboard/page.tsx`
  - ✅ 루트 진입점 처리 — `app/page.tsx`에서 `/login`으로 redirect (마케팅 랜딩 없음)
  - ✅ 전역 에러 처리 골격 — `app/error.tsx`, `app/not-found.tsx`
  - ✅ 공통 레이아웃 골격 — `dashboard-header`, `dashboard-sidebar`, `auth-layout`
  - 견적서 공개 열람 라우트 생성 — `app/quote/[token]/page.tsx` (비로그인 접근, 라우트 그룹 밖)
  - 열람 페이지 전용 에러 UI 골격 — `app/quote/[token]/not-found.tsx` (유효하지 않은 토큰 대응)
  - 인증 보호 라우트 진입 규칙 정의 — `proxy.ts` 스켈레톤 작성 (Next.js 16은 `middleware.ts` 사용 안 함), 실제 세션 검사는 Task 007에서 연결

- **Task 002: 타입 정의 및 데이터 모델 설계**
  - `types/` 디렉토리 신규 생성 (현재 프로젝트에 존재하지 않음)
  - `types/user.ts` — `User` 인터페이스 정의 (`id: string(UUID)`, `email`, `name`, `created_at`) — 비밀번호 해시는 Supabase Auth가 관리하므로 앱 타입에서 제외
  - `types/quote-link.ts` — `QuoteLink` 인터페이스 정의 (`id`, `notion_page_id`, `token`, `user_id → User.id`, `created_at`)
  - `types/quote.ts` — Notion에서 조회할 견적서 도메인 타입 정의 (`QuoteSummary`: 고객명·금액·작성일 / `QuoteDetail`: 품목·단가·수량·합계·유효기간 / `QuoteItem`)
  - `types/api.ts` — API 응답 공통 래퍼 타입 정의 (`ApiResponse<T>`, `ApiError`) 및 에러 코드 상수
  - Supabase PostgreSQL 스키마 문서화 — `docs/schema.sql` 작성 (`users`, `quote_links` 테이블 + `token` UNIQUE 인덱스). **설계만, 실제 적용은 Task 006**
  - `lib/validations/quote.ts` — 토큰 형식 및 Notion 페이지 ID 검증용 Zod 스키마 정의

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 라이브러리 구현** (부분 완료)
  - See: `/tasks/003-component-library.md`
  - ✅ shadcn/ui 기반 컴포넌트 구축 — button, card, input, label, table, dialog, sheet, tabs, badge, alert, avatar, dropdown-menu, breadcrumb, separator, skeleton, scroll-area, sonner, field
  - ✅ 레이아웃 컴포넌트 — `components/layouts/`의 auth-layout, dashboard-layout, dashboard-header, dashboard-sidebar
  - ✅ 패턴 컴포넌트 — `components/patterns/`의 empty-state, logo, nav-link, page-header, stat-card, user-menu
  - ✅ 테마 시스템 — `next-themes` 기반 theme-provider / theme-toggle (system/light/dark)
  - 더미 데이터 유틸리티 작성 — `lib/dummy/quotes.ts`에 `QuoteSummary[]`, `QuoteDetail` 목업 생성 함수 구현 (Task 002 타입 기준)
  - 견적서 도메인 패턴 컴포넌트 추가 — `components/patterns/quote-card.tsx`(목록 항목), `copy-link-button.tsx`(클립보드 복사 + Sonner 토스트)
  - 금액·날짜 포맷 유틸 작성 — `lib/format.ts` (`formatCurrency` 원화 표기, `formatDate` YYYY-MM-DD)

- **Task 004: 인증·대시보드 페이지 UI 완성** (부분 완료)
  - See: `/tasks/004-page-ui.md`
  - ✅ 로그인 페이지 UI — 이메일/비밀번호 폼, react-hook-form + Zod 검증, 회원가입 이동 링크, 에러 Alert (`app/(auth)/login/page.tsx`)
  - ✅ 회원가입 페이지 UI — 이메일/비밀번호/비밀번호 확인 폼, 로그인 이동 링크 (`app/(auth)/register/page.tsx`)
  - ✅ 대시보드 골격 — `PageHeader` + 빈 상태(EmptyState) UI (`app/(dashboard)/dashboard/page.tsx`)
  - ✅ 인증 폼 Zod 스키마 — `lib/validations/auth.ts` (한국어 에러 메시지)
  - 회원가입 폼에 **이름(name) 필드 추가** — PRD 명세는 이메일/비밀번호/이름이나 현재 폼에 이름 입력이 없음. `registerSchema`도 함께 확장
  - 대시보드 견적서 목록 UI 완성 — 현재 `const quotes = []` 빈 배열 상태. Task 003 더미 데이터를 연결해 목록/카드 렌더링, 고객명·금액·작성일 표시, "공유 링크 복사" 버튼, 카드 클릭 시 미리보기 이동 동작 완성
  - 대시보드 로딩·에러 상태 UI — `loading.tsx`(Skeleton 목록), Notion 조회 실패 시 Alert 표시 골격
  - 반응형 검증 — 모바일(375px) / 태블릿 / 데스크톱에서 목록·헤더·사이드바 레이아웃 확인

- **Task 005: 견적서 열람 페이지 UI 구현 (F002 화면)**
  - `app/quote/[token]/page.tsx` UI 구현 — 현재 라우트·UI 모두 존재하지 않음
  - 견적서 헤더 영역 — 공급자/고객명, 견적 번호, 작성일, **유효기간** 배지 표시
  - 품목 테이블 구현 — shadcn `table` 기반으로 품목명·단가·수량·금액 컬럼, 소계/부가세/합계 요약 행
  - **PDF 다운로드** 버튼 배치 (UI만, 실제 생성 로직은 Task 010)
  - 유효하지 않은 링크 접근 시 에러 화면 — `EmptyState` 기반 "만료되었거나 존재하지 않는 링크" 안내
  - 인쇄/모바일 대응 — 좁은 화면에서 테이블 가로 스크롤, A4 비율 미리보기 컨테이너
  - 더미 `QuoteDetail` 데이터로 전체 화면 완성 (실제 Notion 연동은 Task 008/009)

### Phase 3: 핵심 기능 구현

> 🚦 **Phase 3 공통 게이트 원칙**: 아래 모든 Task는 API 연동·비즈니스 로직을 포함한다. 구현이 끝나도 **테스트 체크리스트의 정상 시나리오·에러 처리·엣지 케이스 3범주를 Playwright MCP로 실제 수행하고 통과 결과를 작업 파일에 기록하기 전까지 해당 구현 사항을 완료(✅)로 표시하지 않는다.** 테스트 실패 시 원인을 수정하고 재테스트한 뒤에만 완료 처리한다. 코드 리딩이나 추정으로 검증을 대체하지 않는다.

- **Task 006: Supabase 프로젝트 설정 및 DB 스키마 구축**
  - `@supabase/supabase-js`, `@supabase/ssr` 패키지 설치 (현재 미설치)
  - Supabase 프로젝트 생성 및 환경변수 구성 — `.env.local` + `.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
  - `lib/supabase/client.ts`(브라우저), `lib/supabase/server.ts`(RSC/Route Handler) 클라이언트 팩토리 작성
  - `quote_links` 테이블 마이그레이션 적용 — Task 002의 `docs/schema.sql` 실행, `token` UNIQUE 제약 + 조회 인덱스
  - RLS 정책 설정 — 관리자는 본인 `user_id` 행만 CRUD 가능, 공개 열람은 서버 사이드(service role)에서 `token` 단건 조회만 허용
  - 연결 스모크 테스트 — 서버에서 `quote_links` 빈 조회가 200으로 응답하는지 확인
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 ✅ 표시 금지
    - **정상 시나리오**
      - [ ] 앱 기동 후 대시보드 진입 시 Supabase 초기화 에러 없이 렌더링되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] `quote_links` 빈 조회 요청이 2xx로 응답하는지 (`browser_network_requests`)
      - [ ] 브라우저 콘솔에 Supabase 관련 에러/경고가 없는지 (`browser_console_messages`)
    - **에러 처리**
      - [ ] 환경변수(`NEXT_PUBLIC_SUPABASE_URL`) 누락 시 앱 크래시 대신 명확한 에러 화면이 노출되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 잘못된 anon key 설정 시 401 응답과 사용자향 에러 메시지가 표시되는지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] Supabase 도메인 요청 실패(오프라인) 시 무한 로딩에 빠지지 않는지 (`browser_network_requests` + `browser_snapshot`)
    - **엣지 케이스**
      - [ ] `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트 번들·네트워크 응답·DOM 어디에도 노출되지 않는지 (`browser_network_requests` + `browser_evaluate`)
      - [ ] 다른 사용자의 `user_id` 행이 RLS로 차단되어 0건 반환되는지 (`browser_network_requests`)
      - [ ] 동일 페이지 연속 새로고침 시 커넥션 누수 없이 일관된 응답을 주는지 (`browser_navigate` 반복 + `browser_network_requests`)

- **Task 007: 인증 시스템 구현 (F010)**
  - Supabase Auth 연동 — 현재 로그인은 `demo@example.com` / `demo123456` 하드코딩 시뮬레이션이며 실제 API 호출 없음. 이를 `signInWithPassword`로 교체
  - 회원가입 실제 연동 — `signUp` 호출 + `name`을 user metadata 또는 `users` 프로필 행으로 저장, 성공 시 로그인 페이지 이동
  - 로그아웃 구현 — `user-menu`에서 `signOut` 호출 후 `/login` 리다이렉트
  - 세션 관리 — `proxy.ts`에서 세션 쿠키 갱신 및 보호 라우트 처리 (`/dashboard` 미인증 → `/login`, 로그인 상태에서 `/login` → `/dashboard`)
  - 공개 라우트 예외 처리 — `/quote/[token]`은 인증 검사에서 제외
  - 로그인 실패·중복 이메일 등 Supabase 에러 메시지 한국어 매핑
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 ✅ 표시 금지
    - **정상 시나리오**
      - [ ] 회원가입 폼(이메일/비밀번호/이름) 제출 후 로그인 페이지로 이동하는지 (`browser_fill_form` + `browser_click` + `browser_snapshot`)
      - [ ] 가입한 계정으로 로그인 시 `/dashboard`로 리다이렉트되는지 (`browser_fill_form` + `browser_click` + `browser_snapshot`)
      - [ ] 로그인 요청이 Supabase Auth 엔드포인트로 실제 발생하는지 (하드코딩 시뮬레이션이 아님을 확인) (`browser_network_requests`)
      - [ ] 로그아웃 클릭 시 세션이 종료되고 `/login`으로 이동하는지 (`browser_click` + `browser_snapshot`)
      - [ ] 새로고침 후에도 로그인 세션이 유지되는지 (`browser_navigate` + `browser_snapshot`)
    - **에러 처리**
      - [ ] 잘못된 비밀번호 입력 시 한국어 에러 Alert이 노출되는지 (`browser_fill_form` + `browser_snapshot`)
      - [ ] 존재하지 않는 이메일로 로그인 시도 시 계정 존재 여부가 유추되지 않는 메시지가 나오는지 (`browser_snapshot`)
      - [ ] 이미 가입된 이메일로 재가입 시 중복 에러가 표시되는지 (`browser_fill_form` + `browser_snapshot`)
      - [ ] Zod 검증 위반(형식 오류 이메일, 짧은 비밀번호, 비밀번호 불일치) 시 필드별 에러가 표시되고 네트워크 요청이 발생하지 않는지 (`browser_fill_form` + `browser_network_requests`)
      - [ ] 인증 API 타임아웃/네트워크 오류 시 로딩 상태가 해제되고 에러가 안내되는지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] 미인증 상태에서 `/dashboard` 직접 접근 시 `/login`으로 리다이렉트되는지 (`browser_navigate` + `browser_snapshot`)
    - **엣지 케이스**
      - [ ] 로그아웃 후 뒤로가기로 대시보드 재진입이 차단되는지 (`browser_navigate_back` + `browser_snapshot`)
      - [ ] 로그인 상태에서 `/login` 접근 시 `/dashboard`로 리다이렉트되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 로그인 버튼 연속 중복 클릭 시 요청이 1회만 발생하는지 (`browser_click` 반복 + `browser_network_requests`)
      - [ ] 공백만 입력, 초장문 이메일(255자 이상) 등 경계값 입력이 안전하게 거부되는지 (`browser_type` + `browser_snapshot`)
      - [ ] 공개 라우트 `/quote/[token]`이 인증 검사에서 제외되어 리다이렉트되지 않는지 (`browser_navigate` + `browser_snapshot`)

- **Task 008: Notion API 연동 및 견적서 목록 조회 (F001)**
  - `@notionhq/client` 설치 및 `lib/notion/client.ts` 작성 (현재 미설치)
  - 환경변수 추가 — `NOTION_API_KEY`, `NOTION_DATABASE_ID`
  - Notion 데이터베이스 쿼리 함수 — `getQuoteList()`가 고객명·금액·작성일을 조회해 `QuoteSummary[]`로 매핑, 정렬(작성일 내림차순) 및 페이지네이션 커서 처리
  - Notion 페이지 상세 조회 함수 — `getQuoteDetail(pageId)`가 품목 블록/속성을 `QuoteDetail`로 매핑
  - Notion 속성 매핑 계층 분리 — `lib/notion/mappers.ts`로 스키마 변경 시 영향 범위 최소화
  - 대시보드 더미 데이터를 실제 조회로 교체 — RSC에서 직접 호출, 실패 시 에러 UI 표시
  - 레이트 리밋·타임아웃·속성 누락에 대한 방어 로직 및 캐싱(`revalidate`) 적용
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 ✅ 표시 금지
    - **정상 시나리오**
      - [ ] 로그인 후 대시보드에 Notion 견적서 목록이 렌더링되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 각 항목의 고객명·금액·작성일이 Notion 원본 값과 일치하게 매핑되는지 (`browser_snapshot`)
      - [ ] 목록이 작성일 내림차순으로 정렬되는지 (`browser_snapshot`)
      - [ ] 조회 요청이 2xx로 성공하고 목표 응답 시간(2초 이내)에 완료되는지 (`browser_network_requests`)
      - [ ] 더미 데이터가 아닌 실제 Notion 응답으로 교체되었는지 (`browser_network_requests`)
    - **에러 처리**
      - [ ] 잘못된 `NOTION_API_KEY`(401) 시 에러 UI가 표시되고 앱이 크래시하지 않는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 잘못된 `NOTION_DATABASE_ID`(404) 시 사용자향 에러 메시지가 노출되는지 (`browser_snapshot`)
      - [ ] Notion 레이트 리밋(429) 응답 시 재시도 또는 안내 처리가 동작하는지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] API 타임아웃·네트워크 단절 시 무한 스켈레톤에 머물지 않고 에러 상태로 전환되는지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] 속성이 누락된(금액·작성일 없음) 페이지가 섞여 있어도 목록 전체가 깨지지 않는지 (`browser_snapshot`)
    - **엣지 케이스**
      - [ ] 견적서 0건일 때 빈 상태 UI가 표시되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 100건 이상 대량 데이터에서 페이지네이션 커서 처리와 렌더링이 정상인지 (`browser_snapshot` + `browser_network_requests`)
      - [ ] 금액 0원, 초장문 고객명, 특수문자 포함 고객명이 레이아웃을 깨뜨리지 않는지 (`browser_snapshot`)
      - [ ] 캐시(`revalidate`) 적용 후 연속 새로고침 시 중복 API 호출이 발생하지 않는지 (`browser_navigate` 반복 + `browser_network_requests`)

- **Task 009: 공유 링크 생성 및 공개 열람 연동 (F011 + F002)**
  - 토큰 생성 로직 — `crypto.randomUUID()` 또는 32자 이상 난수(base64url)로 추측 불가능한 `token` 생성
  - 링크 생성 API — `POST /api/quote-links` (인증 필요), `notion_page_id` 기준 기존 링크 재사용 또는 신규 발급 후 `QuoteLink` 반환
  - 대시보드 "공유 링크 복사" 버튼 실제 연동 — 링크 발급 → 클립보드 복사 → Sonner 토스트, 실패 시 에러 토스트
  - 공개 열람 페이지 데이터 연동 — `/quote/[token]`에서 `token`으로 `quote_links` 조회 → `notion_page_id`로 `getQuoteDetail()` 호출 → 상세 렌더링 (인증 불필요)
  - 유효하지 않은/삭제된 토큰 처리 — `notFound()` 또는 전용 에러 화면 반환, 내부 ID·Notion 페이지 ID 노출 금지
  - 대시보드 견적서 카드 클릭 시 관리자 미리보기 이동 연결
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 ✅ 표시 금지
    - **정상 시나리오**
      - [ ] "공유 링크 복사" 클릭 시 링크 발급 요청이 2xx로 성공하고 성공 토스트가 뜨는지 (`browser_click` + `browser_network_requests` + `browser_snapshot`)
      - [ ] 복사된 URL로 새 탭(비로그인 컨텍스트) 접속 시 견적서 상세가 표시되는지 (`browser_tabs` + `browser_navigate` + `browser_snapshot`)
      - [ ] 열람 페이지에 품목·단가·수량·합계·유효기간이 모두 렌더링되는지 (`browser_snapshot`)
      - [ ] 대시보드 견적서 카드 클릭 시 관리자 미리보기로 이동하는지 (`browser_click` + `browser_snapshot`)
    - **에러 처리**
      - [ ] 존재하지 않는 토큰(`/quote/invalid-token`) 접근 시 404/에러 화면이 표시되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 삭제된 Notion 페이지에 연결된 토큰 접근 시 안전한 에러 안내가 나오는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 미인증 상태에서 `POST /api/quote-links` 호출 시 401이 반환되는지 (`browser_network_request`)
      - [ ] 링크 생성 API 실패·네트워크 오류 시 에러 토스트가 노출되고 버튼이 복구되는지 (`browser_click` + `browser_snapshot`)
      - [ ] 클립보드 권한 거부 시 대체 안내(수동 복사)가 제공되는지 (`browser_click` + `browser_snapshot`)
    - **엣지 케이스**
      - [ ] 같은 견적서에 링크를 두 번 생성해도 URL이 일관되게 동작하는지 (중복 발급 방지) (`browser_click` 반복 + `browser_network_requests`)
      - [ ] 비로그인 상태에서 열람 페이지가 `/login`으로 리다이렉트되지 **않는지** (`browser_navigate` + `browser_snapshot`)
      - [ ] 응답·DOM·URL에 내부 `id`나 `notion_page_id`가 노출되지 않고 `token`만 사용되는지 (`browser_network_requests` + `browser_evaluate`)
      - [ ] 타 사용자가 만든 링크의 토큰을 알아도 열람만 되고 관리 API는 차단되는지 (`browser_network_request`)
      - [ ] 품목 0건·유효기간 만료 견적서에서도 페이지가 정상 렌더링되는지 (`browser_snapshot`)
      - [ ] 토큰에 특수문자·초장문 문자열을 넣어도 서버 오류 없이 처리되는지 (`browser_navigate` + `browser_snapshot`)

- **Task 010: PDF 다운로드 구현 (F003)**
  - `@react-pdf/renderer` 설치 (현재 미설치)
  - PDF 문서 컴포넌트 작성 — `components/pdf/quote-document.tsx`에 헤더·품목 테이블·합계·유효기간 레이아웃 구성
  - 한글 폰트 임베딩 — `Font.register()`로 한글 웹폰트 등록 (미등록 시 한글 깨짐)
  - 다운로드 트리거 구현 — 클라이언트 사이드 `usePDF`/`BlobProvider` 기반, 파일명 규칙 `견적서_{고객명}_{작성일}.pdf`
  - 생성 중 로딩 상태 및 실패 시 에러 토스트 처리
  - 열람 페이지 데이터와 PDF 문서의 값 일치 검증 (합계·부가세 계산 로직을 `lib/format.ts`로 단일화)
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 ✅ 표시 금지
    - **정상 시나리오**
      - [ ] 공유 링크 접속 → PDF 다운로드 버튼 클릭 → 파일 다운로드가 완료되는지 (`browser_navigate` + `browser_click` + `browser_snapshot`)
      - [ ] 다운로드 파일명이 `견적서_{고객명}_{작성일}.pdf` 규칙과 확장자를 따르는지 (`browser_snapshot` + `browser_evaluate`)
      - [ ] 생성 중 로딩 상태가 표시되고 완료 후 정상 복구되는지 (`browser_click` + `browser_snapshot`)
      - [ ] PDF 내 금액·합계·부가세가 화면에 표시된 값과 일치하는지 (`browser_snapshot` 대조)
      - [ ] 한글 고객명·품목명이 깨지지 않고 폰트가 임베딩되는지 (`browser_evaluate`)
    - **에러 처리**
      - [ ] 견적서 데이터 로드 실패 상태에서 다운로드 버튼이 비활성화되거나 에러 토스트가 뜨는지 (`browser_click` + `browser_snapshot`)
      - [ ] PDF 생성 중 예외 발생 시 로딩이 해제되고 에러 토스트가 노출되는지 (`browser_snapshot` + `browser_console_messages`)
      - [ ] 폰트 리소스 로드 실패(네트워크 차단) 시 크래시 없이 처리되는지 (`browser_network_requests` + `browser_snapshot`)
    - **엣지 케이스**
      - [ ] 품목 20건 이상 견적서에서 페이지 분할이 정상 동작하는지 (`browser_click` + `browser_snapshot`)
      - [ ] 품목 0건·금액 0원 견적서에서도 PDF가 생성되는지 (`browser_click` + `browser_snapshot`)
      - [ ] 다운로드 버튼 연속 중복 클릭 시 생성이 1회만 수행되는지 (`browser_click` 반복 + `browser_network_requests`)
      - [ ] 모바일 뷰포트(375px)에서도 다운로드가 동작하는지 (`browser_resize` + `browser_click`)
      - [ ] 초장문 품목명·특수문자가 PDF 레이아웃을 깨뜨리지 않는지 (`browser_snapshot`)

- **Task 010-1: 핵심 기능 통합 테스트**
  - Playwright MCP로 PRD 사용자 여정 전체를 실제 브라우저에서 재현 (코드 리딩·추정 검증 금지)
  - 통합 시나리오 실행 결과를 작업 파일에 통과/실패로 기록하고, 실패 항목은 원인 수정 후 재테스트
  - **테스트 체크리스트 (Playwright MCP)** — 🚦 3범주 모두 통과 전까지 Phase 3 완료로 표시 금지
    - **정상 시나리오**
      - [ ] 전체 여정 E2E: 회원가입 → 로그인 → 대시보드 목록 → 링크 복사 → 비로그인 열람 → PDF 다운로드 (`browser_navigate` + `browser_fill_form` + `browser_click` + `browser_snapshot`)
      - [ ] 관리자 미리보기 경로(대시보드 → 열람 페이지) 별도 검증 (`browser_click` + `browser_snapshot`)
      - [ ] 전 구간 네트워크 요청이 2xx이며 불필요한 중복 호출이 없는지 (`browser_network_requests`)
      - [ ] 전 구간 콘솔에 에러가 발생하지 않는지 (`browser_console_messages`)
    - **에러 처리**
      - [ ] Notion API 장애 상황에서 대시보드가 에러 UI로 안전하게 degrade되는지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] Supabase 연결 실패 시 로그인·링크 생성이 명확한 에러로 처리되는지 (`browser_snapshot`)
      - [ ] 만료·위조 토큰 접근이 일관된 에러 화면으로 차단되는지 (`browser_navigate` + `browser_snapshot`)
      - [ ] 네트워크 오프라인 전환 시 각 페이지가 무한 로딩 없이 복구 가능한지 (`browser_network_requests` + `browser_snapshot`)
      - [ ] 세션 만료 후 보호 라우트 접근이 `/login`으로 유도되는지 (`browser_navigate` + `browser_snapshot`)
    - **엣지 케이스**
      - [ ] 견적서 0건 / 품목 0건 / 금액 0원 / 유효기간 만료 견적서 전 구간 동작 (`browser_snapshot`)
      - [ ] 초장문 고객명·특수문자 데이터에서 목록·열람·PDF 레이아웃 유지 (`browser_snapshot`)
      - [ ] 타 사용자의 `quote_links` 접근 차단 및 서버 전용 키 미노출 확인 (`browser_network_requests` + `browser_evaluate`)
      - [ ] 동일 액션(로그인·링크 생성·PDF 생성) 중복 요청 방지 동작 (`browser_click` 반복 + `browser_network_requests`)
      - [ ] 모바일(375px)·데스크톱 뷰포트에서 전체 플로우 회귀 재실행 (`browser_resize` + `browser_navigate`)

### Phase 4: 고급 기능 및 최적화

- **Task 011: 사용자 경험 향상 및 안정성 강화**
  - 로딩 경험 개선 — 대시보드·열람 페이지 Skeleton 및 Suspense 경계 정리
  - 접근성 보완 — 키보드 내비게이션, 포커스 링, 테이블/버튼 aria 속성, 색 대비 검증
  - 견적서 목록 검색·정렬 (고객명 검색, 작성일/금액 정렬) — 클라이언트 필터링 수준
  - 열람 페이지 메타데이터 — `generateMetadata`로 제목 설정 및 `robots: noindex`로 검색엔진 색인 차단
  - 전역 에러 바운더리 정비 — Next.js 16 기준 `unstable_retry()` 적용 (현재 `reset` 사용 중)
  - 다크 모드에서 견적서 열람·PDF 미리보기 가독성 점검

- **Task 012: 성능 최적화 및 Vercel 배포**
  - Notion 조회 캐싱 전략 — `revalidate` 설정 및 태그 기반 재검증, 응답 시간 목표(목록 2초 이내) 측정
  - 번들 최적화 — `@react-pdf/renderer` 동적 import로 초기 로딩 분리, `next build` 번들 사이즈 확인
  - 테스트 프레임워크 도입 — Vitest 구성 및 매핑/포맷/토큰 생성 유틸 단위 테스트 (현재 테스트 프레임워크 없음)
  - CI 파이프라인 — GitHub Actions에서 `npm run lint`, `npm run format:check`, `npm run build` 검증
  - Vercel 배포 — 프로젝트 연결, 환경변수(Supabase/Notion) 등록, 프리뷰/프로덕션 분리
  - 운영 모니터링 — Vercel Analytics 및 서버 에러 로깅 설정, 배포 후 프로덕션 URL로 Playwright MCP 스모크 테스트

## 진행 현황 요약

| Phase | 상태 | Task | 비고 |
|-------|------|------|------|
| Phase 1: 애플리케이션 골격 구축 | 진행 중 | 001(부분 완료), 002 | 견적서 열람 라우트·`types/` 미생성 |
| Phase 2: UI/UX 완성 | 진행 중 | 003(부분 완료), 004(부분 완료), 005 | 더미 데이터·열람 페이지 UI 미완성 |
| Phase 3: 핵심 기능 구현 | 대기 | 006, 007, 008, 009, 010, 010-1 | Supabase/Notion/PDF 패키지 미설치, 전 Task 테스트 게이트 적용 |
| Phase 4: 고급 기능 및 최적화 | 대기 | 011, 012 | 테스트 프레임워크·CI 미구성 |

## 기능 ID ↔ Task 매핑

| 기능 ID | 기능명 | 관련 Task |
|---------|--------|-----------|
| F001 | Notion 견적서 동기화 조회 | 002, 004, 008 |
| F002 | 견적서 상세 열람 | 001, 005, 009 |
| F003 | PDF 다운로드 | 005, 010 |
| F010 | 기본 인증 | 004, 006, 007 |
| F011 | 공유 링크 생성 | 002, 003, 006, 009 |
