//app/interview/[interview_id]/start/page.jsx

"use client"
import React, { useContext, useEffect, useState, useRef } from "react"
import { InterviewDataContext } from "@/context/interviewDataContext"
import {
  Loader2Icon,
  Timer,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Settings,
  Wifi,
  WifiOff,
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
  const { interview_id } = useParams()
  const router = useRouter()

  const redirectToCompleted = () => {
   router.replace(`/interview/${interview_id}/completed`)
  }

  const { interviewInfo } = useContext(InterviewDataContext)

  const vapiRef = useRef(null)
  const callStartedRef = useRef(false)
  const timerStartedRef = useRef(false)
  const hasEndedRef = useRef(false)
  const conversationRef = useRef([])
  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)

  const [conversation, setConversation] = useState([])
  const [callStarted, setCallStarted] = useState(false)
  const [timerStart, setTimerStart] = useState(false)
  const [timerStop, setTimerStop] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeUser, setActiveUser] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(false)
  const [micOn, setMicOn] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [stream, setStream] = useState(null)
  const [mediaError, setMediaError] = useState("")
  const [networkQuality, setNetworkQuality] = useState("good") // "good", "unstable", "poor"
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([]) // Keep for any UI if needed, but logic uses Ref
  const recordedChunksRef = useRef([])


  // ----------------------------------------------------
  // CHECK MEDIA PERMISSIONS ON MOUNT
  // ----------------------------------------------------
  useEffect(() => {
    const checkMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 24 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        })
        setStream(mediaStream)
        setMicOn(true)
        setCameraOn(true)
        setMediaError("")
      } catch (err) {
        console.error("Media permission error:", err)
        setMediaError("Camera and microphone access is required to proceed.")
        setMicOn(false)
        setCameraOn(false)
      }
    }

    checkMedia()

    return () => {
      // Cleanup: stop all tracks when leaving page
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // ----------------------------------------------------
  // ATTACH STREAM TO VIDEO ELEMENT
  // ----------------------------------------------------
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  // ----------------------------------------------------
  // MONITOR NETWORK QUALITY
  // ----------------------------------------------------
  useEffect(() => {
    const checkNetworkQuality = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        const effectiveType = connection?.effectiveType
        
        // Map connection types to quality levels
        if (effectiveType === '4g' || effectiveType === 'wifi') {
          setNetworkQuality('good')
        } else if (effectiveType === '3g') {
          setNetworkQuality('unstable')
        } else {
          setNetworkQuality('poor')
        }
      } else {
        // Fallback: use online/offline status
        setNetworkQuality(navigator.onLine ? 'good' : 'poor')
      }
    }

    checkNetworkQuality()
    
    // Re-check every 5 seconds
    const interval = setInterval(checkNetworkQuality, 5000)

    // Listen for online/offline events
    window.addEventListener('online', checkNetworkQuality)
    window.addEventListener('offline', checkNetworkQuality)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', checkNetworkQuality)
      window.removeEventListener('offline', checkNetworkQuality)
    }
  }, [])

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
        conversationRef.current = msg.conversation
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

      const currentConvo = conversationRef.current

      const isEmptyConversation =
        !currentConvo ||
        (Array.isArray(currentConvo) && currentConvo.length === 0) ||
        (typeof currentConvo === "string" && currentConvo.trim() === "")

    if (isEmptyConversation) {
      console.warn("Conversation is empty - skipping feedback");
      redirectToCompleted()
      return
    }

    // Stop recording and upload
    const recordingBlob = await stopRecording()
    let recordingPath = null
    
    if (recordingBlob) {
      recordingPath = await uploadRecording(recordingBlob)
    }

    await GenerateFeedback(recordingPath)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------------------------------------------
  // FEEDBACK GENERATOR
  // ----------------------------------------------------
  const GenerateFeedback = async (recordingPath = null) => {
    try {
      // 🚀 New unified processing: generating candidate summary + PDF + recruiter feedback
      const result = await axios.post("/api/interviews/process-result", { 
        interview_id,
        conversation: conversationRef.current,
        userName: interviewInfo?.userName || "Unknown",
        userEmail: interviewInfo?.userEmail || "unknown@example.com",
        recording_path: recordingPath
      })
      
      console.log("Process Result Success:", result.data);
      redirectToCompleted()
    } catch (err) {
      console.error("Processing error:", err)
      redirectToCompleted()
    }
  }

  // ----------------------------------------------------
  // RECORDING FUNCTIONS
  // ----------------------------------------------------
  const startRecording = () => {
    if (!stream || isRecording) return

    try {
      recordedChunksRef.current = [] // Clear previous chunks
      const options = {
        mimeType: 'video/webm;codecs=vp8,opus',
        videoBitsPerSecond: 2_500_000, // Optimized ~2.5 Mbps
        audioBitsPerSecond: 128_000
      }

      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.start(1000) // Collect data every second for safety
      setIsRecording(true)
      console.log("Recording started")
    } catch (err) {
      console.error("Failed to start recording:", err)
      toast.error("Could not start recording")
    }
  }

  const stopRecording = () => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder || recorder.state === "inactive") {
        resolve(null)
        return
      }

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        setIsRecording(false)
        console.log("Recording stopped, blob size:", blob.size)
        resolve(blob)
      }

      recorder.stop()
    })
  }

  const uploadRecording = async (blob) => {
    if (!blob || blob.size === 0) return null

    try {
      const timestamp = Date.now()
      const filePath = `interviews/${interview_id}/${interview_id}_${timestamp}.webm`
      
      const { error: uploadError } = await supabase.storage
        .from('interview-recordings')
        .upload(filePath, blob, {
          contentType: 'video/webm',
          upsert: false
        })

      if (uploadError) throw uploadError

      console.log("Recording uploaded:", filePath)
      return filePath
    } catch (err) {
      console.error("Upload failed (graceful):", err)
      // toast.error("Failed to upload recording") // Silent failure per plan
      return null
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

    // Start recording after Vapi starts successfully
    startRecording()
  }

  // ----------------------------------------------------
  // TOGGLE MIC & CAMERA
  // ----------------------------------------------------
  const toggleMic = () => {
    if (!stream) return
    const audioTrack = stream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setMicOn(audioTrack.enabled)
    }
  }

  const toggleCamera = () => {
    if (!stream) return
    const videoTrack = stream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setCameraOn(videoTrack.enabled)
    }
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
    
    const currentConvo = conversationRef.current
    if (currentConvo && currentConvo.length > 0) {
        // Stop recording and upload
        const recordingBlob = await stopRecording()
        let recordingPath = null
        if (recordingBlob) {
          recordingPath = await uploadRecording(recordingBlob)
        }
        await GenerateFeedback(recordingPath);
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

             {/* Video Feed */}
             <div className="absolute inset-0 flex items-center justify-center z-0">
                 {stream && cameraOn ? (
                   <video 
                     ref={videoRef}
                     autoPlay 
                     playsInline 
                     muted
                     className="w-full h-full object-cover scale-x-[-1]"
                   />
                 ) : (
                   <div className="w-full h-full bg-[#1F2937] flex items-center justify-center">
                      <UserIcon className="w-20 h-20 text-gray-700" />
                   </div>
                 )}
                 
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
             <div className="absolute top-5 right-5 z-20">
                 {networkQuality === 'good' && (
                   <Wifi className="w-5 h-5 text-green-400" />
                 )}
                 {networkQuality === 'unstable' && (
                   <Wifi className="w-5 h-5 text-yellow-400" />
                 )}
                 {networkQuality === 'poor' && (
                   <WifiOff className="w-5 h-5 text-red-400" />
                 )}
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
                        <div className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors ${
                          micOn 
                            ? 'bg-white/10 text-white border-white/10' 
                            : 'bg-red-500/90 text-white border-red-600'
                        }`}>
                            {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                        </div>
                         <div className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors ${
                          cameraOn 
                            ? 'bg-white/10 text-white border-white/10' 
                            : 'bg-red-500/90 text-white border-red-600'
                        }`}>
                            {cameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
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
                 <div className="flex flex-col items-center gap-2">
                   <button 
                      onClick={startCall}
                      disabled={!micOn || !cameraOn}
                      className={`flex items-center gap-2 px-10 py-4 rounded-xl font-bold shadow-xl text-base transition-all ${
                        micOn && cameraOn
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-95'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      }`}
                   >
                      Start Interview
                      <Play className="w-5 h-5 fill-current ml-1" />
                   </button>
                   {(!micOn || !cameraOn) && (
                     <p className="text-xs text-red-500 font-medium">
                       {mediaError || "Turn on camera and microphone to start the interview."}
                     </p>
                   )}
                 </div>
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

               {/* Media Controls */}
               <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                   <button 
                     onClick={toggleMic}
                     disabled={!stream}
                     className={`p-3 rounded-lg transition-all ${
                       micOn 
                         ? 'hover:bg-gray-50 text-gray-700' 
                         : 'bg-red-50 text-red-600 hover:bg-red-100'
                     }`}
                     title={micOn ? "Mute microphone" : "Unmute microphone"}
                   >
                      {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                   </button>
                    <button 
                      onClick={toggleCamera}
                      disabled={!stream}
                      className={`p-3 rounded-lg transition-all ${
                        cameraOn 
                          ? 'hover:bg-gray-50 text-gray-700' 
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                      title={cameraOn ? "Turn off camera" : "Turn on camera"}
                    >
                      {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                   </button>
               </div>
           </div>
        </div>

      </main>
    </div>
  )
}

export default StartInterview
