//app/interview/[interview_id]/start/page.jsx

"use client"
import React, { useContext, useEffect, useState, useRef } from "react"
import { InterviewDataContext } from "@/context/interviewDataContext"
import {
  Loader2Icon,
  Timer,
  Mic,
  Video,
  Settings,
  Wifi,
  CheckCircle2,
  Play,
  Bot as BotIcon,
  User as UserIcon,
} from "lucide-react"
import Vapi from "@vapi-ai/web"
import axios from "axios"
import AlertConfirmation from "./_components/AlertConfirmation"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/services/supabaseClient"
import TimerComponent from "./_components/TimerComponent"

function StartInterview() {
  const redirectToCompleted = () => {
   router.replace(`/interview/${interview_id}/completed`)
  }

  const { interviewInfo } = useContext(InterviewDataContext)

  const vapiRef = useRef(null)
  const callStartedRef = useRef(false)
  const timerStartedRef = useRef(false)
  const hasEndedRef = useRef(false)

  const [conversation, setConversation] = useState([])
  const [callStarted, setCallStarted] = useState(false)
  const [timerStart, setTimerStart] = useState(false)
  const [timerStop, setTimerStop] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeUser, setActiveUser] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(false)

  const { interview_id } = useParams()
  const router = useRouter()

  // ----------------------------------------------------
  // INIT VAPI & EVENT LISTENERS
  // ----------------------------------------------------
 useEffect(() => {
     if (!vapiRef.current) {
       vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY)
     }

    const vapi = vapiRef.current
    if (!vapi) return

    const handleMessage = (msg) => {
      if (msg?.conversation) {
        setConversation(msg.conversation)
      }
    }

    const handleSpeechStart = () => {
      if (!timerStartedRef.current) {
        timerStartedRef.current = true
        setTimerStart(true)
        setAnimationEnabled(true)
        toast("Interview Started")
      }
      setActiveUser(false)
    }

    const handleSpeechEnd = () => setActiveUser(true)

    const handleError = (err) => {
      console.error("Vapi Error:", err)
      toast.error("Call error occurred")
    }


    const handleCallEnd = async () => {
      if (hasEndedRef.current) return
      hasEndedRef.current = true

      console.log("Vapi Call Ended - starting processing...");
      toast("Interview Ended")
      setTimerStop(true)
      setCallStarted(false)
      setLoading(true)
      callStartedRef.current = false

      const isEmptyConversation =
        !conversation ||
        (Array.isArray(conversation) && conversation.length === 0) ||
        (typeof conversation === "string" && conversation.trim() === "")

    if (isEmptyConversation) {
      console.warn("Conversation is empty - skipping feedback");
      redirectToCompleted()
      return
    }

    await GenerateFeedback()
}

    vapi.on("message", handleMessage)
    vapi.on("speech-start", handleSpeechStart)
    vapi.on("speech-end", handleSpeechEnd)
    vapi.on("error", handleError)
    vapi.on("call-ended", handleCallEnd)

    return () => {
      vapi.off("message", handleMessage)
      vapi.off("speech-start", handleSpeechStart)
      vapi.off("speech-end", handleSpeechEnd)
      vapi.off("error", handleError)
      vapi.off("call-ended", handleCallEnd)
    }
  }, [])

  // ----------------------------------------------------
  // FEEDBACK GENERATOR
  // ----------------------------------------------------
  const GenerateFeedback = async () => {
    try {
      // 🚀 New unified processing: generating candidate summary + PDF + recruiter feedback
      const result = await axios.post("/api/interviews/process-result", { 
        interview_id,
        conversation,
        userName: interviewInfo?.userName || "Unknown",
        userEmail: interviewInfo?.userEmail || "unknown@example.com"
      })
      
      console.log("Process Result Success:", result.data);
      redirectToCompleted()
    } catch (err) {
      console.error("Processing error:", err)
      redirectToCompleted()
    }
  }

  // ----------------------------------------------------
  // START CALL
  // ----------------------------------------------------
  const startCall = async () => {
    if (callStartedRef.current) return

    callStartedRef.current = true
    setCallStarted(true)

    const vapi = vapiRef.current
    if (!vapi) return

    const questions =
      interviewInfo?.interviewData?.questionList
        ?.map((q, i) => `${i + 1}. ${q.question}`)
        .join("\n") || ""

    await vapi.start({
      name: "AI Recruiter",
      firstMessage: `Hi ${interviewInfo?.userName || "there"}, ready to begin?`,
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Ask one question at a time:\n${questions}`,
          },
        ],
      },
    })
  }

  // ----------------------------------------------------
  // STOP INTERVIEW
  // ----------------------------------------------------
const stopInterview = async () => {
  if (loading) return // prevent double click

  setLoading(true)
  setTimerStop(true)

  // 🔑 Safety fallback: never hang forever
  const forceExitTimeout = setTimeout(async () => {
    if (hasEndedRef.current) return;
    console.warn("Force exit: Vapi hung, triggering feedback manually");
    
    if (conversation && conversation.length > 0) {
        await GenerateFeedback();
    } else {
        router.replace(`/interview/${interview_id}/completed`);
    }
  }, 7000)

  try {
    if (vapiRef.current) {
      await vapiRef.current.stop()
      // call-ended SHOULD fire and clear this timeout
    }
  } catch (err) {
    console.error("Stop interview error:", err)
    clearTimeout(forceExitTimeout)
    if (!hasEndedRef.current) redirectToCompleted()
  }
}



  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans text-gray-900">
      
      {/* ------------------ HEADER ------------------ */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-1.5 shadow-sm">
               <BotIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-gray-900">AI Recruiter</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 text-xs font-semibold uppercase tracking-wide">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              System Online
            </div>
            
            <div className="flex items-center gap-4 text-gray-400">
               <button className="hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
               </button>
               <div className="w-px h-6 bg-gray-200" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-blue-100 border border-gray-200 p-0.5 overflow-hidden">
                   <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-blue-600">
                      {interviewInfo?.userName?.[0]?.toUpperCase() || "U"}
                   </div>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------ MAIN CONTENT ------------------ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* SUBHEADER: Title & Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              <span className="text-blue-600/80">Interview</span>
              <span className="text-gray-300">•</span>
              <span>Session #{interview_id?.slice(0, 4) || "0000"}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">AI Interview Session</h2>
          </div>

          <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
               <Timer className="w-5 h-5" />
            </div>
            <div>
               <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Time Remaining</div>
               <div className="text-xl font-mono font-bold text-gray-900 leading-none">
                 <TimerComponent start={timerStart} stop={timerStop} />
               </div>
            </div>
          </div>
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 min-h-[400px]">
          
          {/* 1. AI RECRUITER CARD */}
          <div className="relative group bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 rounded-2xl border border-white/60 shadow-sm overflow-hidden flex flex-col items-center justify-center h-[350px] md:h-auto">
             {/* Status Badge */}
             <div className="absolute top-5 left-5 z-10">
                <div className="flex items-center gap-2 bg-gray-900/5 backdrop-blur-md text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online
                </div>
             </div>

             {/* Center Visuals - Audio Wave */}
             <div className="relative z-0 flex items-center justify-center w-full h-full">
                {animationEnabled && !activeUser && (
                   <div className="absolute w-48 h-48 bg-blue-500/5 rounded-full animate-ping" />
                )}
                
                {/* Simulated Waveform */}
                 <div className="flex gap-1.5 items-end h-16">
                     <div className={`w-3 bg-blue-500 rounded-full transition-all duration-300 ${animationEnabled && !activeUser ? "h-12 animate-[bounce_1s_infinite]" : "h-4"}`} style={{ animationDelay: '0s' }} />
                     <div className={`w-3 bg-blue-500 rounded-full transition-all duration-300 ${animationEnabled && !activeUser ? "h-16 animate-[bounce_1.2s_infinite]" : "h-6 opacity-60"}`} style={{ animationDelay: '0.1s' }} />
                     <div className={`w-3 bg-blue-500 rounded-full transition-all duration-300 ${animationEnabled && !activeUser ? "h-10 animate-[bounce_0.8s_infinite]" : "h-4"}`} style={{ animationDelay: '0.2s' }} />
                     <div className={`w-3 bg-blue-500 rounded-full transition-all duration-300 ${animationEnabled && !activeUser ? "h-14 animate-[bounce_1.1s_infinite]" : "h-5 opacity-80"}`} style={{ animationDelay: '0.3s' }} />
                     <div className={`w-3 bg-blue-500 rounded-full transition-all duration-300 ${animationEnabled && !activeUser ? "h-8 animate-[bounce_0.9s_infinite]" : "h-3"}`} style={{ animationDelay: '0.4s' }} />
                 </div>
             </div>

             {/* Footer Overlay */}
             <div className="absolute bottom-0 left-0 right-0 p-5 pt-20 bg-gradient-to-t from-white via-white/80 to-transparent">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3.5">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-gray-100">
                               <BotIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 text-sm">AI Recruiter</div>
                            <div className="text-gray-500 text-xs font-medium">Automated Interviewer</div>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <Mic className="w-4 h-4" />
                    </div>
                </div>
             </div>
          </div>

          {/* 2. USER CARD */}
          <div className="relative group bg-[#111827] rounded-2xl overflow-hidden shadow-lg border border-gray-800 h-[350px] md:h-auto">
             {/* Simulating a camera feed */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60 z-10" />

             {/* Placeholder for Video Feed */}
             <div className="absolute inset-0 flex items-center justify-center z-0">
                 {/* Instead of Image, we use a placeholder or the actual image from the user provided code if any. The user provided code used a simple flex layout. */}
                 {/* Using a subtle background image or pattern to simulate video off/loading or just a dark background */}
                 <div className="w-full h-full bg-[#1F2937] flex items-center justify-center">
                    <UserIcon className="w-20 h-20 text-gray-700" />
                 </div>
                 
                 {/* Active Speaker Ring */}
                 {activeUser && (
                     <div className="absolute inset-0 border-4 border-blue-500/50 animate-pulse" />
                 )}
             </div>

             {/* Status Badge */}
             <div className="absolute top-5 left-5 z-20">
                <div className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-900/20">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                    Ready
                </div>
             </div>
             
             {/* Wifi Signal */}
             <div className="absolute top-5 right-5 z-20 text-white/50">
                 <Wifi className="w-5 h-5" />
             </div>

             {/* Footer Overlay */}
             <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-500 flex items-center justify-center shadow-lg border-2 border-white/10">
                           <UserIcon className="w-5 h-5 text-white/90" />
                        </div>
                        <div className="text-white">
                            <div className="font-bold text-sm text-shadow-sm">{interviewInfo?.userName || "Candidate"}</div>
                            <div className="text-gray-300 text-xs font-medium">Candidate</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                            <Mic className="w-4 h-4" />
                        </div>
                         <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                            <Video className="w-4 h-4" />
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>

        {/* CONTROLS / ACTION AREA */}
        <div className="flex flex-col items-center justify-center mt-auto pb-6 gap-6">
           <div className="text-center space-y-2">
               <h3 className="text-xl font-bold text-gray-900">
                  {callStarted ? "Interview in Progress..." : "Everything looks good!"}
               </h3>
               <p className="text-gray-500 text-sm">
                  {callStarted 
                    ? "Speak clearly and take your time to answer." 
                    : "Click Start to begin your interview. The session will be recorded for review."
                  }
               </p>
           </div>
           
           <div className="flex items-center gap-4">
              {/* START BUTTON */}
               {!callStarted && (
                 <button 
                    onClick={startCall}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-blue-600/20 active:scale-95 transition-all text-base"
                 >
                    Start Interview
                    <Play className="w-5 h-5 fill-current ml-1" />
                 </button>
               )}

               {/* STOP BUTTON */}
               {callStarted && (
                   <AlertConfirmation stopInterview={stopInterview}>
      <button
        data-slot="alert-dialog-trigger"
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-red-500/20 active:scale-95 transition-all text-base"
      >
        {loading ? <Loader2Icon className="animate-spin w-5 h-5" /> : "End Interview"}
      </button>
                   </AlertConfirmation>
               )}
               
               {/* Divider */}
               <div className="h-10 w-px bg-gray-200 mx-4 hidden sm:block"></div>

               {/* Secondary Settings */}
               <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                   <button className="p-3 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
                      <Mic className="w-5 h-5" />
                   </button>
                    <button className="p-3 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
                      <Video className="w-5 h-5" />
                   </button>
                    <button className="p-3 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors">
                      <Settings className="w-5 h-5" />
                   </button>
               </div>
           </div>
        </div>

      </main>
    </div>
  )
}

export default StartInterview
