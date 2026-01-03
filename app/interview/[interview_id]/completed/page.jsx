//app/(main)/interview/[interview_id]/completed/page.jsx

"use client"

import React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  Check, 
  Bot, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2, 
  Download,
  Sparkles,
} from "lucide-react"

export default function InterviewComplete() {
  const { interview_id } = useParams()

  // Mock data for display - in a real app these typically come from DB or context
  const currentDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })
  
  return (
         <div className="min-h-screen bg-slate-50 flex flex-col font-display">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Sparkles size={20} fill="currentColor" className="text-primary" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">AI Recruiter</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        Support
                    </Link>
                    <Link href="/auth">
                        <Button className="bg-primary hover:bg-blue-700 text-white font-semibold rounded-lg px-6 h-10 shadow-lg shadow-primary/20">
                            Login
                        </Button>
                    </Link>
                </div>
            </header>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
          
          <div className="p-8 sm:p-10 flex flex-col items-center text-center">
            
            {/* Success Icon */}
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-green-50/50">
              <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Completed</h2>
            <p className="text-gray-500 font-medium mb-6">Thank you for completing your interview</p>
            
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto mb-8">
              Your interview has been successfully recorded. Our system is now generating feedback for the recruiter.
            </p>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-2 w-full bg-gray-50 rounded-xl p-4 mb-8 border border-gray-100">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Session ID</span>
                <span className="text-xs font-bold text-gray-900 truncate max-w-full px-2">
                  #{interview_id?.slice(0, 5) || "Unknown"}
                </span>
              </div>
              <div className="flex flex-col items-center border-l border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</span>
                <span className="text-xs font-bold text-gray-900">15m 30s</span>
              </div>
              <div className="flex flex-col items-center border-l border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date</span>
                <span className="text-xs font-bold text-gray-900">{currentDate}</span>
              </div>
            </div>

            {/* Status Steps */}
            <div className="w-full space-y-3 mb-8">
              {/* Step 1: Saved */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Recording saved</span>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              
              {/* Step 2: Analyzing */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-blue-100 bg-blue-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Analyzing feedback</span>
                </div>
                <div className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                  In Progress
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
             
              
              <button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-colors cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Interview Summary
              </button>
            </div>

            <p className="mt-8 text-xs text-gray-400 text-center">
              You may safely close this tab. No further action is required.
            </p>

          </div>
        </div>
      </main>
    </div>
  )
}
