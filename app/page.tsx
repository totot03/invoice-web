"use client"

import { RocketIcon, PaletteIcon, ComponentIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

const FEATURES = [
  {
    icon: RocketIcon,
    title: "Next.js 16 App Router",
    description: "서버 컴포넌트 기반의 최신 라우팅 구조로 바로 개발을 시작합니다.",
  },
  {
    icon: PaletteIcon,
    title: "다크모드 내장",
    description: "next-themes로 라이트/다크/시스템 테마를 자동 전환합니다.",
  },
  {
    icon: ComponentIcon,
    title: "shadcn/ui 컴포넌트",
    description: "복사해 바로 쓰는 접근성 높은 컴포넌트가 미리 설치되어 있습니다.",
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-16 px-6 py-16">
      <section className="flex flex-col items-center gap-4 text-center">
        <Badge variant="secondary">Next.js · TypeScript · Tailwind · shadcn/ui</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          모던 웹 개발을 위한 Starter Kit
        </h1>
        <p className="max-w-xl text-muted-foreground">
          자주 쓰는 설정과 컴포넌트를 미리 구성해 두었습니다. 이제 이 위에 바로
          기능을 쌓아 올리세요.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              toast.success("Starter kit 준비 완료", {
                description: "이제 개발을 시작할 수 있습니다.",
              })
            }
          >
            토스트 테스트
          </Button>
          <Button variant="outline" asChild>
            <a href="#components">컴포넌트 보기</a>
          </Button>
        </div>
      </section>

      <section id="features" className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-5 text-muted-foreground" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Separator />

      <section id="components" className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>버튼 &amp; 아바타</CardTitle>
            <CardDescription>자주 쓰는 variant 조합 예시</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Default</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="outline">
                Outline
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
              <Button size="sm" variant="destructive">
                Destructive
              </Button>
            </div>
            <AvatarGroup>
              <Avatar>
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>TS</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>+3</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>폼 요소</CardTitle>
            <CardDescription>Input과 Label 조합 예시</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <Button
              onClick={() => toast.info("아직 연결된 API가 없습니다.")}
            >
              제출
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
