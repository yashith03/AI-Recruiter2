import React from "react"
import Link from "next/link"
import { Mic, CheckCircle } from "lucide-react"

function Stat({ label, value }) {
  return (
    <div className="border rounded-xl p-4 text-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-xl font-bold text-slate-900">{value}</p>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 text-center lg:text-left">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-slate-900">
            Hire Faster with <span className="text-primary italic">AI-Powered</span> Interviews
          </h1>

          <p className="text-slate-600 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Automate first-round interviews using natural AI voice conversations.
            Save time and remove bias without losing quality.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link href="/auth">
            <button className="px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-primary/20">
              Start interviewing
            </button>
          </Link>
          <button className="px-8 py-4 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-all">
            View demo
          </button>
        </div>

        <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-sm font-medium text-slate-500">
          <span className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            14-day free trial
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500" />
            No credit card
          </span>
        </div>
      </div>

      {/* Decorative UI */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-blue-400/10 blur-3xl rounded-full" />
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-8">
          <div className="h-48 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
              <Mic size={56} className="text-primary animate-pulse relative z-10" />
            </div>
            <p className="text-sm font-medium text-slate-400 animate-bounce">Listening...</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Stat label="Score accuracy" value="98.5%" />
            <Stat label="Avg response" value="4.2s" />
          </div>
        </div>
      </div>
    </section>
  )
}
