import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ success: false, error: "ছবি প্রয়োজন", code: "NO_IMAGE" }, { status: 400 })
    }

    // Validate API key
    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      console.error("IMGBB_API_KEY is not configured")
      return NextResponse.json({ success: false, error: "সার্ভার কনফিগারেশন সমস্যা", code: "CONFIG_ERROR" }, { status: 500 })
    }

    // Extract base64 data from data URL
    const base64Match = image.match(/^data:image\/(\w+);base64,(.+)$/)
    if (!base64Match) {
      return NextResponse.json({ success: false, error: "অবৈধ ছবি ফরম্যাট", code: "INVALID_FORMAT" }, { status: 400 })
    }

    const [, imageType, base64Data] = base64Match

    // Validate image type
    const allowedTypes = ["jpeg", "jpg", "png", "gif", "webp"]
    if (!allowedTypes.includes(imageType.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "শুধুমাত্র JPG, PNG, GIF, WEBP ফরম্যাট সমর্থিত", code: "UNSUPPORTED_TYPE" },
        { status: 400 },
      )
    }

    // Check base64 size (approximate file size)
    const estimatedSize = (base64Data.length * 3) / 4
    const maxSize = 32 * 1024 * 1024 // 32MB (imgbb limit)
    if (estimatedSize > maxSize) {
      return NextResponse.json(
        { success: false, error: "ছবির আকার ৩২MB এর বেশি হতে পারবে না", code: "FILE_TOO_LARGE" },
        { status: 400 },
      )
    }

    // Upload to ImgBB
    const formData = new FormData()
    formData.append("image", base64Data)
    formData.append("key", apiKey)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        console.error("ImgBB API error:", data)
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "ImgBB আপলোড ব্যর্থ হয়েছে",
            code: "IMGBB_ERROR",
            details: data.error,
          },
          { status: response.status },
        )
      }

      if (!data.success) {
        console.error("ImgBB upload failed:", data)
        return NextResponse.json(
          {
            success: false,
            error: data.error?.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে",
            code: "UPLOAD_FAILED",
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url,
        deleteUrl: data.data.delete_url,
        thumbnail: data.data.thumb?.url,
        medium: data.data.medium?.url,
        size: data.data.size,
        width: data.data.width,
        height: data.data.height,
      })
    } catch (fetchError) {
      clearTimeout(timeoutId)

      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "আপলোড টাইমআউট হয়েছে, আবার চেষ্টা করুন", code: "TIMEOUT" },
          { status: 408 },
        )
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "ছবি আপলোড করতে সমস্যা হয়েছে",
        code: "UNKNOWN_ERROR",
      },
      { status: 500 },
    )
  }
}
