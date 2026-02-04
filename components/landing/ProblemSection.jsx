import React from "react"
import { PROBLEMS } from "@/lib/landing-data"

function ProblemCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-10 text-left space-y-5 hover:border-[#0377fc]/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-[#0377fc] shadow-inner group-hover:bg-[#0377fc] group-hover:text-white transition-all duration-300">
        <Icon size={28} />
      </div>
      <h3 className="font-black text-2xl text-slate-900">{title}</h3>
      <p className="text-slate-500 font-medium leading-[1.6]">{text}</p>
    </div>
  )
}

export default function ProblemSection() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="space-y-6 mb-20">
          <p className="text-[#0377fc] font-black uppercase tracking-[0.2em] text-xs">
            The challenge
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Why traditional hiring fails
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-[#0377fc] to-sky-400 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {PROBLEMS.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </section>
  )
}
