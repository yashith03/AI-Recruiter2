// app/(main)/dashboard/create-interview/_components/QuestionList.jsx

"use client"

import React, { useEffect, useState } from "react"
import { Loader, Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import QuestionsListContainer from "./QuestionsListContainer"
import { useUser } from "@/app/provider"
import { v4 as uuidv4 } from "uuid"
import { supabase } from "@/services/supabaseClient"

function QuestionList({ formData, onCreateLink }) {
  const [loading, setLoading] = useState(true)
  const [questionList, setQuestionList] = useState([])
  const [saving, setSaving] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) return

    async function generateQuestionList() {
      setLoading(true)
      try {
        const result = await axios.post("/api/ai-model", {
          ...formData,
        })

        const payload = result.data
        console.log("AI API payload:", payload)

        if (payload?.result && typeof payload.result === "object") {
          setQuestionList(payload.result.interviewQuestions || [])
        } else if (payload?.content && typeof payload.content === "string") {
          const cleaned = payload.content
            .replace(/"?```json\s*/i, "")
            .replace(/```/g, "")

          try {
            setQuestionList(JSON.parse(cleaned)?.interviewQuestions || [])
          } catch (err) {
            console.warn("Failed to parse AI content string", err)
            setQuestionList([])
          }
        } else {
          console.warn("Unexpected AI payload shape", payload)
          setQuestionList([])
        }
      } catch (e) {
        const msg =
          e.response?.data?.error ||
          "Server is busy, please try again later."
        toast.error(msg)
        setQuestionList([])
      } finally {
        setLoading(false)
      }
    }

    generateQuestionList()
  }, [formData])

  const onFinish = async () => {
    console.log("onFinish called")
    console.log("User:", user)
    console.log("FormData:", formData)
    console.log("QuestionList:", questionList)

    if (!user?.email) {
      toast.error("User not logged in. Please sign in first.")
      return
    }

    if (!questionList.length) {
      toast.error("No questions generated yet.")
      return
    }

    setSaving(true)
    const interview_id = uuidv4()

    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          jobPosition: formData.jobPosition,
          jobDescription: formData.jobDescription,
          duration: formData.duration,
          // keep as array so detail page can handle it
          type: Array.isArray(formData.type) ? formData.type : [formData.type],
          questionList,
          userEmail: user.email,
          interview_id,
        },
      ])
      .select()

    if (error) {
      console.error("Error saving interview:", error)
      toast.error("Failed to save interview: " + error.message)
      setSaving(false)
      return
    }

    // Optional: credits update, only if field exists
    if (user.credits !== undefined) {
      const { error: creditsError } = await supabase
        .from("users")
        .update({ credits: Number(user.credits) - 1 })
        .eq("email", user.email)

      if (creditsError) {
        console.error("Error updating credits:", creditsError)
      }
    }

    console.log("Interview saved:", data)
    toast.success("Interview created successfully!")
    setSaving(false)
    onCreateLink(interview_id)
  }

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center">
          <Loader2 className="animate-spin h-5 w-5 text-blue-500" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-primary">
              Our AI is crafting personalized questions based on your job
              position
            </p>
          </div>
        </div>
      )}

      {!loading && questionList.length > 0 && (
        <QuestionsListContainer questionList={questionList} />
      )}

      {!loading && questionList.length === 0 && (
        <div className="p-5">
          <p className="text-sm text-muted-foreground">
            No questions generated. Try adjusting the job description or
            retrying.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-10">
        <Button onClick={onFinish} disabled={saving}>
          {saving && (
            <Loader className="animate-spin h-4 w-4 mr-2" />
          )}
          Create Interview Link and Finish
        </Button>
      </div>
    </div>
  )
}

export default QuestionList
