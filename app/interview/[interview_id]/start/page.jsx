// app/interview/%5Binterview_id%5D/start/page.jsx

'use client'

import React, { useContext, useEffect, useState, useRef } from 'react'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { Timer } from 'lucide-react'
import Vapi from "@vapi-ai/web"
import axios from 'axios'
import Image from 'next/image'
import { Mic, Phone } from 'lucide-react'
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner'

function StartInterview() {

  const { interviewInfo } = useContext(InterviewDataContext)

  const vapiRef = useRef(new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY))

  const [activeUser, setActiveUser] = useState(false)
  const [conversation, setConversation] = useState()

  useEffect(() => {
    if (!interviewInfo) return;

    const vapi = vapiRef.current;

    // MOVED HERE → no ESLint warnings
    const GenerateFeedback = async () => {
      try {
        const result = await axios.post('/api/ai-feedback', {
          conversation: conversation
        })

        let content = result.data.content
        const cleanJSON = content.replace("```json", "").replace("```", "")
        console.log("Final Feedback JSON:", cleanJSON)

      } catch (err) {
        console.log("Feedback generation failed:", err)
      }
    }

    const startCall = async () => {
      if (!interviewInfo?.interviewData?.questionList) return;

      const formattedQuestions = interviewInfo.interviewData.questionList
        .map((q, i) => `${i + 1}. ${q.question}`)
        .join("\n");


    const assistantOptions = {
      name: "AI Recruiter",

      firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,

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
You are an AI voice assistant conducting interviews.
Your responsibility is to ask the candidate the provided interview questions and evaluate their responses.

Start with a friendly introduction:
"Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"

Ask **one question at a time**. Wait for the candidate to finish answering before proceeding.

Here are your questions:
${formattedQuestions}

If the candidate struggles, gently offer hints:
"Need a hint? Think about how React tracks component updates!"

Give short, encouraging feedback:
"Nice! That's a solid answer."
"Almost there—want to try that again?"

Use natural transitions:
"Alright, next up…"
"Let’s tackle a tricky one!"

After 5–7 questions:
"Great job! You handled some challenging questions!"

End with:
"Thanks for chatting! Hope to see you crushing projects soon!"

Guidelines:
• Stay friendly and engaging  
• Keep responses short and natural  
• Adapt based on candidate confidence  
• Maintain focus on ${interviewInfo?.interviewData?.jobPosition}
`.trim(),
          },
        ],
      },
    }
  
    // START THE CALL (this was missing!)
    vapi.start(assistantOptions)

    // EVENT LISTENERS
    vapi.on("call-started", () => {
      console.log("Assistant Call started")
      toast("Call Connected...")
    });

    vapi.on("speech-start", () => {
      console.log("Assistant speaking")
      setActiveUser(false)
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking")
      setActiveUser(true)
    });

    vapi.on("call-ended", () => {
      console.log("Call has ended")
      toast("Interview Ended");
      GenerateFeedback();
    });

    vapi.on("message", (message) =>{
      console.log("Conversation update:", message?.conversation);
      setConversation(message?.conversation);
    });
  }
  startCall();
}, [interviewInfo, conversation]);



  const stopInterview = () => {
    vapiRef.current.stop()
  }

  return (
    <div className='p-20 lg:px-48 xl:px-56'>

      <h2 className='font-bold text-xl text-center'>
        AI Interview Session
        <span className='flex gap-2 items-center justify-center'>
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>

        {/* AI side */}
        <div className='bg-white h-[400px] rounded-lg flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {!activeUser &&
              <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />
            }
            <Image
              src={'/ai.png'}
              alt='ai'
              width={100}
              height={100}
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

      {/* Buttons */}
      <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />

        <AlertConfirmation stopInterview={stopInterview}>
          <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
        </AlertConfirmation>
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>
        Interview in Progress...
      </h2>
    </div>
  )
}

export default StartInterview
