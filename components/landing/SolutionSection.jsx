
import React from 'react'

const SolutionSection = () => {
  return (
    <section className="py-20 bg-background-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-8xl opacity-80">psychology</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 text-label">
                  AI Processing...
                </div>
                <div className="absolute bottom-10 -left-4 bg-white/10 backdrop-blur-md p-3 rounded-lg border border-white/20 text-label flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   Real-time Sentiment Analysis
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 order-1 lg:order-2">
            <div>
              <span className="text-primary text-label uppercase block mb-2 font-bold tracking-wider">The Solution</span>
              <h2 className="text-h1 text-[#0d141c] mb-4">Meet Your New AI Recruiting Assistant</h2>
              <p className="text-body-lg text-slate-600">Our AI identifies top talent with high precision, giving your team more time for strategy and less on administrative tasks.</p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <h4 className="text-body font-bold text-[#0d141c] uppercase tracking-wide">24/7 Availability</h4>
                  <p className="text-body text-slate-600">Candidates can interview whenever it suits them, increasing conversion rates.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <h4 className="text-body font-bold text-[#0d141c] uppercase tracking-wide">Unbiased Scoring</h4>
                  <p className="text-body text-slate-600">Every candidate gets the same standard of evaluation, regardless of time or day.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <div>
                  <h4 className="text-body font-bold text-[#0d141c] uppercase tracking-wide">Infinite Scalability</h4>
                  <p className="text-body text-slate-600">Screen 10 or 10,000 candidates simultaneously without extra effort.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SolutionSection
