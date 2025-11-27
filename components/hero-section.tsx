import { Button } from "@/components/ui/button"
import { MosqueDome, CrescentMoon, Lantern } from "./islamic-pattern"
import { ArrowRight, Heart, Users, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 pt-16 md:pt-20"
    >
      {/* Islamic Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="hero-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M5 0L10 5L5 10L0 5Z"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hero-pattern)" />
        </svg>
      </div>

      {/* Decorative Elements - Hidden on smaller screens */}
      <Lantern className="absolute top-32 left-[5%] w-10 h-14 md:w-14 md:h-20 text-accent/30 animate-float hidden md:block" />
      <Lantern
        className="absolute top-40 right-[8%] w-8 h-12 md:w-10 md:h-16 text-accent/20 animate-float hidden lg:block"
        style={{ animationDelay: "2s" }}
      />
      <CrescentMoon className="absolute top-24 right-[20%] w-12 h-12 md:w-16 md:h-16 text-secondary/40 animate-glow hidden md:block" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl hidden lg:block">
        <MosqueDome className="w-full h-auto text-primary/10" />
      </div>

      {/* Soft Glow Effects - Smaller on mobile */}
      <div className="absolute top-1/3 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-secondary/10 rounded-full blur-[80px] md:blur-[100px]" />

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-primary font-medium">
            <Heart className="w-3 h-3 md:w-4 md:h-4" />
            <span>বিশ্বস্ত ইসলামী ম্যাট্রিমনি প্ল্যাটফর্ম</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.15] text-balance">
            সঠিক জীবনসঙ্গী খুঁজুন, <span className="text-primary">হালাল পথে</span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty px-4 md:px-0">
            ইসলামী মূল্যবোধে গড়া, নিরাপদ ও বিশ্বস্ত ম্যাট্রিমনি প্ল্যাটফর্ম। আপনার পরিবারের জন্য সঠিক সঙ্গী খুঁজে পেতে আমরা প্রতিশ্রুতিবদ্ধ।
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center pt-2 md:pt-4 px-4 md:px-0">
            <Link href="/register">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 md:px-8 h-12 md:h-14 text-base md:text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all group"
              >
                বায়োডাটা তৈরি করুন
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/search">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-primary/30 text-primary hover:bg-primary/5 px-6 md:px-8 h-12 md:h-14 text-base md:text-lg rounded-full bg-background/50 backdrop-blur-sm"
              >
                প্রোফাইল দেখুন
              </Button>
            </Link>
          </div>

          <div className="pt-8 md:pt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto px-4 md:px-0">
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-card/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-border/50">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
              <span className="text-xs md:text-sm font-medium text-foreground">গোপনীয়তা রক্ষা</span>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-card/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-border/50">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
              <span className="text-xs md:text-sm font-medium text-foreground">যাচাইকৃত প্রোফাইল</span>
            </div>
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-card/50 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-border/50">
              <Heart className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
              <span className="text-xs md:text-sm font-medium text-foreground">পারিবারিক মানের মিল</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  )
}
