import { CrescentMoon } from "./islamic-pattern"
import { Heart } from "lucide-react"

const menuItems = [
  { label: "হোম", href: "#home" },
  { label: "আমাদের সম্পর্কে", href: "#about" },
  { label: "কিভাবে কাজ করে", href: "#how-it-works" },
  { label: "বৈশিষ্ট্য", href: "#features" },
]

const legalItems = [
  { label: "গোপনীয়তা নীতি", href: "#" },
  { label: "ব্যবহারের শর্তাবলী", href: "#" },
  { label: "যোগাযোগ", href: "#contact" },
]

export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-linear-to-b from-primary to-primary/90 text-primary-foreground relative overflow-hidden"
    >
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M4 0L8 4L4 8L0 4Z" stroke="currentColor" strokeWidth="0.4" fill="none" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10 md:px-20">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CrescentMoon className="w-10 h-10 text-secondary" />
              <span className="text-2xl font-bold">হালাল ম্যাট্রিমনি</span>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              ইসলামী মূল্যবোধে গড়া বিশ্বস্ত ম্যাট্রিমনি প্ল্যাটফর্ম। আপনার পবিত্র যাত্রায় আমরা সঙ্গী।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">দ্রুত লিংক</h4>
            <nav className="flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">আইনি তথ্য</h4>
            <nav className="flex flex-col gap-3">
              {legalItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-primary-foreground/80 hover:text-secondary transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-primary-foreground/20 mb-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/70">
          <p>© ২০২৫ হালাল ম্যাট্রিমনি। সকল অধিকার সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-secondary" fill="currentColor" />
            ভালোবাসায় তৈরি
          </p>
        </div>
      </div>
    </footer>
  )
}
