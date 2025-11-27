import { Shield, CheckCircle, Gem, Moon, Lock, Heart } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "গোপনীয়তা নিশ্চিত",
    description: "আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত এবং গোপনীয় রাখা হয়",
  },
  {
    icon: CheckCircle,
    title: "যাচাইকৃত প্রোফাইল",
    description: "প্রতিটি প্রোফাইল সতর্কতার সাথে যাচাই করা হয় বিশ্বস্ততার জন্য",
  },
  {
    icon: Heart,
    title: "পরিবারিক মানের মিল",
    description: "পারিবারিক মূল্যবোধ ও সংস্কৃতির সাথে সামঞ্জস্যপূর্ণ সঙ্গী",
  },
  {
    icon: Moon,
    title: "ইসলামী দৃষ্টিকোণ",
    description: "শরীয়াহ সম্মত উপায়ে জীবনসঙ্গী খোঁজার সুযোগ",
  },
  {
    icon: Lock,
    title: "নিরাপদ যোগাযোগ",
    description: "পরিবারের তত্ত্বাবধানে নিরাপদ যোগাযোগ ব্যবস্থা",
  },
  {
    icon: Gem,
    title: "প্রিমিয়াম সেবা",
    description: "উচ্চমানের সেবা এবং ব্যক্তিগত সহায়তা প্রদান",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm tracking-wide uppercase bg-primary/10 px-4 py-2 rounded-full">
            বৈশিষ্ট্য
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-6">
            কেন আমাদের <span className="text-primary">বেছে নেবেন</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            আমরা আপনার জীবনসঙ্গী খোঁজার যাত্রাকে সহজ, নিরাপদ ও সম্মানজনক করতে প্রতিশ্রুতিবদ্ধ
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
