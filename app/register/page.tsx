import { RegisterForm } from "@/components/auth/register-form"
import { CrescentMoon, Lantern } from "@/components/islamic-pattern"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/10 p-4 relative overflow-hidden pt-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="register-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M5 0L10 5L5 10L0 5Z"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#register-pattern)" />
        </svg>
      </div>

      <Lantern className="absolute top-20 right-[10%] w-12 h-16 text-accent/20 animate-float hidden md:block" />
      <CrescentMoon className="absolute bottom-32 left-[15%] w-14 h-14 text-secondary/30 animate-glow hidden md:block" />

      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl md:text-3xl font-bold  text-pink-600">FreelancerMarriage</h1>
            <p className="text-sm text-muted-foreground"> ফ্রিল্যান্সারদের বিশ্বস্ত মাধ্যম</p>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">রেজিস্টার করুন</h2>
            <p className="text-muted-foreground mt-2 text-sm md:text-base">নতুন অ্যাকাউন্ট তৈরি করুন</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">আগে থেকেই অ্যাকাউন্ট আছে? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              লগইন করুন
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  )
}
