'use client'

import { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      {Icon && <Icon className="size-12 text-muted-foreground" />}
      <h1 className="text-3xl font-semibold">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4">
          {action.label}
        </Button>
      )}
    </div>
  )
}
