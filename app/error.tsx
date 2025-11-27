"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-destructive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
            <div className="absolute -inset-4 border border-destructive/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Error Text */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">কিছু ভুল হয়েছে!</h1>

        <p className="text-muted-foreground mb-4 max-w-md mx-auto">
          দুঃখিত, একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা পরে ফিরে আসুন।
        </p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left">
            <p className="text-sm font-mono text-destructive break-all">{error.message}</p>
            {error.digest && <p className="text-xs text-muted-foreground mt-2">Error ID: {error.digest}</p>}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="w-5 h-5" />
            আবার চেষ্টা করুন
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
            <Link href="/">
              <Home className="w-5 h-5" />
              হোমপেজে যান
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            সমস্যা বারবার হলে আমাদের সাথে যোগাযোগ করুন:{" "}
            <a href="mailto:support@nikahbondhu.com" className="text-primary hover:underline">
              support@nikahbondhu.com
            </a>
          </p>
        </div>

        {/* Decorative Verse */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground italic">
            "আল্লাহ প্রতিটি কঠিন পরিস্থিতির পরে সহজতা দান করেন।" — সূরা আত-তালাক ৬৫:৭
          </p>
        </div>
      </div>
    </div>
  )
}
