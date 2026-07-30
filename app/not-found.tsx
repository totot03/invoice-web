import { TriangleAlertIcon } from "lucide-react"
import Link from "next/link"

import { EmptyState } from "@/components/patterns/empty-state"

export default function NotFound() {
  return (
    <EmptyState
      icon={TriangleAlertIcon}
      title="페이지를 찾을 수 없습니다"
      description="요청하신 페이지가 존재하지 않습니다."
      action={{
        label: "홈으로 돌아가기",
        onClick: () => (window.location.href = "/"),
      }}
    />
  )
}
