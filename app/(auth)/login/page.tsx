"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { toast } from "sonner"

import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    setError("")

    try {
      // 실제로는 여기서 API 호출을 합니다
      // const response = await fetch("/api/auth/login", { ... })

      // 데모용 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (data.email === "demo@example.com" && data.password === "demo123456") {
        toast.success("로그인 성공!", {
          description: "환영합니다.",
        })
        router.push("/dashboard")
      } else {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.")
      }
    } catch (_err) {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>이메일을 입력하고 계정에 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Field>
              <FieldLabel htmlFor="email">이메일</FieldLabel>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                aria-invalid={!!errors.email}
                disabled={isLoading}
                {...register("email")}
              />
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">비밀번호</FieldLabel>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                disabled={isLoading}
                {...register("password")}
              />
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </Field>

            <Field>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "로그인 중..." : "로그인하기"}
              </Button>
              <FieldDescription className="text-center">
                계정이 없으신가요?{" "}
                <Link href="/register" className="underline hover:text-primary">
                  회원가입
                </Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>

        <div className="mt-6 space-y-2 rounded-lg bg-muted p-4 text-sm">
          <p className="font-semibold">데모 계정:</p>
          <p>이메일: demo@example.com</p>
          <p>비밀번호: demo123456</p>
        </div>
      </CardContent>
    </Card>
  )
}
