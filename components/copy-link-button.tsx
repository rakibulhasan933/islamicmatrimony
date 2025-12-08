"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CopyLinkButtonProps {
  biodataNo: string
}

export function CopyLinkButton({ biodataNo }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/biodata/${biodataNo}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600 gap-2 font-medium transition-all duration-200 hover:scale-[1.02]"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400">কপি হয়েছে!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Biodata Link
        </>
      )}
    </Button>
  )
}
