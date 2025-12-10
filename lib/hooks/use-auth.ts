"use client"
import { useUser, useClerk } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface DbUser {
  id: number
  email: string
  name: string
  phone?: string | null
  profileImage?: string | null
}

export function useAuth() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const [dbUser, setDbUser] = useState<DbUser | null>(null)
  const [isLoadingDb, setIsLoadingDb] = useState(true)

  useEffect(() => {
    async function fetchDbUser() {
      if (isSignedIn && clerkUser) {
        try {
          const res = await fetch("/api/auth/me")
          const data = await res.json()
          if (data.user) {
            setDbUser(data.user)
          }
        } catch (error) {
          console.error("Error fetching db user:", error)
        }
      } else {
        setDbUser(null)
      }
      setIsLoadingDb(false)
    }

    if (isLoaded) {
      fetchDbUser()
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const user =
    dbUser ||
    (clerkUser
      ? {
          id: 0,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: clerkUser.firstName
            ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
            : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0] || "User",
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          profileImage: clerkUser.imageUrl,
        }
      : null)

  const logout = async () => {
    await signOut()
  }

  return {
    user,
    isLoading: !isLoaded || isLoadingDb,
    isAuthenticated: isSignedIn,
    error: null,
    logout,
    mutate: () => {},
  }
}
