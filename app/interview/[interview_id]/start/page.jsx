// app/interview/[interview_id]/start/page.jsx

'use client'

import React, { useContext, useEffect, useState, useRef } from 'react'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { Loader2Icon, Timer } from 'lucide-react'
import Vapi from "@vapi-ai/web"
import axios from 'axios'
import Image from 'next/image'
import { Mic, Phone, Play } from 'lucide-react'
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import TimerComponent from './_components/TimerComponent'

function StartInterview() {

  const { interviewInfo } = useContext(InterviewDataContext)
  const vapiRef = useRef(new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY))
  const timerStartedRef = useRef(false)

  const [activeUser, setActiveUser] = useState(false)
  const [conversation, setConversation] = useState("")
  const [timerStart, setTimerStart] = useState(false)
  const [timerStop, setTimerStop] = useState(false)
  const [loading, setLoading] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const [animationEnabled, setAnimationEnabled] = useState(false);


  const callStartedRef = useRef(false)

  const { interview_id } = useParams()
  const router = useRouter()

  // ----------------------------------------------------
  // CAPTURE CONVERSATION MESSAGES
  // ----------------------------------------------------
  useEffect(() => {
    const vapi = vapiRef.current

    const handleMessage = (msg) => {
    if (msg?.conversation) {
        setConversation(msg.conversation)    // keep it as JSON/object
    }}

    vapi.on("message", handleMessage)

    return () => {
      vapi.off("message", handleMessage)
    }
  }, [])

  // ----------------------------------------------------
  // FEEDBACK GENERATOR
  // ----------------------------------------------------
const GenerateFeedback = async () => {
  try {
    // send the conversation object directly
    const result = await axios.post('/api/ai-feedback', {
      conversation,
    });

    const raw = result.data.content;
    if (!raw) {
      console.log("No feedback generated from AI");
      return;
    }

    // Try to extract JSON inside ```json ... ``` if present
    const match = raw.match(/```json([\s\S]*?)```/);
    const jsonString = match ? match[1].trim() : raw.trim();

    const parsed = JSON.parse(jsonString);
    console.log("Feedback generated (parsed):", parsed);

    await supabase.from('interview-feedback').insert([
    {
       userName: interviewInfo.userName,
       userEmail: interviewInfo.userEmail,
       interview_id,
       feedback: parsed.feedback,
       recommendation: false,
     },
    ]);

    router.replace(`/interview/${interview_id}/completed`);
  } catch (err) {
    console.log("Feedback generation failed:", err);
  }
};


  // ----------------------------------------------------
  // START CALL WHEN BUTTON IS CLICKED
  // ----------------------------------------------------
  const startCall = async () => {

    if (callStartedRef.current) return; // avoid duplicate starts
    callStartedRef.current = true;
    setCallStarted(true);

    const vapi = vapiRef.current;

    // Build questions
    const questionList = interviewInfo?.interviewData?.questionList || [];
    const formattedQuestions = questionList
      .map((q, i) => `${i + 1}. ${q.question}`)
      .join("\n")

    const assistantOptions = {
      name: "AI Recruiter",

      firstMessage: `Hi ${interviewInfo.userName}, ready for your ${interviewInfo.interviewData.jobPosition} interview?`,

      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },

      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },

      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
You are an AI assistant conducting a technical interview.
Ask one question at a time from:

${formattedQuestions}

Be friendly. Encourage the candidate. After questions end, finish politely.
`.trim()
          }
        ]
      }
    }

    // ---------------- EVENT LISTENERS -----------------
vapi.on("speech-start", () => {
if (!timerStartedRef.current) {
  timerStartedRef.current = true
  setTimerStart(true)
  setAnimationEnabled(true)      // <-- ENABLE animation here
  toast("Interview Started")
}

  setActiveUser(false)
})

vapi.on("speech-end", () => setActiveUser(true))

vapi.on("error", (err) => {
  console.log("Vapi Error:", err)
  toast.error("Call error occurred")
})

vapi.on("call-ended", () => {
  toast("Interview Ended")
  setTimerStop(true)
})


    // ---------------- START CALL ----------------------
    try {
      await vapi.start(assistantOptions)
    } catch (err) {
      console.log("Start call error:", err)
      toast.error("Could not start call")
    }
  }

  // ----------------------------------------------------
  // STOP INTERVIEW (HANG UP)
  // ----------------------------------------------------
const stopInterview = async () => {
  setLoading(true)
  setTimerStop(true)

  try {
    await vapiRef.current.stop()   // wait for call to fully stop
  } catch (err) {
    console.log("Stop failed:", err)
  }

  await GenerateFeedback()
}


  return (
    <div className='p-20 lg:px-48 xl:px-56'>

      <h2 className='font-bold text-xl text-center'>
        AI Interview Session
        <span className='flex gap-2 items-center justify-center'>
          <Timer />
          <TimerComponent start={timerStart} stop={timerStop} />
        </span>
      </h2>

      {/* ------------ INTERVIEW UI ------------- */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        
        {/* AI side */}
        <div className='bg-white h-[400px] rounded-lg flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {animationEnabled && !activeUser &&(
              <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />
            )}
            <Image
              src={'/ai.png'}
              alt='ai'
              width={100}
              height={100}
              priority
              className='w-[60px] h-[60px] rounded-full object-cover'
            />
          </div>
          <h2>AI Recruiter</h2>
        </div>

        {/* USER side */}
        <div className='bg-white h-[400px] rounded-lg flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {activeUser &&
              <span className='absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping' />
            }
            <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5'>
              {interviewInfo?.userName?.[0]}
            </h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
        </div>
      </div>

      {/* ------------ BUTTONS ------------- */}
      <div className='flex items-center gap-5 justify-center mt-7'>

        {/* START CALL BUTTON */}
        {!callStarted &&
          <button
            onClick={startCall}
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold'
          >
            <Play /> Start Interview
          </button>
        }

        {/* STOP CALL */}
        {callStarted &&
          <AlertConfirmation stopInterview={stopInterview}>
            {!loading ?
              <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' /> :
              <Loader2Icon className='animate-spin' />
            }
          </AlertConfirmation>
        }
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>
        {callStarted ? "Interview in Progress..." : "Click Start to begin your interview."}
      </h2>
    </div>
  )
}

export default StartInterview
