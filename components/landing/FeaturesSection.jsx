import React from "react"
import { FEATURES } from "@/lib/landing-data"

function FeatureCard({ icon: Icon, title }) {
  return (
    <div className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-lg text-slate-900">{title}</h3>
      <p className="text-slate-500 text-sm mt-3 leading-relaxed">
        Powerful modules designed to streamline your entire recruitment pipeline with precision.
      </p>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">
            Everything you need
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A comprehensive suite of tools to help you find, interview, and hire the best talent faster than ever.
          </p>
          <div className="w-20 h-1.5 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
