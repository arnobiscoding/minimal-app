import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero"
import { FeatureSection } from "@/components/landing/features"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  )
}