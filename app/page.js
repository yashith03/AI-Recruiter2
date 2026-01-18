"use client"

import React from "react"
import Navbar from "@/components/landing/Navbar"
import Hero from "@/components/landing/Hero"
import ProblemSection from "@/components/landing/ProblemSection"
import SolutionSection from "@/components/landing/SolutionSection"
import FeaturesSection from "@/components/landing/FeaturesSection"
import HowItWorks from "@/components/landing/HowItWorks"
import UseCasesSection from "@/components/landing/UseCasesSection"
import Footer from "@/components/landing/Footer"

export default function Page() {
  return (
    <main className="font-display bg-slate-50 text-[#0d141c] overflow-x-hidden selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <UseCasesSection />
      <Footer />
    </main>
  )
}
