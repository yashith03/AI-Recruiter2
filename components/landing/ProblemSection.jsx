
import React from 'react'

const ProblemSection = () => {
  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-label mb-2 block font-bold uppercase tracking-wider">The Challenge</span>
          <h2 className="text-h1 text-[#0d141c] mb-6">Why Traditional Hiring is Broken</h2>
          <p className="text-body-lg text-slate-600">Recruiting teams are overwhelmed. Manual processes are slowing down your ability to secure top talent.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-xl group">
            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Time-Consuming Scheduling</h3>
            <p className="text-body text-slate-600">Endless email ping-pong just to find a 30-minute slot. Valuable days are lost before the first conversation even happens.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-xl group">
            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">balance</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Inconsistent Evaluation</h3>
            <p className="text-body text-slate-600">Human bias, fatigue, and varying moods affect candidate scores, leading to unfair and unpredictable hiring outcomes.</p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all hover:shadow-xl group">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-2 uppercase">Manual Screening Fatigue</h3>
            <p className="text-body text-slate-600">Recruiters burnout from repetitive initial screening calls, asking the same questions over and over again.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
