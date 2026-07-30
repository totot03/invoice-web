import { LucideIcon } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: "up" | "down"
  trendValue?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-xs text-muted-foreground pt-1">
            {trendValue && (
              <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
                {trend === "up" ? "↑" : "↓"} {trendValue}
              </span>
            )}
            {description && (
              <>
                {trendValue ? " " : ""}
                {description}
              </>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
