"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageUpload } from "@/components/ui/image-upload"
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from "lucide-react"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          profileImage: formData.profileImage,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে")
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <div className="w-32">
          <ImageUpload
            value={formData.profileImage}
            onChange={(value) => setFormData({ ...formData, profileImage: value })}
            label="প্রোফাইল ছবি"
            description="JPG, PNG (সর্বোচ্চ ২MB)"
            aspectRatio="square"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          পূর্ণ নাম
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="আপনার নাম"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="pl-10 h-12 bg-muted/50 border-border focus:border-primary"
            required
          />
        </div>
      </div>

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
        <Label htmlFor="phone" className="text-foreground">
          মোবাইল নম্বর
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10 h-12 bg-muted/50 border-border focus:border-primary"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          পাসওয়ার্ড নিশ্চিত করুন
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:border-primary"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              রেজিস্টার হচ্ছে...
            </>
          ) : (
            "রেজিস্টার করুন"
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center pt-2">
        রেজিস্টার করার মাধ্যমে আপনি আমাদের{" "}
        <a href="#" className="text-primary hover:underline">
          শর্তাবলী
        </a>{" "}
        এবং{" "}
        <a href="#" className="text-primary hover:underline">
          গোপনীয়তা নীতি
        </a>{" "}
        মেনে নিচ্ছেন
      </p>
    </form>
  )
}
