import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { StatsSection } from "@/components/stats-section"
import { PremiumBiodatas } from "@/components/premium-biodatas"
import { PricingSection } from "@/components/pricing-section"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <StatsSection />
      <PremiumBiodatas />
      <PricingSection />
    </main>
  )
}
