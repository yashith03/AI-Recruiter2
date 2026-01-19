
import React from 'react'

const Footer = () => {
  return (
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
  )
}

export default Footer
