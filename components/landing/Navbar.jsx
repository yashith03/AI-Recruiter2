import React from "react"
import Link from "next/link"
import Image from "next/image"
import { NAV_LINKS } from "@/lib/landing-data"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="AI Recruiter Logo" width={150} height={40} className="object-contain h-10 w-auto" />
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/auth">
            <button className="hidden sm:block px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all active:scale-95 text-slate-700">
              Log in
            </button>
          </Link>
          <Link href="/auth">
            <button className="px-5 py-2 rounded-xl bg-[#0377fc] text-white text-sm font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
