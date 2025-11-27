"use client"
import useSWR from "swr"

interface User {
  id: number
  email: string
  name: string
  phone?: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher)

  const user: User | null = data?.user || null

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    mutate()
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    logout,
    mutate,
  }
}
