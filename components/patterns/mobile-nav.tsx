'use client'

import Link from "next/link"
import { MenuIcon } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { NavLink } from "./nav-link"

interface NavItem {
  href: string
  label: string
}

interface MobileNavProps {
  items: NavItem[]
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="sm:hidden">
          <MenuIcon className="size-5" />
          <span className="sr-only">메뉴 열기</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-4 py-4">
          {items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={() => setOpen(false)}
              className="block text-base"
            />
          ))}
        </nav>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <Button variant="ghost" asChild className="justify-start">
            <Link href="/login" onClick={() => setOpen(false)}>로그인</Link>
          </Button>
          <Button asChild className="justify-start">
            <Link href="/register" onClick={() => setOpen(false)}>회원가입</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
