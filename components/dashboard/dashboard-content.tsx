"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, FileText, Heart, Settings, LogOut, Menu, X, Home, Search, Bell, ChevronRight } from "lucide-react"
import useSWR from "swr"

interface DashboardContentProps {
  user: {
    id: number
    email: string
    name: string
    phone?: string | null
    profileImage?: string | null // Added profileImage
  }
}

interface User {
  id: number
  email: string
  name: string
  phone?: string | null
  profileImage?: string | null
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())


export function DashboardContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { data } = useSWR<{ user: User }>("/api/auth/me", fetcher);

  const user: User | null = data?.user || null

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuItems = [
    { icon: Home, label: "ড্যাশবোর্ড", href: "/dashboard", active: true },
    { icon: FileText, label: "আমার বায়োডাটা", href: "/dashboard/biodata" },
    { icon: Search, label: "বায়োডাটা খুঁজুন", href: "/search" },
    { icon: Heart, label: "শর্টলিস্ট", href: "/dashboard/shortlist" },
    { icon: Bell, label: "নোটিফিকেশন", href: "/dashboard/notifications" },
    { icon: Settings, label: "সেটিংস", href: "/dashboard/settings" },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-xl font-bold text-primary">
          নিকাহ
        </Link>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="text-xl font-bold text-primary">
            নিকাহ
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info - Updated to show profile image */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {user?.profileImage ? (
                <Image
                  src={user.profileImage || "/placeholder.svg"}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{user?.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${item.active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
            className="w-full justify-start gap-3 h-12 border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Welcome Section - Added profile image */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {user?.profileImage ? (
                <Image
                  src={user?.profileImage || "/placeholder.svg"}
                  alt={user?.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">স্বাগতম, {user?.name}!</h1>
              <p className="text-muted-foreground mt-1">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Link
              href="/dashboard/biodata"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mt-4">বায়োডাটা তৈরি করুন</h3>
              <p className="text-sm text-muted-foreground mt-1">আপনার বায়োডাটা তৈরি বা সম্পাদনা করুন</p>
            </Link>

            <Link
              href="/search"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-secondary/30 flex items-center justify-center">
                  <Search className="w-6 h-6 text-secondary-foreground" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mt-4">বায়োডাটা খুঁজুন</h3>
              <p className="text-sm text-muted-foreground mt-1">আপনার পছন্দের বায়োডাটা খুঁজুন</p>
            </Link>

            <Link
              href="/dashboard/shortlist"
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mt-4">শর্টলিস্ট</h3>
              <p className="text-sm text-muted-foreground mt-1">পছন্দের বায়োডাটা দেখুন</p>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <p className="text-sm text-muted-foreground">মোট বায়োডাটা</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">১২,৪৫৬</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <p className="text-sm text-muted-foreground">পাত্রীর বায়োডাটা</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">৬,৭৮৯</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <p className="text-sm text-muted-foreground">পাত্রের বায়োডাটা</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">৫,৬৬৭</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 md:p-6">
              <p className="text-sm text-muted-foreground">সফল বিয়ে</p>
              <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">১,২৩৪</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
