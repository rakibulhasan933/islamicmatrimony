import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { memberships } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getCurrentUser } from "@/lib/clerk-auth"

// GET - Get user's membership
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const membership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, user.clerkId), eq(memberships.status, "active")))
      .limit(1)

    if (membership.length === 0) {
      return NextResponse.json({
        membership: {
          type: "free",
          contactViewsRemaining: 0,
          contactViewsTotal: 0,
          expiresAt: null,
        },
      })
    }

    return NextResponse.json({ membership: membership[0] })
  } catch (error) {
    console.error("Error fetching membership:", error)
    return NextResponse.json({ error: "সদস্যতা লোড করতে সমস্যা হয়েছে" }, { status: 500 })
  }
}

// POST - Purchase/upgrade membership
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "অনুগ্রহ করে লগইন করুন" }, { status: 401 })
    }

    const { type } = await request.json()

    if (!type || !["silver", "gold"].includes(type)) {
      return NextResponse.json({ error: "অবৈধ সদস্যতার ধরন" }, { status: 400 })
    }

    const membershipDetails = {
      silver: {
        contactViewsTotal: 10,
        durationDays: 30,
        price: 200,
      },
      gold: {
        contactViewsTotal: 30,
        durationDays: 90,
        price: 500,
      },
    }

    const details = membershipDetails[type as "silver" | "gold"]
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + details.durationDays)

    // Check if user already has active membership
    const existingMembership = await db
      .select()
      .from(memberships)
      .where(and(eq(memberships.userId, user.clerkId), eq(memberships.status, "active")))
      .limit(1)

    if (existingMembership.length > 0) {

      const viewsRemaining = existingMembership[0].contactViewsRemaining ?? 0
      // Update existing membership
      await db
        .update(memberships)
        .set({
          type: type as "silver" | "gold",
          contactViewsRemaining: viewsRemaining + details.contactViewsTotal,
          contactViewsTotal: viewsRemaining + details.contactViewsTotal,
          expiresAt,
          updatedAt: new Date(),
        })
        .where(eq(memberships.id, existingMembership[0].id))
    } else {
      // Create new membership
      await db.insert(memberships).values({
        userId: user.clerkId,
        type: type as "silver" | "gold",
        status: "active",
        contactViewsRemaining: details.contactViewsTotal,
        contactViewsTotal: details.contactViewsTotal,
        startsAt: new Date(),
        expiresAt,
      })
    }

    return NextResponse.json({
      success: true,
      message: `${type === "silver" ? "সিলভার" : "গোল্ড"} সদস্যতা সফলভাবে সক্রিয় হয়েছে`,
    })
  } catch (error) {
    console.error("Error purchasing membership:", error)
    return NextResponse.json({ error: "সদস্যতা কিনতে সমস্যা হয়েছে" }, { status: 500 })
  }
}
