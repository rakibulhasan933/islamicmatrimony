"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, ChevronDown, Heart } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

const navLinks = [
  { label: "হোম", href: "/" },
  { label: "পেশা সমূহ", href: "/#categories" },
  { label: "সকল বায়োডাটা", href: "/search" },
  { label: "প্যাকেজ", href: "/#pricing" },
  { label: "যোগাযোগ", href: "/#contact" },
]

export function Navbar() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
          <div className="bg-pink-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-pink-600 leading-none">FreelancerMarriage</h1>
            <p className="text-xs text-gray-500 font-medium tracking-wide" style={{ fontSize: "0.7rem" }}>
              ফ্রিল্যান্সারদের বিশ্বস্ত মাধ্যম
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 font-semibold text-gray-700">
          {navLinks.map((link, index) => (
            <Link key={index} href={link.href} className="hover:text-pink-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">

          {isLoading ? (
            <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full transition-all hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-pink-600" />
                </div>
                <span className="text-sm font-medium text-foreground max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-pink-100 rounded-xl shadow-2xl shadow-pink-100/50 z-50 overflow-hidden animate-fade-in-down">
                    <div className="p-3 border-b border-pink-50 bg-gradient-to-r from-pink-50 to-white">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 transition-colors group"
                      >
                        <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>ড্যাশবোর্ড</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors group"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>লগআউট</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/register">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold transition shadow-lg shadow-pink-200">
                প্রোফাইল তৈরি করুন
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-gray-700"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 flex flex-col gap-4 font-semibold animate-fade-in-down">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 border-b border-gray-50 hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}

          {isLoading ? (
            <div className="h-12 bg-muted animate-pulse rounded-xl" />
          ) : user ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 bg-pink-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full h-12 border-pink-200 text-pink-600 bg-transparent hover:bg-pink-50"
                >
                  ড্যাশবোর্ড
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full h-12 border-red-200 text-red-500 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </Button>
            </>
          ) : (
            <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full text-pink-600 font-bold border-b border-gray-50 hover:text-pink-600">
                প্রোফাইল তৈরি করুন
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
