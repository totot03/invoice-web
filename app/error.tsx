"use client"

import { AlertCircleIcon } from "lucide-react"

import { EmptyState } from "@/components/patterns/empty-state"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <EmptyState
      icon={AlertCircleIcon}
      title="문제가 발생했습니다"
      description={error.message || "알 수 없는 오류가 발생했습니다."}
      action={{
        label: "다시 시도",
        onClick: reset,
      }}
    />
  )
}
