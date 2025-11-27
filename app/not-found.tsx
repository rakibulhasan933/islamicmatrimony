"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Islamic Decorative Element */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-20 h-20 text-primary" fill="currentColor">
                {/* Crescent Moon */}
                <path d="M50 10 C25 10 5 30 5 55 C5 80 25 100 50 100 C35 100 20 85 20 55 C20 25 35 10 50 10" />
                {/* Star */}
                <polygon points="75,25 77,32 85,32 79,37 81,45 75,40 69,45 71,37 65,32 73,32" />
              </svg>
            </div>
            <div className="absolute -inset-4 border border-primary/20 rounded-full" />
            <div className="absolute -inset-8 border border-primary/10 rounded-full" />
          </div>
        </div>

        {/* 404 Text */}
        <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">৪০৪</h1>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">পৃষ্ঠা খুঁজে পাওয়া যায়নি</h2>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি বিদ্যমান নেই অথবা স্থানান্তরিত হয়েছে। অনুগ্রহ করে হোমপেজে ফিরে যান অথবা অন্য পৃষ্ঠা খুঁজুন।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="w-5 h-5" />
              হোমপেজে যান
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
            <Link href="/search">
              <Search className="w-5 h-5" />
              বায়োডাটা খুঁজুন
            </Link>
          </Button>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <button
            onClick={() => typeof window !== "undefined" && window.history.back()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            পূর্ববর্তী পৃষ্ঠায় ফিরে যান
          </button>
        </div>

        {/* Decorative Verse */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground italic">"নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।" — সূরা আশ-শারহ ৯৪:৬</p>
        </div>
      </div>
    </div>
  )
}
