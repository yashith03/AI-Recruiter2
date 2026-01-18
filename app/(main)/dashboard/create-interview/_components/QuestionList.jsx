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

function QuestionList({ formData, onCreateLink, initialQuestionList }) {
  const [loading, setLoading] = useState(!initialQuestionList || initialQuestionList.length === 0)
  const [questionList, setQuestionList] = useState(initialQuestionList || [])
  const [saving, setSaving] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (initialQuestionList && initialQuestionList.length > 0) {
      setQuestionList(initialQuestionList)
      setLoading(false)
    }
  }, [initialQuestionList])

  const onFinish = async () => {
    console.log("onFinish triggered. User:", user?.email, "Questions:", questionList.length);
    
    if (!user?.email) {
      console.warn("Save aborted: User email missing");
      toast.error("User not logged in. Please sign in first.")
      return
    }

    if (!questionList.length) {
      console.warn("Save aborted: No questions");
      toast.error("No questions generated yet.")
      return
    }

    setSaving(true)
    const interview_id = uuidv4()
    console.log("Generated interview_id:", interview_id);

    try {
      console.log("Starting Supabase insert with payload:", {
        jobPosition: formData.jobPosition,
        userEmail: user.email,
        interview_id,
      });

      // Wrap supabase call in a timeout to detect hangs
      const insertPromise = supabase
        .from("interviews")
        .insert([
          {
            jobPosition: formData.jobPosition,
            jobDescription: formData.jobDescription,
            duration: formData.duration,
            type: Array.isArray(formData.type) ? formData.type : [formData.type],
            questionList,
            userEmail: user.email,
            interview_id,
          },
        ]);

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Supabase insert timeout after 10s")), 10000)
      );

      console.log("Waiting for Supabase response (without .select())...");
      const result = await Promise.race([insertPromise, timeoutPromise]);
      console.log("Supabase promise resolved!", result);

      const { data, error } = result;

      if (error) {
        console.error("Supabase insert error returned:", error)
        toast.error("Failed to save interview: " + (error.message || "Unknown error"))
        setSaving(false)
        return
      }

      console.log("Supabase insert success. Result:", result);
      toast.success("Interview created successfully!")
      setSaving(false)
      console.log("Calling onCreateLink with ID:", interview_id);
      onCreateLink(interview_id)
      
    } catch (err) {
      console.error("onFinish Catch Global Error:", err);
      toast.error("An unexpected error occurred while saving: " + err.message);
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {loading ? (
        <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 flex gap-6 items-center animate-pulse">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="animate-spin h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 text-slate-900 font-bold leading-tight">Finalizing Questions</h2>
            <p className="text-body text-slate-500">Please wait while we prepare your assessment...</p>
          </div>
        </div>
      ) : (
        <>
          {questionList.length > 0 ? (
            <QuestionsListContainer questionList={questionList} />
          ) : (
            <div className="p-10 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <p className="text-body text-slate-500 italic">No questions generated. Please go back and try again.</p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end pt-8 border-t border-slate-50 mt-4">
        <Button 
          onClick={onFinish} 
          disabled={saving || loading || questionList.length === 0} 
          className="h-12 px-10 rounded-xl bg-primary hover:bg-primary-dark text-body font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {saving && (
            <Loader2 className="animate-spin h-5 w-5" />
          )}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  )
}

export default QuestionList
