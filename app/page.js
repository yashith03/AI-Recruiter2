// app/page.js

import React from 'react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="font-body bg-background-light text-[#0d141c] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#cedbe8] z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-[#0d141c]">
              <div className="text-primary">
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>graphic_eq</span>
              </div>
              <h2 className="text-h3">AI Recruiter</h2>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a className="text-body font-bold hover:text-primary transition-colors" href="#features">Features</a>
              <a className="text-body font-bold hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
              <a className="text-body font-bold hover:text-primary transition-colors" href="#use-cases">Use Cases</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <button className="hidden sm:flex h-9 items-center justify-center rounded-lg px-4 bg-transparent text-body font-bold text-[#0d141c] hover:bg-slate-100 transition-colors">
                Log in
              </button>
            </Link>
            <Link href="/auth">
              <button className="h-9 flex items-center justify-center rounded-lg px-4 bg-primary text-white text-body font-bold hover:bg-primary-dark transition-colors shadow-sm">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Problem Section */}
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

      {/* Feature Split Section */}
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

      {/* Global Features Grid */}
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

      {/* How It Works */}
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

      {/* Trust Section */}
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

      {/* Use Cases */}
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

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[#101922] rounded-3xl p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 150%, #0d7ff2 0%, transparent 50%), radial-gradient(circle at 80% -50%, #0d7ff2 0%, transparent 50%)' }}></div>
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-h1 text-white leading-tight">Ready to Transform Your Hiring?</h2>
            <p className="text-body-lg text-slate-300 max-w-xl">Join forward-thinking companies saving 100+ hours per month on recruitment.</p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
              <Link href="/dashboard">
                <button className="h-14 px-10 rounded-xl bg-primary text-white text-body font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 w-full sm:w-auto active:scale-95">
                  Get Started Free
                </button>
              </Link>
              <button className="h-14 px-10 rounded-xl bg-transparent border border-slate-600 text-white text-body font-bold hover:bg-white/10 transition-colors w-full sm:w-auto">
                View Live Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#cedbe8] pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2 text-[#0d141c]">
                <div className="text-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>graphic_eq</span>
                </div>
                <h2 className="text-h3">AI Recruiter</h2>
              </div>
              <p className="text-body text-slate-500">The intelligent voice interviewing platform for modern recruitment teams.</p>
            </div>
            <div>
              <h4 className="text-body font-bold text-[#0d141c] mb-6 uppercase tracking-wider">Product</h4>
              <ul className="space-y-4 text-body text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-body font-bold text-[#0d141c] mb-6 uppercase tracking-wider">Company</h4>
              <ul className="space-y-4 text-body text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-body font-bold text-[#0d141c] mb-6 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-4 text-body text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-label text-slate-400">© 2024 AI Recruiter Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-slate-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
