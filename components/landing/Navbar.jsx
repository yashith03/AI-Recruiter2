import React from "react"
import Link from "next/link"
import { Mic } from "lucide-react"
import { NAV_LINKS } from "@/lib/landing-data"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Mic className="text-primary" />
          AI Recruiter
        </div>

        <div className="hidden md:flex gap-8 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/auth">
            <button className="hidden sm:block px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
              Log in
            </button>
          </Link>
          <Link href="/auth">
            <button className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
