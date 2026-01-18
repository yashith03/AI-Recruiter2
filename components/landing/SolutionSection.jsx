import React from "react"
import { Brain, CheckCircle } from "lucide-react"
import { SOLUTIONS_FEATURES } from "@/lib/landing-data"

function FeatureItem({ text }) {
  return (
    <li className="flex items-center gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
        <CheckCircle className="text-primary" size={16} />
      </div>
      <span className="text-slate-600 font-medium">{text}</span>
    </li>
  )
}

export default function SolutionSection() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-br from-primary to-blue-600 opacity-10 blur-2xl rounded-3xl group-hover:opacity-20 transition-opacity" />
          <div className="relative bg-slate-900 rounded-3xl p-16 flex items-center justify-center overflow-hidden border border-slate-800">
             {/* Animated Brain Background Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <Brain size={120} className="text-primary relative z-10 transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-primary font-bold uppercase tracking-widest text-sm">
              The solution
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Your autonomous AI recruiter
            </h2>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed">
            AI Recruiter conducts natural voice interviews, adapts dynamically to candidate answers,
            and provides objective scoring based on your specific criteria.
          </p>

          <ul className="space-y-4">
            {SOLUTIONS_FEATURES.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </ul>

          <div className="pt-4">
            <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2 group">
              Explore more features
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
