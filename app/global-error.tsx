"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="bn">
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center max-w-lg mx-auto">
            {/* Error Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">একটি গুরুতর সমস্যা হয়েছে</h1>

            <p className="text-gray-600 mb-6">অ্যাপ্লিকেশনে একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।</p>

            <Button onClick={reset} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
              <RefreshCw className="w-5 h-5" />
              পৃষ্ঠা রিফ্রেশ করুন
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
