import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!")

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/search",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/biodatas",
  "/api/upload",
]

const isPublicPath = (pathname: string) => {
  return publicPaths.some((path) => {
    if (path === pathname) return true
    if (path.endsWith("*") && pathname.startsWith(path.slice(0, -1))) return true
    return false
  })
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Allow static files and API routes that don't need auth
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next()
  }

  // Get session token from header or cookie
  const authHeader = request.headers.get("authorization")
  const sessionToken = authHeader?.replace("Bearer ", "") || request.cookies.get("session_token")?.value

  if (!sessionToken) {
    // Redirect to login for protected pages
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 })
  }

  try {
    // Verify JWT token using jose
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET)

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", String(payload.userId))
    requestHeaders.set("x-session-id", String(payload.sessionId))

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error("JWT verification failed:", error)

    // Clear invalid cookie
    const response = pathname.startsWith("/api")
      ? NextResponse.json({ error: "সেশন মেয়াদ উত্তীর্ণ" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url))

    response.cookies.delete("session_token")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
