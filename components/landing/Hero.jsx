import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Mic, CheckCircle, Play } from "lucide-react"



export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f7f9] pt-20 pb-20 lg:pt-32 lg:pb-40">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0377fc]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0377fc]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 text-center lg:text-left">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-slate-900">
              Hire Faster with <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0377fc] to-[#0ea5e9]">AI-Powered</span> Interviews
            </h1>

            <p className="text-slate-600 text-xl md:text-2xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Automate first-round interviews using natural AI voice conversations.
              Save time and remove bias without losing quality.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link href="/auth">
              <button className="px-10 py-5 rounded-2xl bg-[#0377fc] text-white text-lg font-black hover:bg-[#0266d6] transition-all transform hover:scale-105 shadow-2xl shadow-primary/30 active:scale-95">
                Start interviewing
              </button>
            </Link>
            <button className="px-10 py-5 rounded-2xl bg-white border-2 border-slate-200 text-lg font-black text-slate-800 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:border-slate-300 active:scale-95">
              <Play size={20} fill="currentColor" />
              View demo
            </button>
          </div>

          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 shadow-sm group/badge hover:bg-white/80 transition-all cursor-default text-[#10b981]">
              <CheckCircle size={18} className="text-[#10b981]" />
              <span className="text-sm font-bold text-slate-600 group-hover/badge:text-[#0377fc] transition-colors">Your first 5 interviews are on us</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/50 shadow-sm group/badge hover:bg-white/80 transition-all cursor-default text-[#10b981]">
              <CheckCircle size={18} className="text-[#10b981]" />
              <span className="text-sm font-bold text-slate-600 group-hover/badge:text-[#0377fc] transition-colors">No credit card required</span>
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="relative lg:justify-self-end w-full max-w-2xl mx-auto lg:mx-0">
          <div className="absolute -inset-10 bg-gradient-to-tr from-[#0377fc]/20 to-sky-400/20 blur-[60px] rounded-full animate-pulse" />
          
          <div className="relative group perspective-1000">
            <div className="relative overflow-hidden rounded-[32px] shadow-[0_32px_64px_-16px_rgba(3,119,252,0.2)] transition-all duration-700 group-hover:shadow-[0_48px_80px_-16px_rgba(3,119,252,0.3)] group-hover:-translate-y-2">
              <Image 
                src="/airecruite-hero.png" 
                alt="AI Interview Illustration" 
                width={800}
                height={600}
                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0377fc]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Floaters (Small accent check in the corner) */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#0377fc] rounded-xl shadow-2xl flex items-center justify-center text-white transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
