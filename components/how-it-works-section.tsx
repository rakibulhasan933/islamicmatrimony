import { UserPlus, FileText, Heart } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "অ্যাকাউন্ট তৈরি করুন",
    description: "সহজ রেজিস্ট্রেশন প্রক্রিয়ায় আপনার অ্যাকাউন্ট খুলুন",
    step: "০১",
  },
  {
    icon: FileText,
    title: "আপনার বায়োডাটা পূরণ করুন",
    description: "বিস্তারিত তথ্য দিয়ে আপনার প্রোফাইল সম্পূর্ণ করুন",
    step: "০২",
  },
  {
    icon: Heart,
    title: "পছন্দের জীবনসঙ্গী খুঁজে প্রস্তাব পাঠান",
    description: "আপনার পছন্দ অনুযায়ী প্রোফাইল খুঁজে যোগাযোগ করুন",
    step: "০৩",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent font-medium text-sm tracking-wide uppercase">প্রক্রিয়া</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4">কীভাবে কাজ করে?</h2>
          <div className="h-1 w-20 bg-accent mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              <div className="relative bg-card rounded-2xl p-8 shadow-lg border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl group-hover:-translate-y-1">
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
