import { cn } from "@/lib/utils"

interface SectionProps extends React.ComponentProps<"section"> {
  children: React.ReactNode
}

export function Section({ className, ...props }: SectionProps) {
  return (
    <section className={cn("mx-auto w-full max-w-5xl px-6", className)} {...props} />
  )
}
