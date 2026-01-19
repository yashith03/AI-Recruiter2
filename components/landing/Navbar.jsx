
import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
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
  )
}

export default Navbar
