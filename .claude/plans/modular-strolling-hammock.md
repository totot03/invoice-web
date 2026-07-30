# Starter Kit 컴포넌트/레이아웃 계층 설계

## Context

현재 starter kit에는 shadcn/ui 컴포넌트 9개(avatar, badge, button, card, dropdown-menu, input, label, separator, sonner)와 홈페이지 데모, 다크모드 토글, 단일 헤더만 구성되어 있다. 이는 "홈페이지 하나"를 위한 구성이지 재사용 가능한 starter kit은 아니다.

사용자는 이번 요청에서 "어떤 웹사이트에도 필요한" 컴포넌트/레이아웃을 계층적으로 분류하고, shadcn/ui로 실제 구현하며, 새 기능이 필요할 때는 검증된 라이브러리를 우선 사용(바퀴 재발명 금지)할 것을 요구했다. 확인 질문을 통해 범위를 다음과 같이 확정했다:

- 레이아웃 4종: 마케팅/랜딩, 대시보드, 인증(로그인/회원가입), 에러/상태(404/500)
- 폼: react-hook-form + zod + @hookform/resolvers + shadcn `form` 컴포넌트
- 모바일 내비게이션: shadcn `sheet` (Radix Dialog 기반)
- 사이드바: shadcn 공식 Sidebar(대형 세트)는 사용하지 않고, 기존 `site-header.tsx` 수준의 가벼운 커스텀 컴포넌트로 직접 구현

목표는 4단계 계층(Primitives → Patterns → Layouts → Pages)으로 컴포넌트를 조직해, 이후 실제 프로젝트를 시작할 때 레이아웃 셸과 패턴을 그대로 재사용할 수 있게 만드는 것이다.

## 계층 구조

1. **`components/ui/`** — Primitives. shadcn CLI로만 추가/수정 (data-slot, cva+data-variant/data-size, radix-ui 통합 import 컨벤션 유지)
2. **`components/patterns/`** — Composite. 여러 primitive를 조합한 도메인 무관 재사용 패턴
3. **`components/layouts/`** — Layout Shell. 페이지 뼈대, children을 감싸는 서버 컴포넌트
4. **`app/**`** — Pages/Templates. 라우트 그룹별 실제 페이지

라우트 그룹 `(marketing)`, `(auth)`, `(dashboard)`를 사용해 그룹별로 다른 `layout.tsx`를 두고, 그룹마다 다른 레이아웃 셸(헤더 유무, 사이드바 유무)을 적용한다. Root `app/layout.tsx`는 `ThemeProvider` + `Toaster`만 남기고 `SiteHeader`는 제거한다(현재는 root에 박혀 있어 대시보드/인증 페이지에도 마케팅 헤더가 노출되는 문제가 있음).

## 디렉터리 설계

```
components/
  ui/                        # 기존 9개 + 신규 설치분
  patterns/
    logo.tsx                  # site-header.tsx에서 로고 마크업 추출
    nav-link.tsx               # active state 포함, header/sidebar 공용
    mobile-nav.tsx             # Sheet 기반 햄버거 메뉴
    user-menu.tsx               # Avatar+DropdownMenu (로그아웃 등)
    page-header.tsx             # 제목+설명+액션 슬롯 (대시보드 내부 페이지용)
    empty-state.tsx              # 아이콘+제목+설명+액션 (404/500/빈 목록 공용)
    stat-card.tsx                 # 대시보드 지표 카드
    section.tsx                    # mx-auto max-w-* px-6 래퍼 통일
  layouts/
    site-header.tsx             # 기존 components/site-header.tsx 이동 + 모바일 대응 추가
    site-footer.tsx              # 신규
    marketing-layout.tsx          # SiteHeader + children + SiteFooter
    auth-layout.tsx                # 로고 + 중앙 정렬 카드 슬롯
    dashboard-sidebar.tsx           # 커스텀 사이드바 (shadcn Sidebar 미사용)
    dashboard-header.tsx             # Breadcrumb + UserMenu + ThemeToggle
    dashboard-layout.tsx              # Sidebar + Header + children
  theme-provider.tsx           # 기존 유지, 위치 변경 없음
  theme-toggle.tsx              # 기존 유지, 위치 변경 없음 (여러 레이아웃에서 재사용)

app/
  layout.tsx                  # 수정: SiteHeader 제거, ThemeProvider+children+Toaster만
  not-found.tsx                # 신규: 404 (EmptyState 재사용)
  error.tsx                    # 신규: 런타임 에러 ("use client" 필수, EmptyState+reset())
  (marketing)/
    layout.tsx                  # LayoutProps<'/(marketing)'> , MarketingLayout 적용
    page.tsx                     # 기존 app/page.tsx 이동, Section 패턴 적용
  (auth)/
    layout.tsx                   # AuthLayout 적용
    login/page.tsx                # Form+zodResolver(loginSchema)
    register/page.tsx              # Form+zodResolver(registerSchema)
  (dashboard)/
    layout.tsx                    # DashboardLayout 적용
    dashboard/page.tsx             # StatCard 그리드 + Table 예시
    dashboard/settings/page.tsx     # Tabs 예시

lib/
  utils.ts                    # 변경 없음
  validations/
    auth.ts                    # loginSchema, registerSchema (zod)
```

## 신규 shadcn 컴포넌트 및 설치 커맨드

