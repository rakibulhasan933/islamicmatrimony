"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Camera, X, Upload, ImageIcon, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onRemove?: () => void
  className?: string
  label?: string
  description?: string
  maxSizeMB?: number
  aspectRatio?: "square" | "portrait" | "landscape"
  showPreview?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  label = "ছবি আপলোড করুন",
  description = "JPG, PNG বা WEBP (সর্বোচ্চ ২MB)",
  maxSizeMB = 2,
  aspectRatio = "square",
  showPreview = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastFile, setLastFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  }

  const uploadToServer = useCallback(async (base64: string, retries = 0): Promise<string> => {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      // Retry on timeout or server errors
      if (retries < 2 && (data.code === "TIMEOUT" || response.status >= 500)) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (retries + 1)))
        return uploadToServer(base64, retries + 1)
      }
      throw new Error(data.error || "ছবি আপলোড করতে ব্যর্থ হয়েছে")
    }

    return data.url
  }, [])

  const handleFileSelect = async (file: File) => {
    setError(null)
    setErrorCode(null)
    setIsLoading(true)
    setUploadSuccess(false)
    setLastFile(file)

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("শুধুমাত্র ছবি ফাইল আপলোড করুন")
      setErrorCode("INVALID_TYPE")
      setIsLoading(false)
      return
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`ফাইলের আকার ${maxSizeMB}MB এর বেশি হতে পারবে না`)
      setErrorCode("FILE_TOO_LARGE")
      setIsLoading(false)
      return
    }

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error("ফাইল পড়তে সমস্যা হয়েছে"))
        reader.readAsDataURL(file)
      })

      // Upload to imgbb
      const url = await uploadToServer(base64)
      onChange(url)
      setUploadSuccess(true)
      setRetryCount(0)
      setTimeout(() => setUploadSuccess(false), 3000)
    } catch (uploadError) {
      console.error("Upload failed:", uploadError)
      setError(uploadError instanceof Error ? uploadError.message : "ছবি আপলোড করতে সমস্যা হয়েছে")
      setErrorCode("UPLOAD_FAILED")
      setRetryCount((prev) => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (lastFile) {
      handleFileSelect(lastFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleRemove = () => {
    onChange("")
    onRemove?.()
    setError(null)
    setErrorCode(null)
    setLastFile(null)
    setRetryCount(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}

      {value && showPreview ? (
        <div
          className={cn(
            "relative rounded-xl overflow-hidden bg-muted border-2 border-border",
            aspectRatioClass[aspectRatio],
          )}
        >
          <img src={value || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          {uploadSuccess && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 shadow-lg"
            >
              <Camera className="w-4 h-4" />
              পরিবর্তন
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleRemove} className="gap-2 shadow-lg">
              <X className="w-4 h-4" />
              মুছুন
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl cursor-pointer transition-all",
            aspectRatioClass[aspectRatio],
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-muted/50",
            isLoading && "pointer-events-none opacity-70",
            error && "border-destructive/50",
          )}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
            {isLoading ? (
              <>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="w-7 h-7 text-primary animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">আপলোড হচ্ছে...</p>
                  <p className="text-xs text-muted-foreground mt-1">অনুগ্রহ করে অপেক্ষা করুন</p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center transition-colors",
                    error ? "bg-destructive/10" : "bg-primary/10",
                  )}
                >
                  {error ? (
                    <AlertCircle className="w-7 h-7 text-destructive" />
                  ) : isDragging ? (
                    <Upload className="w-7 h-7 text-primary" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? "ছবি ছেড়ে দিন" : "ছবি টেনে আনুন অথবা ক্লিক করুন"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error display with retry option */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-destructive">{error}</p>
            {lastFile && retryCount < 3 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                className="mt-2 h-8 px-3 text-xs gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                আবার চেষ্টা করুন
              </Button>
            )}
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  )
}
