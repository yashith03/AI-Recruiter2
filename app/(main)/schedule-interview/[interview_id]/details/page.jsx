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
          "jobPosition, jobDescription, type, duration, questionList, interview_id, created_at, interview-feedback(*)"
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
    <div className="mt-5">
      <h2 className="font-bold text-2xl">Interview Detail</h2>
      <InterviewDetailContainer interviewDetail={interviewDetails} />
      <CandidateList candidateList={interviewDetails?.["interview-feedback"]} />
    </div>
  )
}

export default InterviewDetail
