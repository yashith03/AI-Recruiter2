
import React from 'react'

const TrustSection = () => {
  return (
    <section className="bg-white py-16 border-y border-[#cedbe8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-label text-slate-400 font-bold uppercase tracking-widest mb-10">Built with modern reliable technology</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 text-h3 text-slate-800">
            <span className="material-symbols-outlined">code</span> Next.js
          </div>
          <div className="flex items-center gap-2 text-h3 text-slate-800">
            <span className="material-symbols-outlined">database</span> Supabase
          </div>
          <div className="flex items-center gap-2 text-h3 text-slate-800">
            <span className="material-symbols-outlined">record_voice_over</span> Vapi AI
          </div>
          <div className="flex items-center gap-2 text-h3 text-slate-800">
            <span className="material-symbols-outlined">security</span> Secured
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection
