import React from "react"
import { FEATURES } from "@/lib/landing-data"

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="p-10 bg-white border border-slate-100 rounded-[32px] hover:border-[#0377fc]/30 hover:shadow-[0_20px_50px_-12px_rgba(3,119,252,0.1)] transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#0377fc]/5 rounded-bl-[100px] -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
      
      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0377fc] mb-8 group-hover:bg-[#0377fc] group-hover:text-white transition-all duration-500 shadow-inner">
        <Icon size={32} />
      </div>
      
      <h3 className="font-black text-2xl text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-6 mb-24">
          <p className="text-[#0377fc] font-black uppercase tracking-[0.2em] text-xs">
            Everything you need
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            A comprehensive suite of tools
          </h2>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to find, interview, and hire the best talent faster than ever.
          </p>
          <div className="w-24 h-2 bg-gradient-to-r from-[#0377fc] to-sky-400 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
