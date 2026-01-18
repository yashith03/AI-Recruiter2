import React from "react"
import { STEPS } from "@/lib/landing-data"

function StepItem({ number, text }) {
  return (
    <div className="relative group">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-primary font-black text-2xl shadow-sm group-hover:border-primary group-hover:text-primary transition-all duration-300">
        {number}
      </div>
      <p className="text-slate-700 font-bold mt-6 group-hover:text-primary transition-colors">{text}</p>
      <p className="text-slate-500 text-sm mt-2 px-4 italic leading-relaxed">
        Efficiency at every milestone of the journey.
      </p>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="bg-slate-50 py-24 relative overflow-hidden">
      {/* Connector Line (visible on desktop) */}
      <div className="hidden md:block absolute top-[138px] left-[15%] right-[15%] h-0.5 bg-slate-200" />

      <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
        <div className="space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            How it works
          </h2>
          <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-4 gap-12">
          {STEPS.map((step, index) => (
            <StepItem key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
