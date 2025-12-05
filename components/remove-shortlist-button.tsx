"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface RemoveFromShortlistButtonProps {
  biodataId: number
}

export function RemoveFromShortlistButton({ biodataId }: RemoveFromShortlistButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRemove = async () => {
    setIsLoading(true)

    try {
      await fetch(`/api/shortlist?biodataId=${biodataId}`, {
        method: "DELETE",
      })
      router.refresh()
    } catch (err) {
      console.error("Error removing from shortlist:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleRemove}
      disabled={isLoading}
      className="text-red-500 hover:text-red-600 hover:bg-red-50"
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </Button>
  )
}
