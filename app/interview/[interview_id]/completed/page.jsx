//app/(main)/interview/[interview_id]/completed/page.jsx


"use client"

import React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
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
import moment from "moment"
import { InterviewDataContext } from "@/context/interviewDataContext"
import { supabase } from "@/services/supabaseClient"
import axios from "axios"
import { toast } from "sonner"

export default function InterviewComplete() {
  const { interview_id } = useParams()
  const { interviewInfo } = React.useContext(InterviewDataContext)
  const [loading, setLoading] = React.useState(true)
  const [feedbackData, setFeedbackData] = React.useState(null)
  const [pdfReady, setPdfReady] = React.useState(false)
  const [processingStatus, setProcessingStatus] = React.useState("")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const processingStartedRef = React.useRef(false)

  const uploadRecording = React.useCallback(async (blob) => {
    if (!blob || blob.size === 0) return null
    try {
      const timestamp = Date.now()
      const filePath = `interviews/${interview_id}/${interview_id}_${timestamp}.webm`
      const { error } = await supabase.storage
        .from('interview-recordings')
        .upload(filePath, blob, { contentType: 'video/webm' })
      if (error) throw error
      return filePath
    } catch (err) {
      console.error("Upload failed:", err)
      return null
    }
  }, [interview_id])

  const GenerateFeedback = React.useCallback(async (recordingPath) => {
    try {
      await axios.post("/api/interviews/process-result", { 
        interview_id,
        conversation: interviewInfo.conversation,
        userName: interviewInfo.userName,
        userEmail: interviewInfo.userEmail,
        recording_path: recordingPath
      })
    } catch (err) {
      console.error("Feedback generation error:", err)
      throw err
    }
  }, [interview_id, interviewInfo])

  const startBackgroundProcessing = React.useCallback(async () => {
    setIsProcessing(true)
    setProcessingStatus("Preparing data...")
    
    try {
      let recordingPath = null
      
      // Step A: Upload Recording if blob exists
      if (interviewInfo.videoBlob) {
        setProcessingStatus("Uploading interview video...")
        recordingPath = await uploadRecording(interviewInfo.videoBlob)
      }

      // Step B: Generate Feedback
      setProcessingStatus("Analysing results & generating PDF...")
      await GenerateFeedback(recordingPath)
      
      setProcessingStatus("Complete!")
    } catch (error) {
      console.error("Background processing error:", error)
      toast.error("An error occurred during final processing. We're still working on it.")
    } finally {
      setIsProcessing(false)
    }
  }, [interview_id, interviewInfo, uploadRecording, GenerateFeedback])

  // 1. Initial Processing (Upload & AI Analysis) if data is available in context
  React.useEffect(() => {
    if (!interview_id || !interviewInfo || processingStartedRef.current) return
    
    // Only process if we have a conversation and haven't started yet
    if (interviewInfo.conversation && interviewInfo.conversation.length > 0) {
      processingStartedRef.current = true
      startBackgroundProcessing()
    }
  }, [interview_id, interviewInfo, startBackgroundProcessing])

  // 2. Polling and state updates
  React.useEffect(() => {
    if (!interview_id) return

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/interviews/${interview_id}/feedback`);
        if (!response.ok) return false;

        const data = await response.json();

        if (data) {
          setFeedbackData(data)
          if (data.pdf_url) {
            setPdfReady(true)
            setLoading(false)
            return true // stop polling
          }
        }
        return false
      } catch (err) {
        console.error("CheckStatus Error:", err);
        return false;
      }
    }

    checkStatus()
    
    const interval = setInterval(async () => {
      const isDone = await checkStatus()
      if (isDone) clearInterval(interval)
    }, 3000)

    return () => clearInterval(interval)
  }, [interview_id])

  const handleDownload = () => {
    if (pdfReady) {
      window.location.href = `/api/interviews/${interview_id}/download-summary`
    }
  }

  const currentDate = feedbackData?.interview_date 
    ? moment(feedbackData.interview_date).format("MMM DD")
    : moment().format("MMM DD")
  
  const duration = feedbackData?.duration || "15m 30s"

  return (
         <div className="min-h-screen bg-slate-50 flex flex-col font-display">
            {/* Header */}
            <header className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={140} height={50} className="h-10 w-auto object-contain" />
                </div>
                <div className="flex items-center gap-6">
                    <Link href="/candidate-support" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        Support
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
              Your interview has been successfully recorded. {pdfReady ? "Your summary is ready for download." : "Our system is now generating feedback for the recruiter."}
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
                <span className="text-xs font-bold text-gray-900">{duration}</span>
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
              <div className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${pdfReady ? 'border-green-100 bg-green-50/30' : 'border-blue-100 bg-blue-50/30'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${pdfReady ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {pdfReady ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-700">
                      {pdfReady ? 'Summary ready' : 'Analyzing feedback'}
                    </span>
                    {isProcessing && (
                      <span className="text-[10px] text-blue-500 font-bold animate-pulse">
                        {processingStatus}
                      </span>
                    )}
                  </div>
                </div>
                {pdfReady ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <div className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                    {isProcessing ? 'Processing' : 'Waiting'}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
              <button 
                onClick={handleDownload}
                disabled={!pdfReady}
                className={`w-full font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                  pdfReady 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
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
