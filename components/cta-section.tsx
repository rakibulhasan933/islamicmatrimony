"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ArrowRight, Sparkles } from "lucide-react"

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-pink-100 via-pink-50 to-white"
    >
      <div className="absolute top-10 left-[10%] animate-float-slow opacity-40">
        <Heart className="w-8 h-8 text-pink-400 fill-pink-400 drop-shadow-lg" />
      </div>
      <div className="absolute bottom-20 right-[15%] animate-float opacity-30" style={{ animationDelay: "1s" }}>
        <Heart className="w-6 h-6 text-pink-300 fill-pink-300" />
      </div>
      <div className="absolute top-1/2 left-[5%] animate-float-reverse opacity-20" style={{ animationDelay: "2s" }}>
        <Heart className="w-10 h-10 text-pink-200 fill-pink-200" />
      </div>
      <div className="absolute top-1/4 right-[8%] animate-float opacity-25" style={{ animationDelay: "0.5s" }}>
        <Heart className="w-7 h-7 text-pink-300 fill-pink-300" />
      </div>
      <div className="absolute bottom-1/3 left-[15%] animate-float-slow opacity-35" style={{ animationDelay: "1.5s" }}>
        <Sparkles className="w-6 h-6 text-pink-400" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl animate-blob" />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl animate-blob"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="mb-6 flex justify-center">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center animate-bounce-soft shadow-lg shadow-pink-500/30">
              <Heart className="w-8 h-8 text-white fill-white animate-heart-beat" />
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-2xl bg-pink-500/30 animate-ping"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight text-balance">
            আপনার জন্য সঠিক জীবনসঙ্গী <span className="gradient-text-animated">অপেক্ষা করছে</span>
          </h2>

          <p className="text-lg text-muted-foreground mt-6 max-w-xl mx-auto">
            আজই রেজিস্ট্রেশন করুন এবং শুরু করুন পবিত্র বন্ধনের যাত্রা।
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl hover:shadow-pink-500/40 transition-all hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative z-10">এখনই শুরু করুন</span>
                <ArrowRight className="w-5 h-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/search">
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-pink-300 text-pink-600 hover:bg-pink-50 px-10 py-7 text-lg rounded-full bg-white/50 backdrop-blur-sm hover:scale-105 transition-all"
              >
                <span className="group-hover:animate-pulse">বায়োডাটা দেখুন</span>
              </Button>
            </Link>
          </div>

          <div
            className={`mt-10 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-pink-100 shadow-lg transition-all duration-700 delay-300 hover:shadow-xl hover:scale-105 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-heart-beat" />
            <span className="text-sm text-muted-foreground">বিশ্বস্ত ও নিরাপদ প্ল্যাটফর্ম</span>
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