```bash
npx shadcn add form alert skeleton sheet table tabs breadcrumb scroll-area dialog
```

| 컴포넌트 | 용도 |
|---|---|
| form | react-hook-form 래퍼 (Form/FormField/FormItem/FormLabel/FormControl/FormMessage) |
| alert | 폼 제출 실패, 에러 페이지 메시지 |
| skeleton | 로딩 상태 (`loading.tsx`) |
| sheet | 모바일 햄버거 메뉴 (Radix Dialog 기반) |
| table | 대시보드 데이터 테이블 예시 |
| tabs | 대시보드 설정 페이지 섹션 전환 |
| breadcrumb | 대시보드 상단 경로 표시 |
| scroll-area | 사이드바 네비 스크롤 처리 |
| dialog | 삭제 확인 등 모달 |

## 신규 npm 패키지

```bash
npm install react-hook-form zod @hookform/resolvers
```

폼 상태/검증을 직접 구현하지 않고 표준 조합을 사용한다. 테이블 정렬/페이지네이션이 필요해지기 전까지 `@tanstack/react-table`은 설치하지 않는다(YAGNI).

## 구현 순서

**1단계 — 기반 다지기**
- `npm install react-hook-form zod @hookform/resolvers`
- `npx shadcn add form alert skeleton`
- `lib/validations/auth.ts` (loginSchema, registerSchema)
- `app/not-found.tsx`, `app/error.tsx`
- `components/patterns/empty-state.tsx`, `page-header.tsx`, `section.tsx`, `logo.tsx`
- `site-header.tsx`가 `patterns/logo.tsx`를 import하도록 리팩터링 (동작 동일 유지)

**2단계 — 마케팅 레이아웃**
- `npx shadcn add sheet`
- `components/patterns/nav-link.tsx`, `mobile-nav.tsx`
- `components/site-header.tsx` → `components/layouts/site-header.tsx` 이동, 모바일 브레이크포인트에 `MobileNav` 추가
- `components/layouts/site-footer.tsx`, `marketing-layout.tsx` 신규
- `app/(marketing)/layout.tsx`, `app/(marketing)/page.tsx`(기존 app/page.tsx 이동, Section 패턴 적용)
- `app/layout.tsx`에서 `<SiteHeader />` 제거

**3단계 — 인증 페이지**
- `components/layouts/auth-layout.tsx`
- `app/(auth)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`
- 폼 실패 시 `Alert(destructive)`, 성공 시 기존 `sonner` toast 재사용

**4단계 — 대시보드 레이아웃**
- `npx shadcn add table tabs breadcrumb scroll-area dialog`
- `components/patterns/stat-card.tsx`, `user-menu.tsx`
- `components/layouts/dashboard-sidebar.tsx`(커스텀, NavLink 재사용), `dashboard-header.tsx`, `dashboard-layout.tsx`
- `app/(dashboard)/layout.tsx`, `app/(dashboard)/dashboard/page.tsx`, `app/(dashboard)/dashboard/settings/page.tsx`

각 단계는 독립적으로 검증 가능하며, 1단계는 3단계(폼)의 선행 조건이라 반드시 먼저 진행한다. 2·3·4단계는 순서를 바꿔도 무방하다.

## 기존 자산 재사용 매핑

| 기존 파일 | 처리 |
|---|---|
| `components/site-header.tsx` | `components/layouts/site-header.tsx`로 이동, 로고만 `patterns/logo.tsx`로 추출, 모바일 대응 추가 |
| `components/theme-toggle.tsx` | 위치 변경 없이 그대로 재사용 (대시보드 헤더에서도 import) |
| `app/page.tsx` | `app/(marketing)/page.tsx`로 이동, 반복 wrapper를 `Section` 패턴으로 교체 |
| `app/layout.tsx` | `SiteHeader` 제거, `ThemeProvider`+`children`+`Toaster` 골격 유지 |
| `lib/utils.ts`, `components.json` | 변경 없음 |

## Next.js 16 준수 사항

- 각 그룹 레이아웃은 `LayoutProps<'/(marketing)'>` 등 전역 타입 헬퍼 사용 (import 불필요, params 수동 타이핑 금지)
- `app/error.tsx`는 반드시 `"use client"`, `reset()` 콜백을 EmptyState 액션 버튼에 연결
- 상태(열림/닫힘, active path)가 필요한 컴포넌트만 `"use client"` — `MarketingLayout`/`AuthLayout`/`DashboardLayout` 자체는 서버 컴포넌트로 유지
- 이 레포의 shadcn 컨벤션(data-slot, data-variant/data-size, radix-ui 통합 import, cn(), named export)을 모든 신규 컴포넌트에 동일 적용

## 검증 방법

- `npx tsc --noEmit`으로 각 단계마다 타입 오류 확인
- `npm run dev` 실행 후 각 라우트 그룹(`/`, `/login`, `/register`, `/dashboard`, 존재하지 않는 경로로 404)에 curl 또는 브라우저로 접속해 올바른 레이아웃(헤더/사이드바 유무)이 적용되는지 확인
- 다크모드 토글이 모든 레이아웃(마케팅/인증/대시보드)에서 동일하게 동작하는지 확인
- 로그인/회원가입 폼에 잘못된 입력을 넣어 zod 검증 메시지가 표시되는지 확인
