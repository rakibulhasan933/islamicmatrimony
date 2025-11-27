import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { users, biodatas } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { BiodataForm } from "@/components/dashboard/biodata-form"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) return null

  const { payload } = await jwtVerify(token, JWT_SECRET)
  const { userId } = payload as { userId: number }

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return user[0] || null
}

async function getUserBiodata(userId: number) {
  const biodata = await db.select().from(biodatas).where(eq(biodatas.userId, userId)).limit(1)

  return biodata[0] || null
}

export default async function BiodataPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const existingBiodata = await getUserBiodata(user.id)

  return <BiodataForm user={user} existingBiodata={existingBiodata} />
}
