// app/(main)/dashboard/create-interview/page.jsx

"use client"

import React, { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import FormContainer from "./_components/FormContainer"
import QuestionList from "./_components/QuestionList"
import InterviewLink from "./_components/InterviewLink"
import { toast } from "sonner"
import { useUser } from "@/app/provider"

function CreateInterview() {
  const router = useRouter()
  const { user } = useUser()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [interviewId, setInterviewId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questionList, setQuestionList] = useState([])

  // Stable callback to pass to child component
  const onHandleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }, [])

  // Optional: log FormData changes
  useEffect(() => {
    console.log("FormData updated:", formData)
  }, [formData])

  const onGoToNext = async () => {
    console.log("Form data:", formData)

    if (!user) {
      toast.error("You must be logged in to create an interview")
      return
    }

    if (user?.credits <= 0) {
      toast.error("You have no credits to create an interview. Please top up your credits.")
      return
    }

    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData?.type ||
      (Array.isArray(formData.type) && formData.type.length === 0)
    ) {
      toast.error("Please fill all the fields")
      return
    }

    setLoading(true)
    try {
      const result = await fetch("/api/ai-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const payload = await result.json()
      console.log("AI API payload:", payload)

      let generatedQuestions = []
      if (payload?.result && typeof payload.result === "object") {
        generatedQuestions = payload.result.interviewQuestions || []
      } else if (payload?.content && typeof payload.content === "string") {
        const cleaned = payload.content
          .replace(/"?```json\s*/i, "")
          .replace(/```/g, "")

        try {
          generatedQuestions = JSON.parse(cleaned)?.interviewQuestions || []
        } catch (err) {
          console.warn("Failed to parse AI content string", err)
        }
      }

      if (generatedQuestions.length > 0) {
        setQuestionList(generatedQuestions)
        setStep(2)
      } else {
        toast.error("Failed to generate questions. Please try again.")
      }
    } catch (e) {
      console.error(e)
      toast.error("Server is busy, please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const onCreateLink = createdInterviewId => {
    setInterviewId(createdInterviewId)
    setStep(3)
  }

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      {/* Header */}
      <div className="flex gap-4 items-center mb-6">
        <div 
          onClick={() => router.back()}
          data-testid="back-arrow"
          className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors text-slate-400 hover:text-slate-900"
        >
          <ArrowLeft size={24} />
        </div>
        <h2 className="text-h2 text-slate-900">Create New Interview</h2>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <Progress value={step * 33.33} className="h-2 rounded-full bg-slate-100" />
      </div>

      {/* Steps */}
      {step === 1 && (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
          loading={loading}
        />
      )}

      {step === 2 && (
        <QuestionList 
          formData={formData} 
          onCreateLink={onCreateLink} 
          initialQuestionList={questionList}
        />
      )}

      {step === 3 && interviewId && (
        <InterviewLink interview_id={interviewId} formData={formData} />
      )}
    </div>
  )
}

export default CreateInterview
