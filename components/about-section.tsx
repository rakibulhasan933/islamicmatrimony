import { MosqueDome } from "./islamic-pattern"
import { CheckCircle } from "lucide-react"

const stats = [
  { value: "৫০০০+", label: "সফল বিবাহ" },
  { value: "২০০০০+", label: "সদস্য" },
  { value: "৯৮%", label: "সন্তুষ্টি" },
]

const highlights = [
  "সম্পূর্ণ গোপনীয়তা বজায় রাখা হয়",
  "প্রতিটি প্রোফাইল যাচাই করা হয়",
  "পারিবারিক মূল্যবোধ রক্ষা করা হয়",
  "শরীয়াহ সম্মত উপায়ে পরিচালিত",
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="about-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#about-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase bg-primary/10 px-4 py-2 rounded-full">
                আমাদের সম্পর্কে
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              আমাদের <span className="text-primary">উদ্দেশ্য</span>
            </h2>

            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              <p>বিয়ে শুধু একটি সম্পর্ক নয়, এটি এক পবিত্র অঙ্গীকার।</p>
              <p>
                আমরা বিশ্বাস করি ইসলামী মূল্যবোধের আলোকে সঠিক জীবনসঙ্গী খুঁজে পাওয়া একটি বরকতময় যাত্রা। আমাদের প্ল্যাটফর্মে আপনি পাবেন
                নিরাপদ, গোপনীয় এবং পরিবারিক মানসম্পন্ন পাত্র-পাত্রীদের প্রোফাইল।
              </p>
            </div>

            <div className="space-y-3">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-5 border border-border/50"
                >
                  <div className="text-3xl lg:text-4xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Glow Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full blur-3xl scale-110" />

              <div className="relative bg-gradient-to-br from-card to-muted/20 rounded-3xl p-10 border border-border/50 shadow-2xl">
                <MosqueDome className="w-full h-auto text-primary" />

                {/* Couple Silhouette */}
                <svg viewBox="0 0 200 100" className="w-full mt-6 text-primary/50">
                  {/* Person 1 */}
                  <circle cx="70" cy="30" r="12" fill="currentColor" opacity="0.7" />
                  <path d="M55 50 Q70 45 70 70 L70 100 L55 100 L55 50" fill="currentColor" opacity="0.5" />
                  <path d="M70 50 Q70 45 85 50 L85 100 L70 100 L70 50" fill="currentColor" opacity="0.5" />

                  {/* Person 2 */}
                  <circle cx="130" cy="30" r="12" fill="currentColor" opacity="0.7" />
                  <path d="M115 45 Q130 40 145 45 L145 100 L115 100 Z" fill="currentColor" opacity="0.5" />

                  {/* Connection heart */}
                  <path d="M100 55 C95 50 90 55 100 65 C110 55 105 50 100 55" fill="currentColor" opacity="0.6" />
                </svg>

                {/* Decorative dots */}
                <div className="absolute top-4 right-4 flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent/60" />
                  <div className="w-2 h-2 rounded-full bg-accent/40" />
                  <div className="w-2 h-2 rounded-full bg-accent/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
