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

  const onGoToNext = () => {
    console.log("Form data:", formData)

    if (!user) {
      toast.error("You must be logged in to create an interview")
      return
    }

    // Only check credits if the field actually exists
    if (user?.credits !== undefined && user.credits <= 0) {
      toast.error(
        "You have no credits to create an interview. Please top up your credits."
      )
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

    setStep(2)
  }

  const onCreateLink = createdInterviewId => {
    setInterviewId(createdInterviewId)
    setStep(3)
  }

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      {/* Header */}
      <div className="flex gap-5 items-center">
        <ArrowLeft
          data-testid="back-arrow"
          onClick={() => router.back()}
          className="cursor-pointer"
        />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>

      {/* Progress bar */}
      <Progress value={step * 33.33} className="my-5" />

      {/* Steps */}
      {step === 1 && (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
        />
      )}

      {step === 2 && (
        <QuestionList formData={formData} onCreateLink={onCreateLink} />
      )}

      {step === 3 && interviewId && (
        <InterviewLink interview_id={interviewId} formData={formData} />
      )}
    </div>
  )
}

export default CreateInterview
