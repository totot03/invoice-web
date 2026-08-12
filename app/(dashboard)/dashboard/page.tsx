import { FileTextIcon, LinkIcon } from "lucide-react"

import { PageHeader } from "@/components/patterns/page-header"
import { Button } from "@/components/ui/button"

// TODO: Notion 데이터베이스 연동(F001) 완료 후 이 배열을 실제 조회 결과로 교체한다.
// 견적서 항목: 고객명, 금액, 작성일 등 (docs/PRD.md 데이터 모델 참고)
const quotes: Array<{
  id: string
  customerName: string
  amount: string
  createdAt: string
}> = []

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="견적서 목록"
        description="Notion에서 가져온 견적서를 확인하고 공유 링크를 관리하세요"
      />

      {quotes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-muted/50 p-12 text-center">
          <FileTextIcon className="size-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">아직 연결된 견적서가 없습니다</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            Notion 데이터베이스와 연동하면 이곳에 견적서 목록이 표시됩니다. 견적서를 선택하면 공유
            링크를 생성하거나 미리보기로 열람할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border">
          {quotes.map(quote => (
            <div key={quote.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-medium">{quote.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {quote.amount} · {quote.createdAt}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <LinkIcon className="size-4" />
                공유 링크 복사
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
