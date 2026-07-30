import { BarChart3Icon, TrendingUpIcon, UsersIcon, ActivityIcon } from "lucide-react"

import { StatCard } from "@/components/patterns/stat-card"
import { PageHeader } from "@/components/patterns/page-header"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="대시보드"
        description="시스템의 주요 지표를 한눈에 확인하세요"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 매출"
          value="$45,231.89"
          description="전월 대비"
          icon={TrendingUpIcon}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="사용자"
          value="2,543"
          description="활성 사용자"
          icon={UsersIcon}
          trend="up"
          trendValue="+8.2%"
        />
        <StatCard
          title="판매량"
          value="12,234"
          description="이번 주"
          icon={BarChart3Icon}
          trend="down"
          trendValue="-3.1%"
        />
        <StatCard
          title="활동"
          value="86%"
          description="플랫폼 가동률"
          icon={ActivityIcon}
        />
      </div>

      <div className="rounded-lg border bg-muted/50 p-8 text-center">
        <h3 className="text-lg font-semibold">대시보드 기능 개발 중</h3>
        <p className="text-muted-foreground">
          더 많은 대시보드 페이지와 데이터 시각화를 추가할 수 있습니다.
        </p>
      </div>
    </div>
  )
}
