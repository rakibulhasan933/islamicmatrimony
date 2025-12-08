import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, memberships, contactViews, biodatas } from "@/lib/db/schema"
import { eq, and, desc, count } from "drizzle-orm"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        const { userId } = payload as { userId: number }
        const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
        return user[0] || null
    } catch {
        return null
    }
}

export async function GET() {
    try {
        const user = await getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Get membership info
        const membership = await db
            .select()
            .from(memberships)
            .where(and(eq(memberships.userId, user.id), eq(memberships.status, "active")))
            .limit(1)

        const activeMembership = membership[0] || null

        // Calculate days remaining
        let daysRemaining = 0
        if (activeMembership?.expiresAt) {
            const now = new Date()
            const expiresAt = new Date(activeMembership.expiresAt)
            const diffTime = expiresAt.getTime() - now.getTime()
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
        }

        // Get viewed biodatas with details
        const viewedBiodatas = await db
            .select({
                viewId: contactViews.id,
                viewedAt: contactViews.viewedAt,
                biodataId: biodatas.id,
                biodataNo: biodatas.biodataNo,
                fullName: biodatas.fullName,
                photo: biodatas.photo,
                age: biodatas.age,
                type: biodatas.type,
                occupation: biodatas.occupation,
                permanentDistrict: biodatas.permanentDistrict,
                education: biodatas.education,
            })
            .from(contactViews)
            .innerJoin(biodatas, eq(contactViews.biodataId, biodatas.id))
            .where(eq(contactViews.viewerUserId, user.id))
            .orderBy(desc(contactViews.viewedAt))

        // Get total views count
        const totalViewsResult = await db
            .select({ count: count() })
            .from(contactViews)
            .where(eq(contactViews.viewerUserId, user.id))

        return NextResponse.json({
            membership: {
                type: activeMembership?.type || "free",
                status: activeMembership?.status || "active",
                connectionsRemaining: activeMembership?.contactViewsRemaining || 0,
                connectionsTotal: activeMembership?.contactViewsTotal || 0,
                daysRemaining,
                expiresAt: activeMembership?.expiresAt,
                startsAt: activeMembership?.startsAt,
            },
            viewedBiodatas,
            totalViews: totalViewsResult[0]?.count || 0,
        })
    } catch (error) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
