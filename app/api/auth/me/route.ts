import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/clerk-auth"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: "ব্যবহারকারী তথ্য পেতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
