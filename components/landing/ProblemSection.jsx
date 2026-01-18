import React from "react"
import { PROBLEMS } from "@/lib/landing-data"

function ProblemCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-left space-y-4 hover:border-primary/50 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-xl text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{text}</p>
    </div>
  )
}

export default function ProblemSection() {
  return (
    <section className="bg-white border-y border-slate-100 py-24">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="space-y-4 mb-16">
          <p className="text-primary font-bold uppercase tracking-widest text-sm">
            The challenge
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Why traditional hiring fails
          </h2>
          <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PROBLEMS.map((problem, index) => (
            <ProblemCard key={index} {...problem} />
          ))}
        </div>
      </div>
    </section>
  )
}
