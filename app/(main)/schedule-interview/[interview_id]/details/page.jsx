// app/(main)/schedule-interview/[interview_id]/details/page.jsx

"use client"

import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/services/supabaseClient"
import { useUser } from "@/app/provider"
import InterviewDetailContainer from "./_components/interviewDetailContainer"
import CandidateList from "./_components/CandidateList"

function InterviewDetail() {
  const { interview_id } = useParams()
  const { user } = useUser()
  const [interviewDetails, setInterviewDetails] = useState(null)

  useEffect(() => {
    if (!user?.email || !interview_id) return

    const getInterviewDetail = async () => {
      const { data, error } = await supabase
        .from("interviews")
        .select(
          "jobPosition, jobDescription, type, duration, questionList, interview_id, created_at, interview-feedback!interview_feedback_interview_id_fk(*)"
        )
        .eq("userEmail", user.email)
        .eq("interview_id", interview_id)

      if (error) {
        console.error("Error loading interview details:", error)
        return
      }

      setInterviewDetails(data?.[0] || null)
      console.log("Interview detail:", data)
    }

    getInterviewDetail()
  }, [user, interview_id])

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-700 px-6">
      <div className="mb-10 pt-4">
        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Interview Details</h1>
        <p className="text-body-lg text-slate-500 font-medium">Review interview configuration and candidate results.</p>
      </div>
      
      <InterviewDetailContainer interviewDetail={interviewDetails} />
      
      <div className="mt-20">
        <CandidateList candidateList={interviewDetails?.["interview-feedback"]} />
      </div>
    </div>
  )
}

export default InterviewDetail
