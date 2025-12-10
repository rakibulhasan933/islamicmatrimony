import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users, biodatas } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { BiodataForm } from "@/components/dashboard/biodata-form"
import { auth } from "@clerk/nextjs/server"


async function getUser() {
  const { userId } = await auth()

  const user = await db.select().from(users).where(eq(users.clerkId, userId || "")).limit(1)
  return user[0] || null
}

async function getUserBiodata(userId: string) {
  const biodata = await db.select().from(biodatas).where(eq(biodatas.userId, userId)).limit(1)

  return biodata[0] || null
}

export default async function BiodataPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const existingBiodata = await getUserBiodata(user.clerkId)

  return <BiodataForm user={user} existingBiodata={existingBiodata} />
}
