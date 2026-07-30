import { Logo } from "@/components/patterns/logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex justify-between border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <Logo />
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md px-6">{children}</div>
      </div>
    </div>
  )
}
