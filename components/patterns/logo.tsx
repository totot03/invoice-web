import Link from "next/link"
import { CodeXmlIcon } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold">
      <CodeXmlIcon className="size-5" />
      <span>Starter Kit</span>
    </Link>
  )
}
