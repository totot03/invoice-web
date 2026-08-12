import { redirect } from "next/navigation"

// PRD 사용자 여정: 비로그인 상태에서 서비스 접속 시 로그인 페이지로 자동 진입한다.
// 실제 세션 체크(로그인 상태면 /dashboard로) 는 인증 백엔드 연동(F010) 이후 proxy.ts에서 처리한다.
export default function RootPage() {
  redirect("/login")
}
