import { LayoutDashboardIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"

import { NavLink } from "@/components/patterns/nav-link"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

const SIDEBAR_ITEMS = [
  { href: "/dashboard", label: "개요", icon: LayoutDashboardIcon },
  { href: "/dashboard/settings", label: "설정", icon: SettingsIcon },
]

export function DashboardSidebar() {
  return (
    <aside className="hidden border-r bg-muted/50 md:block md:w-64 md:flex-shrink-0">
      <ScrollArea className="h-screen">
        <div className="space-y-4 p-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>대시보드</span>
          </Link>
          <Separator />
          <nav className="space-y-2">
            {SIDEBAR_ITEMS.map((item) => (
              <div key={item.href} className="flex items-center gap-2">
                <item.icon className="size-4 text-muted-foreground" />
                <NavLink href={item.href} label={item.label} />
              </div>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </aside>
  )
}
