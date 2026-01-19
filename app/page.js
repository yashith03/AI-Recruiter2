
import React from 'react'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import ProblemSection from '@/components/landing/ProblemSection'
import SolutionSection from '@/components/landing/SolutionSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import HowItWorks from '@/components/landing/HowItWorks'
import TrustSection from '@/components/landing/TrustSection'
import UseCasesSection from '@/components/landing/UseCasesSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function Page() {
  return (
    <div className="font-body bg-background-light text-[#0d141c] overflow-x-hidden">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <TrustSection />
      <UseCasesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
