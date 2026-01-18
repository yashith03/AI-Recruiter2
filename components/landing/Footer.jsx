import React from "react"
import { Mic } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2 font-black text-xl text-slate-900">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <Mic size={24} />
          </div>
          AI Recruiter
        </div>

        <div className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>

        <p className="text-sm text-slate-400 font-medium">
          © {currentYear} AI Recruiter. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
