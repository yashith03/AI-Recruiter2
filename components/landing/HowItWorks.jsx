
import React from 'react'

const HowItWorks = () => {
  return (
    <section className="bg-background-light py-20" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h1 text-[#0d141c] mb-4">How It Works</h2>
          <p className="text-body-lg text-slate-600">Start screening candidates in minutes, not days.</p>
        </div>
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 text-primary font-bold text-xl flex items-center justify-center mb-4 shadow-sm group-hover:border-primary transition-colors">1</div>
              <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Create</h3>
              <p className="text-body text-slate-600">Define your questions and ideal answer criteria.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 text-primary font-bold text-xl flex items-center justify-center mb-4 shadow-sm group-hover:border-primary transition-colors">2</div>
              <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Share</h3>
              <p className="text-body text-slate-600">Send the magic link to your candidate list.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 text-primary font-bold text-xl flex items-center justify-center mb-4 shadow-sm group-hover:border-primary transition-colors">3</div>
              <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Interview</h3>
              <p className="text-body text-slate-600">Candidates talk to our AI voice agent naturally.</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-100 text-primary font-bold text-xl flex items-center justify-center mb-4 shadow-sm group-hover:border-primary transition-colors">4</div>
              <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Review</h3>
              <p className="text-body text-slate-600">See ranked scores and listen to key highlights.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
