import React from "react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white py-24 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff11_1px,transparent_1px),linear-gradient(to_bottom,#ffffff11_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2 space-y-8">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="AI Recruiter Logo" width={180} height={50} className="brightness-110 h-12 w-auto object-contain" />
            </Link>
            <p className="text-slate-400 text-lg max-w-sm font-medium leading-relaxed">
              Automate first-round interviews with natural AI voice conversations. Save time, remove bias, and hire better talent.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-[#0377fc]">Product</h4>
            <ul className="space-y-4 text-slate-300 font-semibold">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#use" className="hover:text-white transition-colors">Use cases</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black text-sm uppercase tracking-widest text-[#0377fc]">Company</h4>
            <ul className="space-y-4 text-slate-300 font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-bold text-sm">
          <p>© {currentYear} AI Recruiter. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
