import { Button } from "@/components/ui/button"
import { CrescentMoon, Lantern } from "./islamic-pattern"

export function CTASection() {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/20">
      {/* Decorative Elements */}
      <Lantern className="absolute top-10 left-20 w-10 h-16 text-accent/40 animate-float hidden md:block" />
      <Lantern
        className="absolute bottom-10 right-20 w-8 h-14 text-accent/30 animate-float hidden md:block"
        style={{ animationDelay: "3s" }}
      />
      <CrescentMoon className="absolute top-1/2 right-10 w-20 h-20 text-secondary/30 hidden lg:block" />

      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="cta-pattern" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Dove Icon */}
          <div className="mb-8 flex justify-center">
            <svg viewBox="0 0 80 60" className="w-20 h-16 text-primary">
              <path d="M10 40 Q20 30 40 35 Q60 30 70 40 Q60 35 40 38 Q20 35 10 40" fill="currentColor" opacity="0.6" />
              <circle cx="15" cy="38" r="2" fill="currentColor" />
              <path d="M70 40 Q75 35 78 38" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
            আপনার জন্য সঠিক জীবনসঙ্গী অপেক্ষা করছে 🕊️
          </h2>

          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            আজই রেজিস্ট্রেশন করুন এবং শুরু করুন পবিত্র বন্ধনের যাত্রা।
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5"
            >
              এখনই শুরু করুন
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-10 inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border/50">
            <CrescentMoon className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">বিশ্বস্ত ও নিরাপদ প্ল্যাটফর্ম</span>
          </div>
        </div>
      </div>
    </section>
  )
}
