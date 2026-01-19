
import React from 'react'
import Link from 'next/link'

const CTASection = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto bg-[#101922] rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 150%, #0d7ff2 0%, transparent 50%), radial-gradient(circle at 80% -50%, #0d7ff2 0%, transparent 50%)' }}></div>
        <div className="relative z-10 flex flex-col items-center gap-8">
          <h2 className="text-h1 text-white leading-tight">Ready to Transform Your Hiring?</h2>
          <p className="text-body-lg text-slate-300 max-w-xl">Join forward-thinking companies saving 100+ hours per month on recruitment.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <Link href="/dashboard">
              <button className="h-14 px-10 rounded-xl bg-primary text-white text-body font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 w-full sm:w-auto active:scale-95">
                Get Started Free
              </button>
            </Link>
            <button className="h-14 px-10 rounded-xl bg-transparent border border-slate-600 text-white text-body font-bold hover:bg-white/10 transition-colors w-full sm:w-auto">
              View Live Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
