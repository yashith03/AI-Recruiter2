import React from "react"
import { USE_CASES } from "@/lib/landing-data"
import { Quote } from "lucide-react"

function CaseCard({ title, text }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-10 hover:shadow-2xl hover:shadow-[#0377fc]/5 transition-all duration-500 hover:-translate-y-2 group">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-black text-2xl text-slate-900 group-hover:text-[#0377fc] transition-colors">{title}</h3>
        <Quote className="text-slate-200 group-hover:text-[#0377fc]/20 transition-colors" size={32} />
      </div>
      <p className="text-slate-500 font-medium leading-relaxed italic">
        &quot;{text}&quot;
      </p>
    </div>
  )
}

export default function UseCasesSection() {
  return (
    <section id="use" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6 mb-24">
          <p className="text-[#0377fc] font-black uppercase tracking-[0.2em] text-xs">
            Who it’s for
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Designed for every team
          </h2>
          <div className="w-24 h-2 bg-gradient-to-r from-[#0377fc] to-sky-400 mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {USE_CASES.map((useCase, index) => (
            <CaseCard key={index} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  )
}
