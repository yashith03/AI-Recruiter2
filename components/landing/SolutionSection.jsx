import React from "react"
import Image from "next/image"
import { CheckCircle, ArrowRight } from "lucide-react"
import { SOLUTIONS_FEATURES } from "@/lib/landing-data"

function FeatureItem({ text }) {
  return (
    <li className="flex items-center gap-4 group/item">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center group-hover/item:bg-[#0377fc] transition-colors duration-300">
        <CheckCircle className="text-[#0377fc] group-hover/item:text-white" size={18} />
      </div>
      <span className="text-slate-700 font-semibold group-hover/item:text-[#0377fc] transition-colors">{text}</span>
    </li>
  )
}

export default function SolutionSection() {
  return (
    <section className="bg-slate-50 py-32 overflow-hidden relative">
       {/* Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#0377fc]/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-400/5 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-24 items-center relative z-10">
        <div className="relative group">
          <div className="absolute -inset-6 bg-gradient-to-br from-[#0377fc] to-blue-600 opacity-20 blur-3xl rounded-[40px] group-hover:opacity-30 transition-opacity duration-700" />
          
          <div className="relative aspect-square overflow-hidden rounded-[48px] shadow-2xl border border-white/20">
            <Image 
              src="/airecuiter-middle.jpg" 
              alt="AI Recruiter Solution" 
              fill
              className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
          
          {/* AI Badge */}
          <div className="absolute -bottom-6 -right-6 bg-white border border-slate-200 px-6 py-4 rounded-3xl shadow-xl flex items-center gap-3 animate-float z-20">
            <div className="w-3 h-3 rounded-full bg-[#0377fc] animate-ping" />
            <span className="font-black text-slate-800 tracking-tight">AI Active</span>
          </div>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <p className="text-[#0377fc] font-black uppercase tracking-[0.2em] text-xs">
              The solution
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Your autonomous <br />
              <span className="text-[#0377fc]">AI recruiter</span>
            </h2>
          </div>

          <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-lg">
            AI Recruiter conducts natural voice interviews, adapts dynamically to candidate answers,
            and provides objective scoring based on your specific criteria.
          </p>

          <ul className="space-y-6">
            {SOLUTIONS_FEATURES.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </ul>

          <div className="pt-6">
            <button className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all flex items-center gap-3 group shadow-xl shadow-slate-900/10 active:scale-95">
              Explore more features
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
