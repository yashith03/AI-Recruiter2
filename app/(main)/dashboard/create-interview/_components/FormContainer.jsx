// app/(main)/dashboard/create-interview/_components/FormContainer.jsx

import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InterviewType } from '@/services/Constants'

function FormContainer({ onHandleInputChange, GoToNext, loading }) {
  const [interviewType, setInterviewType] = useState([])

  // Send updated interviewType to parent whenever it changes
  useEffect(() => {
    onHandleInputChange('type', interviewType)
  }, [interviewType, onHandleInputChange])

  // Toggle interview type selection
  const toggleInterviewType = (type) => {
    setInterviewType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl bg-white p-5">
        {/* Job Position */}
        <div>
          <h2 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Job Position</h2>
          <Input
            placeholder="e.g. Software Engineer"
            className="mt-2 h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium"
            onChange={(event) =>
              onHandleInputChange('jobPosition', event.target.value)
            }
          />
        </div>

        {/* Job Description */}
        <div className="mt-6">
          <h2 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Job Description</h2>
          <Textarea
            placeholder="Enter job description details, required skills, and expectations..."
            className="mt-2 h-[200px] rounded-xl border-slate-100 bg-slate-50/50 text-body leading-relaxed p-4"
            onChange={(event) =>
              onHandleInputChange('jobDescription', event.target.value)
            }
          />
        </div>

        {/* Interview Duration */}
        <div className="mt-6">
          <h2 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Interview Duration</h2>
          <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
            <SelectTrigger className="mt-2 w-full h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium">
              <SelectValue placeholder="Select Duration" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="5 Min" className="text-body">5 Min</SelectItem>
              <SelectItem value="15 Min" className="text-body">15 Min</SelectItem>
              <SelectItem value="30 Min" className="text-body">30 Min</SelectItem>
              <SelectItem value="45 Min" className="text-body">45 Min</SelectItem>
              <SelectItem value="60 Min" className="text-body">60 Min</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Interview Type */}
        <div className="mt-6">
          <h2 className="text-label text-slate-500 font-bold uppercase tracking-wider px-1">Interview Type</h2>
          <div className="mt-3 flex flex-wrap gap-3">
            {InterviewType.map((type, index) => (
              <div
                key={index}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-5 transition-all duration-300 text-body font-bold shadow-sm
                  ${interviewType.includes(type.title) 
                    ? 'bg-primary/10 text-primary border-primary shadow-primary/10' 
                    : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
                onClick={() => toggleInterviewType(type.title)}
              >
                <type.icon size={18} />
                <span>{type.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex justify-end" >
          <Button 
            onClick={GoToNext} 
            disabled={loading}
            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-body font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Generate Questions <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      {loading && (
        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex gap-6 items-center animate-in slide-in-from-bottom duration-500">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="animate-spin h-7 w-7 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 text-slate-900">Generating Interview Questions</h2>
            <p className="text-body text-slate-500">
              Our AI is crafting personalized questions based on your job requirements...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormContainer
