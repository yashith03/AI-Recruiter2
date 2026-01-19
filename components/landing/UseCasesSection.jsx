
import React from 'react'

const UseCasesSection = () => {
  return (
    <section className="bg-background-light py-20" id="use-cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-h1 text-[#0d141c] text-center mb-16">Who is AI Recruiter For?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#cedbe8] hover:shadow-md transition-shadow">
            <h3 className="text-h3 mb-3">Startups</h3>
            <p className="text-body text-slate-600">Hire your founding team without dedicating 50% of your time to screening calls.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#cedbe8] hover:shadow-md transition-shadow">
            <h3 className="text-h3 mb-3">Remote Teams</h3>
            <p className="text-body text-slate-600">Interview candidates across any timezone without waking up at 3 AM.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#cedbe8] hover:shadow-md transition-shadow">
            <h3 className="text-h3 mb-3">High-Volume</h3>
            <p className="text-body text-slate-600">Perfect for retail, support, and sales roles with hundreds of applicants.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#cedbe8] hover:shadow-md transition-shadow">
            <h3 className="text-h3 mb-3">Technical Roles</h3>
            <p className="text-body text-slate-600">Conduct initial technical screens to verify knowledge before senior engineers step in.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UseCasesSection
