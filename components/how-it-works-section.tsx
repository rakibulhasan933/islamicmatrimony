"use client"

import { useEffect, useRef, useState } from "react"
import { UserPlus, FileText, Heart, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "অ্যাকাউন্ট তৈরি করুন",
    description: "সহজ রেজিস্ট্রেশন প্রক্রিয়ায় আপনার অ্যাকাউন্ট খুলুন",
    step: "০১",
  },
  {
    icon: FileText,
    title: "বায়োডাটা পূরণ করুন",
    description: "বিস্তারিত তথ্য দিয়ে আপনার প্রোফাইল সম্পূর্ণ করুন",
    step: "০২",
  },
  {
    icon: Heart,
    title: "জীবনসঙ্গী খুঁজুন",
    description: "আপনার পছন্দ অনুযায়ী প্রোফাইল খুঁজে যোগাযোগ করুন",
    step: "০৩",
  },
]

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-16 md:py-24 bg-gradient-to-b from-white to-pink-50/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl animate-pulse-soft" />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl animate-pulse-soft"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 right-[10%] opacity-20 animate-float-slow">
        <CheckCircle className="w-8 h-8 text-pink-400" />
      </div>
      <div className="absolute bottom-1/4 left-[10%] opacity-15 animate-float" style={{ animationDelay: "1s" }}>
        <Heart className="w-10 h-10 text-pink-300 fill-pink-300" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="inline-flex items-center gap-2 text-pink-500 font-semibold text-sm tracking-wide uppercase bg-pink-50 px-4 py-2 rounded-full">
            প্রক্রিয়া
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-6">
            কীভাবে <span className="gradient-text-animated">কাজ করে?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-pink-300 to-pink-100 transition-transform duration-1000 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ transitionDelay: `${(index + 1) * 300}ms` }}
                  />
                </div>
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-pink-100 hover:border-pink-200 transition-all duration-500 hover-lift group-hover:shadow-2xl group-hover:shadow-pink-100/50 overflow-hidden">
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div
                  className={`absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-500 ${isVisible ? "scale-100 rotate-0" : "scale-0 rotate-180"}`}
                  style={{ transitionDelay: `${(index + 1) * 200}ms` }}
                >
                  <span className="group-hover:animate-pulse">{step.step}</span>
                </div>

                <div className="relative w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-100 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <step.icon className="w-8 h-8 text-pink-500 group-hover:animate-bounce-soft" />
                </div>

                <h3 className="relative text-xl font-bold text-foreground mb-3 group-hover:text-pink-600 transition-colors">
                  {step.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">{step.description}</p>

                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
