import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavLinkProps {
  href: string
  label: string
  active?: boolean
  onClick?: () => void
  className?: string
}

export function NavLink({ href, label, active, onClick, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "transition-colors hover:text-foreground",
        active ? "font-semibold text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label}
    </Link>
  )
}
