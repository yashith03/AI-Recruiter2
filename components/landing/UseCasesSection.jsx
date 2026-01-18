import React from "react"
import { USE_CASES } from "@/lib/landing-data"

function CaseCard({ title }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1">
      <h3 className="font-bold text-xl mb-3 text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed italic">
        "Built to scale interviews without extra effort, ensuring quality is never compromised."
      </p>
    </div>
  )
}

export default function UseCasesSection() {
  return (
    <section id="use" className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Who it’s for
          </h2>
          <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {USE_CASES.map((useCase, index) => (
            <CaseCard key={index} {...useCase} />
          ))}
        </div>
      </div>
    </section>
  )
}
