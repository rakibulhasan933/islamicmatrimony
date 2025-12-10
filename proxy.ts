import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/stats(.*)",
  "/api/membership(.*)",
  "/api/shortlist(.*)",
  "/api/biodatas/save(.*)",
  "/api/biodata/view(.*)",
  "/api/contact/view(.*)",
])

// Define public routes that should never redirect authenticated users
const isPublicRoute = createRouteMatcher([
  "/",
  "/search(.*)",
  "/biodata/(.*)",
  "/pricing(.*)",
  "/about(.*)",
  "/contact(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/register(.*)",
  "/api/biodatas",
  "/api/auth/me",
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
