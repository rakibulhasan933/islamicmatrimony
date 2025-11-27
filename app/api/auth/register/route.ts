import { NextResponse } from "next/server"
import { registerUser, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, profileImage } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "ইমেইল, পাসওয়ার্ড এবং নাম আবশ্যক" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 })
    }

    const user = await registerUser(email, password, name, phone, profileImage)
    await createSession(user.id)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "রেজিস্ট্রেশন করতে সমস্যা হয়েছে"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
