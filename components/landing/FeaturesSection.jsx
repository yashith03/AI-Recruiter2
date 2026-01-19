
import React from 'react'

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-h1 text-[#0d141c] mb-4">Everything You Need to Hire Smarter</h2>
          <p className="text-body-lg text-slate-600">A complete toolset designed for the modern recruiting team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">record_voice_over</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">AI Voice Interviews</h3>
            <p className="text-body text-slate-600">Natural, conversational AI that adapts to candidate answers in real-time.</p>
          </div>
          {/* Feature 2 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">tune</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">Custom Interview Creation</h3>
            <p className="text-body text-slate-600">Define questions, time limits, and evaluation criteria for any role.</p>
          </div>
          {/* Feature 3 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">link</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">Shareable Links</h3>
            <p className="text-body text-slate-600">Generate unique links to send to candidates via email or ATS integration.</p>
          </div>
          {/* Feature 4 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">Real-Time Management</h3>
            <p className="text-body text-slate-600">Keep interviews on track with built-in time management controls and alerts.</p>
          </div>
          {/* Feature 5 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">Deep Analytics</h3>
            <p className="text-body text-slate-600">Get detailed feedback summaries and scores for soft skills and technical knowledge.</p>
          </div>
          {/* Feature 6 */}
          <div className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h3 className="text-h3 text-[#0d141c] mb-3">Enterprise Security</h3>
            <p className="text-body text-slate-600">Built on Supabase with robust authentication and top-tier data encryption standards.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
