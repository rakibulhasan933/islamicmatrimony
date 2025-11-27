import { NextResponse } from "next/server"
import { loginUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক" }, { status: 400 })
    }

    const user = await loginUser(email, password)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "লগইন করতে সমস্যা হয়েছে"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
