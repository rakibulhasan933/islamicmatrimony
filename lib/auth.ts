import { db } from "./db"
import { users } from "./db/schema"
import { eq, } from "drizzle-orm"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")
const TOKEN_EXPIRY = "30d"


// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Create JWT token
async function createJWT(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

export async function createSession(userId: number): Promise<string> {

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  // Create JWT token containing session reference
  const jwtToken = await createJWT(userId)

  // Set cookie with JWT (for browser clients)
  const cookieStore = await cookies()
  cookieStore.set("session_token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return jwtToken
}

export async function getCurrentUser() {
  try {
    // Fallback: get token from cookies and verify
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (!token) return null

    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const { userId } = payload as { userId: number; }


    // Get user
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (userResult.length === 0) return null

    const { password, ...userWithoutPassword } = userResult[0]
    return userWithoutPassword
  } catch (error) {
    console.error("getCurrentUser error:", error)
    return null
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session_token")?.value

    if (token) {
      // Verify JWT to get session ID
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        await cookieStore.delete("session_token");
      } catch {
        // Token invalid, just clear cookie
      }
    }

    cookieStore.delete("session_token")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

// Register user
export async function registerUser(
  email: string,
  password: string,
  name: string,
  phone?: string,
  profileImage?: string,
) {
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (existingUser.length > 0) {
    throw new Error("এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে")
  }

  const hashedPassword = await hashPassword(password)

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name,
      phone,
      profileImage,
    })
    .returning()

  return newUser
}

// Login user
export async function loginUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (!user) {
    throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়")
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new Error("ইমেইল বা পাসওয়ার্ড সঠিক নয়")
  }

  await createSession(user.id)

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function verifySessionToken(token: string): Promise<{ userId: number } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const { userId } = payload as { userId: number; }

    return { userId }
  } catch {
    return null
  }
}
