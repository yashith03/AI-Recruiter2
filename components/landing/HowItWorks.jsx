import React from "react"
import { STEPS } from "@/lib/landing-data"

function StepItem({ number, title, text }) {
  return (
    <div className="relative group">
      <div className="relative">
        <div className="w-20 h-20 mx-auto rounded-[24px] bg-white border-2 border-slate-100 flex items-center justify-center text-[#0377fc] font-black text-3xl shadow-xl shadow-slate-200/50 group-hover:border-[#0377fc] group-hover:text-white group-hover:bg-[#0377fc] transition-all duration-500 relative z-10">
          {number}
        </div>
        {/* Step Glow */}
        <div className="absolute inset-0 bg-[#0377fc]/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <h3 className="text-slate-900 font-black text-xl mt-8 mb-3 group-hover:text-[#0377fc] transition-colors">{title}</h3>
      <p className="text-slate-500 font-medium px-6 leading-relaxed">
        {text}
      </p>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50 py-32 relative overflow-hidden">
      {/* Decorative Wave Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d">
          <path fill="#0377fc" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="space-y-6 mb-24">
          <p className="text-[#0377fc] font-black uppercase tracking-[0.2em] text-xs">
            How it works
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Simple, automated process
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-[#0377fc] to-sky-400 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Connector Line (visible on desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-0.5 bg-slate-200" />
          
          {STEPS.map((step, index) => (
            <StepItem key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
