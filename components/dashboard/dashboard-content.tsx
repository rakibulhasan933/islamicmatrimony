"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  User,
  FileText,
  Heart,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  ChevronRight,
  Eye,
  Clock,
  Crown,
  Calendar,
  Zap,
  ExternalLink,
} from "lucide-react"
import useSWR from "swr"
import { useUser, useClerk } from "@clerk/nextjs"

interface ViewedBiodata {
  viewId: number
  viewedAt: string
  biodataId: number
  biodataNo: string
  fullName: string
  photo: string | null
  age: number | null
  type: "bride" | "groom"
  occupation: string | null
  permanentDistrict: string | null
  education: string | null
}

interface DashboardStats {
  membership: {
    type: string
    status: string
    connectionsRemaining: number
    connectionsTotal: number
    daysRemaining: number
    expiresAt: string | null
    startsAt: string | null
  }
  viewedBiodatas: ViewedBiodata[]
  totalViews: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function DashboardContent() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const { user: clerkUser, isLoaded } = useUser()
  const { signOut } = useClerk()

  const { data: statsData, isLoading: statsLoading } = useSWR<DashboardStats>("/api/stats", fetcher)

  const userName = clerkUser?.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
    : clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"
  const userEmail = clerkUser?.emailAddresses[0]?.emailAddress || ""
  const userImage = clerkUser?.imageUrl || null

  const stats = statsData

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut()
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
  ]

  const getMembershipBadge = (type: string) => {
    switch (type) {
      case "gold":
        return { label: "গোল্ড", color: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white" }
      case "silver":
        return { label: "সিলভার", color: "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800" }
      default:
        return { label: "ফ্রি", color: "bg-gray-100 text-gray-600" }
    }
  }

  const membershipBadge = getMembershipBadge(stats?.membership?.type || "free")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 60) return `${diffMins} মিনিট আগে`
    if (diffHours < 24) return `${diffHours} ঘন্টা আগে`
    if (diffDays < 7) return `${diffDays} দিন আগে`
    return formatDate(dateString)
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="text-xl font-bold text-primary">
          FreelancerMarriage
        </Link>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="text-xl font-bold text-primary">
            FreelancerMarriage
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info - Updated to use Clerk user data */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              {userImage ? (
                <Image
                  src={userImage || "/placeholder.svg"}
                  alt={userName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{userName}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${membershipBadge.color}`}>
                {membershipBadge.label}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                item.active
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
          {/* Welcome Section - Updated to use Clerk user data */}
          <div className="mb-8 flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
              {userImage ? (
                <Image
                  src={userImage || "/placeholder.svg"}
                  alt={userName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">স্বাগতম, {userName}!</h1>
              <p className="text-muted-foreground mt-1">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম</p>
            </div>
          </div>

          {/* ... existing code for stats cards ... */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Connections Remaining */}
            <div className="bg-linear-to-br from-pink-500 to-rose-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="text-sm text-white/80">কানেকশন বাকি</span>
                </div>
                <p className="text-4xl font-bold">
                  {statsLoading ? "..." : stats?.membership?.connectionsRemaining || 0}
                </p>
                <p className="text-xs text-white/70 mt-1">মোট {stats?.membership?.connectionsTotal || 0} টির মধ্যে</p>
              </div>
            </div>

            {/* Days Remaining */}
            <div className="bg-linear-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm text-white/80">মেয়াদ বাকি</span>
                </div>
                <p className="text-4xl font-bold">{statsLoading ? "..." : stats?.membership?.daysRemaining || 0}</p>
                <p className="text-xs text-white/70 mt-1">দিন</p>
              </div>
            </div>

            {/* Total Viewed */}
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm text-white/80">দেখা বায়োডাটা</span>
                </div>
                <p className="text-4xl font-bold">{statsLoading ? "..." : stats?.totalViews || 0}</p>
                <p className="text-xs text-white/70 mt-1">টি বায়োডাটা</p>
              </div>
            </div>

            {/* Membership Type */}
            <div className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="text-sm text-white/80">প্যাকেজ</span>
                </div>
                <p className="text-2xl font-bold capitalize">{statsLoading ? "..." : membershipBadge.label}</p>
                {stats?.membership?.expiresAt && (
                  <p className="text-xs text-white/70 mt-1">{formatDate(stats.membership.expiresAt)} পর্যন্ত</p>
                )}
              </div>
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

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">সম্প্রতি দেখা বায়োডাটা</h2>
                  <p className="text-sm text-muted-foreground">আপনি যাদের বায়োডাটা দেখেছেন</p>
                </div>
              </div>
            </div>

            {statsLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full mx-auto" />
                <p className="text-muted-foreground mt-3">লোড হচ্ছে...</p>
              </div>
            ) : stats?.viewedBiodatas && stats.viewedBiodatas.length > 0 ? (
              <div className="divide-y divide-border">
                {stats.viewedBiodatas.map((biodata, index) => (
                  <Link
                    key={biodata.viewId}
                    href={`/biodata/${biodata.biodataNo}`}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-linear-to-br from-pink-100 to-rose-200 shrink-0">
                      {biodata.photo ? (
                        <Image
                          src={biodata.photo || "/placeholder.svg"}
                          alt={biodata.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-6 h-6 text-pink-400" />
                        </div>
                      )}
                      <div
                        className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                          biodata.type === "bride" ? "bg-pink-500" : "bg-blue-500"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{biodata.fullName}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            biodata.type === "bride" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {biodata.type === "bride" ? "পাত্রী" : "পাত্র"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {biodata.age && `${biodata.age} বছর`}
                        {biodata.permanentDistrict && ` • ${biodata.permanentDistrict}`}
                        {biodata.occupation && ` • ${biodata.occupation}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatTimeAgo(biodata.viewedAt)}</p>
                    </div>

                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">কোনো বায়োডাটা দেখা হয়নি</h3>
                <p className="text-sm text-muted-foreground mb-4">আপনি এখনো কোনো বায়োডাটা আনলক করেননি</p>
                <Link href="/search">
                  <Button className="bg-primary hover:bg-primary/90">বায়োডাটা খুঁজুন</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
