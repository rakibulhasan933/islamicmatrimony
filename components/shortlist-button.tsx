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
        className={`bg-white hover:bg-gray-50 ${isAdded ? "text-red-500 border-red-200" : ""}`}
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
      size="lg"
      className={`gap-2 ${
        isAdded ? "bg-red-100 text-red-600 hover:bg-red-100" : "bg-pink-600 hover:bg-pink-700 text-white"
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          যোগ হচ্ছে...
        </>
      ) : isAdded ? (
        <>
          <Heart className="w-5 h-5 fill-current" />
          শর্টলিস্টে যোগ হয়েছে
        </>
      ) : (
        <>
          <Heart className="w-5 h-5" />
          শর্টলিস্টে যোগ করুন
        </>
      )}
    </Button>
  )
}
