# 견적서 웹 뷰어 & PDF 다운로드

Notion에 입력한 견적서를 클라이언트가 별도 프로그램 없이 웹에서 확인하고 PDF로 저장할 수 있게 하는 서비스입니다.

## 🎯 프로젝트 개요

**목적**: Notion으로 견적서를 관리하는 프리랜서·소규모 사업자가 이중 입력 없이 클라이언트에게 견적서를 공유하고, 클라이언트는 로그인 없이 웹에서 열람·PDF 다운로드할 수 있게 합니다.
**범위**: 로그인/회원가입, Notion 견적서 목록 조회, 공유 링크 생성, 공개 견적서 열람, PDF 다운로드 (MVP)
**사용자**: Notion으로 견적서를 관리하는 관리자(프리랜서·소규모 사업자), 공유 링크로 견적서를 전달받는 클라이언트

## 📱 주요 페이지

1. **로그인 페이지** — 관리자 이메일/비밀번호 인증
2. **회원가입 페이지** — 관리자 계정 생성
3. **대시보드** — Notion 견적서 목록 조회, 견적서별 공유 링크 생성/복사 (로그인 필요)
4. **견적서 열람 페이지** — 클라이언트가 공유 링크로 접속해 품목·단가·수량·합계·유효기간 확인 및 PDF 다운로드 (로그인 불필요, 공개 접근)

## ⚡ 핵심 기능

- **Notion 견적서 동기화 조회 (F001)**: 연결된 Notion 데이터베이스에서 견적서 목록을 가져와 표시
- **견적서 상세 열람 (F002)**: 클라이언트가 로그인 없이 견적서 내용을 웹에서 확인
- **PDF 다운로드 (F003)**: 열람 중인 견적서를 PDF 파일로 저장
- **기본 인증 (F010)**: 회원가입/로그인/로그아웃
- **공유 링크 생성 (F011)**: 견적서별 추측하기 어려운 고유 링크 생성 및 복사

> MVP 이후 제외 범위(링크 만료, 이메일 자동 발송, 전자서명, 다국어, 결제 연동, PDF 커스터마이징 등)는 [`docs/PRD.md`](./docs/PRD.md)를 참고하세요.

## 🛠️ 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix Nova)
- **Icons**: lucide-react
- **Forms**: React Hook Form + Zod (한국어 에러 메시지)
- **Notifications**: Sonner

다음은 PRD에 정의되었으나 아직 프로젝트에 설치·연동되지 않은 예정 스택입니다:

- **Supabase** — 인증, 공유 링크 저장 (BaaS)
- **Notion API** (`@notionhq/client`) — 견적서 원본 데이터 조회
- **@react-pdf/renderer** — PDF 생성

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

```bash
# 코드 검사 및 포맷
npm run lint
npm run format        # 자동 정리
npm run format:check  # 검사만
```

## 📋 개발 상태

- ✅ 기본 프로젝트 구조 설정 (App Router, 인증 라우트 그룹, 대시보드 골격)
- ✅ 로그인/회원가입 폼 UI (데모 인증, 실제 백엔드 연동 전)
- ⏳ Notion API 연동 (F001)
- ⏳ 공유 링크 생성/저장 (F011)
- ⏳ 견적서 열람 페이지 + PDF 다운로드 (F002, F003)

## 📖 문서

- [PRD 문서](./docs/PRD.md) — 상세 요구사항, 사용자 여정, 데이터 모델
- [개발 가이드](./CLAUDE.md) — 코드 스타일, 컨벤션, Next.js 16 주의사항
