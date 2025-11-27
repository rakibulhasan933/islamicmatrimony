"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "লগইন করতে সমস্যা হয়েছে")
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "কিছু ভুল হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          ইমেইল
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 h-12 bg-muted/50 border-border focus:border-primary"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          পাসওয়ার্ড
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:border-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <a href="#" className="text-sm text-primary hover:underline">
          পাসওয়ার্ড ভুলে গেছেন?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            লগইন হচ্ছে...
          </>
        ) : (
          "লগইন করুন"
        )}
      </Button>
    </form>
  )
}
