import { Quote } from "lucide-react"
import { CrescentMoon, Lantern } from "./islamic-pattern"

const testimonials = [
  {
    quote: "আল্লাহর রহমতে এই প্ল্যাটফর্মের মাধ্যমে আমি আমার জীবনসঙ্গী পেয়েছি। পরিবার সবাই খুশি।",
    location: "ঢাকা",
  },
  {
    quote: "গোপনীয়তা রক্ষা করে পরিবারিক মূল্যবোধ মেনে জীবনসঙ্গী খুঁজে পাওয়ার সেরা মাধ্যম।",
    location: "চট্টগ্রাম",
  },
  {
    quote: "ইসলামী দৃষ্টিভঙ্গি মেনে সঠিক পাত্র-পাত্রী খুঁজে পেতে এই প্ল্যাটফর্ম অসাধারণ।",
    location: "সিলেট",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative Elements */}
      <Lantern className="absolute top-10 left-10 w-12 h-20 text-accent/30 animate-float hidden lg:block" />
      <CrescentMoon className="absolute bottom-10 right-10 w-16 h-16 text-secondary/40 hidden lg:block" />

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="testimonial-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <path
                d="M4 0L8 4L4 8L0 4Z"
                stroke="currentColor"
                strokeWidth="0.3"
                fill="none"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#testimonial-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-medium text-sm tracking-wide uppercase">প্রশংসাপত্র</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4">সফল বিবাহের গল্প</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">আল্লাহর রহমতে আমাদের মাধ্যমে শুরু হয়েছে হাজারো সুন্দর যাত্রা</p>
          <div className="h-1 w-20 bg-accent mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card rounded-2xl p-8 shadow-lg border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Islamic Pattern Background */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                  <path d="M50 0L100 50L50 100L0 50Z" fill="currentColor" />
                </svg>
              </div>

              <div className="pt-4">
                <p className="text-foreground leading-relaxed mb-6 text-lg">"{testimonial.quote}"</p>

                <div className="flex items-center gap-3">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <CrescentMoon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">একটি পরিবার</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
