import Link from "next/link"

import { Logo } from "@/components/patterns/logo"
import { MobileNav } from "@/components/patterns/mobile-nav"
import { NavLink } from "@/components/patterns/nav-link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const NAV_ITEMS = [
  { href: "#features", label: "기능" },
  { href: "#components", label: "컴포넌트" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
            />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <MobileNav items={NAV_ITEMS} />
          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/register">회원가입</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
