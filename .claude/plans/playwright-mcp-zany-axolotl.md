# 로그인/회원가입 성공 시 클라이언트 사이드 리다이렉트 추가

## Context

사용자가 데모 계정(`demo@example.com` / `demo123456`)으로 로그인을 시도했지만, 성공 토스트만 표시되고 `/dashboard`로 이동하지 않는 문제를 겪었다.

원인은 `app/(auth)/login/page.tsx:43-48`에서 확인된다:
```tsx
if (data.email === "demo@example.com" && data.password === "demo123456") {
  toast.success("로그인 성공!", { description: "환영합니다." })
  // 실제로는 여기서 redirect를 사용합니다
  // redirect("/dashboard")
}
```
스타터킷 특성상 실제 이동 로직이 주석으로만 남아있다. 여기서 중요한 점은, 이 컴포넌트가 `"use client"` 클라이언트 컴포넌트(`page.tsx:1`)이므로 주석에 적힌 `redirect()`(서버 컴포넌트/서버 액션 전용 함수, `next/navigation`)를 그대로 호출하면 동작하지 않거나 오류가 발생한다. Next.js 16 공식 문서(`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/use-router.md`)에 따르면, 클라이언트 컴포넌트의 이벤트 핸들러 안에서 프로그래밍적으로 라우팅하려면 `next/navigation`의 `useRouter().push()`를 사용해야 한다.

`app/(auth)/register/page.tsx`도 동일한 패턴(가입 성공 시 `redirect("/login")` 주석 처리, L48-49)이며 사용자가 회원가입도 함께 수정하기로 결정했다.

## 변경 대상 파일

### 1. `app/(auth)/login/page.tsx`
- `import { useRouter } from "next/navigation"` 추가
- 컴포넌트 내부에 `const router = useRouter()` 추가
- 로그인 성공 분기(L43-48)에서 주석 처리된 `redirect("/dashboard")` 대신 `router.push("/dashboard")` 호출
- 토스트는 이동 전에 띄워도 되지만, `router.push`가 즉시 페이지 전환을 유발하므로 토스트가 보일 새 없이 넘어갈 수 있음 — 기존 스타터킷 의도(토스트로 성공 피드백)를 살리기 위해 `setTimeout` 없이 그대로 두되, 토스트 호출 직후 `router.push`를 실행 (Next.js는 클라이언트 전환이라 토스트 컴포넌트가 언마운트되지 않는 한 유지됨 — `Toaster`가 `app/layout.tsx`의 루트에 있으므로 페이지 전환 후에도 토스트가 표시됨)

### 2. `app/(auth)/register/page.tsx`
- 동일한 방식으로 `useRouter` 추가
- 가입 성공 시(L44-49) 주석 처리된 `redirect("/login")` 대신 `router.push("/login")` 호출

## 구현 순서
1. `login/page.tsx`: `useRouter` import + 훅 초기화 + `onSubmit` 성공 분기에서 `router.push("/dashboard")` 적용
2. `register/page.tsx`: `useRouter` import + 훅 초기화 + `onSubmit` 성공 분기에서 `router.push("/login")` 적용
3. 두 파일 모두 주석(`// 실제로는 여기서 redirect를 사용합니다`, `// redirect(...)`) 제거 (이제 실제로 동작하는 코드로 대체되므로 불필요)

## 검증 방법
- Playwright MCP로 `http://localhost:3000/login` 방문
- 데모 계정(`demo@example.com` / `demo123456`)으로 폼 채우고 제출
- 로그인 성공 토스트가 표시되고, URL이 `/dashboard`로 정상 전환되는지 확인 (`browser_snapshot` 또는 navigate 결과의 Page URL 확인)
- 잘못된 자격증명 입력 시 여전히 에러 메시지가 표시되고 이동하지 않는지(기존 else 분기 유지) 확인
- `http://localhost:3000/register` 방문, 유효한 값 입력 후 제출 → 성공 토스트 표시 + `/login`으로 이동 확인
- `browser_console_messages`로 새 콘솔 에러 없는지 확인
- `npm run lint`, `npx tsc --noEmit`으로 정적 오류 없는지 확인
