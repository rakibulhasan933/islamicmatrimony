"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CrescentMoon } from "./islamic-pattern"
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

const navLinks = [
  { label: "হোম", href: "/#home" },
  { label: "আমাদের সম্পর্কে", href: "/#about" },
  { label: "কিভাবে কাজ করে", href: "/#how-it-works" },
  { label: "বৈশিষ্ট্য", href: "/#features" },
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <CrescentMoon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
            <span className="text-lg md:text-xl font-bold text-primary">নিকাহ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? "text-foreground" : "text-foreground/80"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-10 bg-muted animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-border">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>ড্যাশবোর্ড</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>লগআউট</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-primary hover:bg-primary/10">
                    লগইন
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6">
                    রেজিস্টার
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-border shadow-xl">
            <nav className="flex flex-col p-4 space-y-1">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-foreground hover:text-primary py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-border space-y-3">
                {isLoading ? (
                  <div className="h-12 bg-muted animate-pulse rounded-xl" />
                ) : user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 border-primary text-primary bg-transparent">
                        ড্যাশবোর্ড
                      </Button>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full h-12 border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      লগআউট
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 border-primary text-primary bg-transparent">
                        লগইন
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-12 bg-primary text-primary-foreground">রেজিস্টার করুন</Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
