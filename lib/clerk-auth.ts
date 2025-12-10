import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "./db"
import { users, memberships } from "./db/schema"
import { eq } from "drizzle-orm"

// Get or create user in database from Clerk user
export async function getOrCreateUser() {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const clerkUser = await currentUser()

  if (!clerkUser) {
    return null
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress
  const name = clerkUser.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
    : email?.split("@")[0] || "User"

  const existingUsersByClerkId = await db.select().from(users).where(eq(users.clerkId, userId)).limit(1)

  if (existingUsersByClerkId.length > 0) {
    const existingUser = existingUsersByClerkId[0]
    // Update user info from Clerk if needed
    if (existingUser.name !== name || existingUser.profileImage !== clerkUser.imageUrl) {
      await db
        .update(users)
        .set({
          name,
          profileImage: clerkUser.imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id))
    }
    return {
      ...existingUser,
      name,
      profileImage: clerkUser.imageUrl,
    }
  }

  // Check by email as fallback (for migration of existing users)
  const existingUsersByEmail = await db.select().from(users).where(eq(users.email, email!)).limit(1)

  if (existingUsersByEmail.length > 0) {
    const existingUser = existingUsersByEmail[0]
    // Update existing user with clerk_id
    await db
      .update(users)
      .set({
        clerkId: userId,
        name,
        profileImage: clerkUser.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingUser.id))
    return {
      ...existingUser,
      clerkId: userId,
      name,
      profileImage: clerkUser.imageUrl,
    }
  }

  const [newUser] = await db
    .insert(users)
    .values({
      clerkId: userId,
      email: email!,
      name,
      profileImage: clerkUser.imageUrl,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
    })
    .returning()

  await db.insert(memberships).values({
    userId: newUser.clerkId,
    type: "free",
    status: "active",
    contactViewsRemaining: 2,
    contactViewsTotal: 2,
  })

  return newUser
}

// Get current user from database
export async function getCurrentUser() {
  return getOrCreateUser()
}

// Get user ID from Clerk auth
export async function getUserId() {
  const { userId } = await auth()
  return userId
}
