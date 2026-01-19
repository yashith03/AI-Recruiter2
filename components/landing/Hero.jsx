
import React from 'react'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 text-center lg:text-left animate-in slide-in-from-left duration-700">
          <h1 className="text-h1 text-[#0d141c]">
            Hire Faster with <span className="text-primary">AI-Powered</span> Interviews
          </h1>
          <p className="text-body-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
            Streamline your recruitment process with intelligent AI voice conversations. Create, schedule, and analyze interviews 10x faster than traditional methods.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link href="/dashboard">
              <button className="h-12 px-8 rounded-lg bg-primary text-white text-body font-bold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Hiring Now
              </button>
            </Link>
            <button className="h-12 px-8 rounded-lg bg-white border border-[#cedbe8] text-[#0d141c] text-body font-bold hover:bg-slate-50 transition-colors">
              View Demo
            </button>
          </div>
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-helper text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '18px' }}>check_circle</span>
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-green-500" style={{ fontSize: '18px' }}>check_circle</span>
              14-day free trial
            </div>
          </div>
        </div>
        {/* Visual Element Placeholder */}
        <div className="relative animate-in zoom-in duration-700 delay-200">
          <div className="aspect-square rounded-3xl bg-primary/5 border border-primary/10 p-8 flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100" />
                  <div>
                    <div className="w-24 h-2 bg-slate-100 rounded mb-2" />
                    <div className="w-16 h-1.5 bg-slate-50 rounded" />
                  </div>
                </div>
                <div className="h-6 w-10 bg-green-100 text-green-700 rounded-md flex items-center justify-center text-label">98%</div>
              </div>
              <div className="flex-1 rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col gap-3">
                <div className="w-full h-2 bg-white rounded shadow-sm" />
                <div className="w-4/5 h-2 bg-white rounded shadow-sm" />
                <div className="w-2/3 h-2 bg-white rounded shadow-sm" />
              </div>
              <div className="flex items-center justify-between">
                <div className="w-32 h-8 rounded-lg bg-primary/10 border border-primary/20" />
                <div className="h-6 w-12 bg-blue-100 text-blue-700 rounded-md flex items-center justify-center text-label">4.2s</div>
              </div>
            </div>
          </div>
          {/* Floating Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  )
}

export default Hero
