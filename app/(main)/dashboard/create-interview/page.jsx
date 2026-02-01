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
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useUser } from "@/app/provider"
import { canCreateInterview } from "@/app/utils/subscription"

function CreateInterview() {
  const router = useRouter()
  const { user } = useUser()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [interviewId, setInterviewId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [questionList, setQuestionList] = useState([])
  const [openCreditDialog, setOpenCreditDialog] = useState(false)

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

    // Centralized Credit Check
    if (!canCreateInterview(user)) {
      toast.error("Your free credits are over, upgrade the plan for unlimited interview creation")
      setOpenCreditDialog(true)
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

      if (!result.ok) {
        const errorText = await result.text();
        console.error("AI API failed:", errorText);
        throw new Error("AI generation failed or returned 500");
      }

      const payload = await result.json()
      console.log("AI API payload:", payload)

      let generatedQuestions = []
      
      // Direct access to interviewQuestions (matches current API response structure)
      if (payload?.interviewQuestions && Array.isArray(payload.interviewQuestions)) {
        generatedQuestions = payload.interviewQuestions
      }
      // Fallback for legacy response format
      else if (payload?.result?.interviewQuestions) {
        generatedQuestions = payload.result.interviewQuestions
      }
      // String content fallback (for non-JSON responses)
      else if (payload?.content && typeof payload.content === "string") {
        const cleaned = payload.content
          .replace(/\"?```json\s*/i, "")
          .replace(/```/g, "")

        try {
          const parsed = JSON.parse(cleaned)
          generatedQuestions = parsed?.interviewQuestions || []
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
      console.error("AI Generation Error:", e)
      toast.error("All FREE models failed, rate-limited, or returned invalid data. Please wait 10s and try again.")
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
        <InterviewLink 
          interview_id={interviewId} 
          formData={formData} 
          onReset={() => {
            setStep(1)
            setFormData({})
            setInterviewId(null)
          }}
        />
      )}

      {/* Credit Limit Dialog */}
      <Dialog open={openCreditDialog} onOpenChange={setOpenCreditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Credits Exhausted</DialogTitle>
            <DialogDescription>
              Your free credits are over, upgrade the plan for unlimited interview creation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setOpenCreditDialog(false)}>
              Cancel
            </Button>
            <Link href="/manage-subscription">
              <Button>Upgrade Plan</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateInterview
