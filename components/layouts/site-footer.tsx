import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <Separator className="mb-6" />
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {year} Starter Kit. 모든 권리 보유.</p>
          <nav className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-foreground">
              이용약관
            </a>
            <a href="#" className="hover:text-foreground">
              문의
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
