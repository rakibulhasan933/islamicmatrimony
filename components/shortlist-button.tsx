"use client"

import { useState } from "react"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ShortlistButtonProps {
  biodataId: number
  isLoggedIn: boolean
  variant?: "icon" | "large"
}

export function ShortlistButton({ biodataId, isLoggedIn, variant = "icon" }: ShortlistButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [error, setError] = useState("")

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biodataId }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      setIsAdded(true)
    } catch (err) {
      setError("শর্টলিস্টে যোগ করতে সমস্যা হয়েছে")
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={isLoading || isAdded}
        className={`bg-white hover:bg-gray-50 transition-all duration-200 ${isAdded ? "text-red-500 border-red-200" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${isAdded ? "fill-current" : ""}`} />
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || isAdded}
      className={`w-full gap-2 font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
        isAdded
          ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-600 hover:from-red-100 hover:to-pink-100"
          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          যোগ হচ্ছে...
        </>
      ) : isAdded ? (
        <>
          <Heart className="w-4 h-4 fill-current animate-pulse" />
          শর্টলিস্টে যোগ হয়েছে
        </>
      ) : (
        <>
          <Heart className="w-4 h-4" />
          শর্টলিস্টে যোগ করুন
        </>
      )}
    </Button>
  )
}
