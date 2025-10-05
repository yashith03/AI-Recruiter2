// app/(main)/dashboard/create-interview/page.jsx

"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner';

function CreateInterview() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})

  // Stable callback to pass to child component
  const onHandleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  // Optional: log FormData changes
  useEffect(() => {
    console.log("FormData updated:", formData)
  }, [formData])

  const onGoToNext =()=>{
    console.log("Form data:", formData); 

    if(!formData?.jobPosition||
      !formData?.jobDescription||
      !formData?.duration||
      !formData?.type ||
      formData?.type?.length===0)
      {
       toast.error('Please fill all the fields') 
       return ;
      }
      setStep(2);
}

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
      {/* Header */}
      <div className='flex gap-5 items-center'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
        <h2 className='font-bold text-2xl'>Create New Interview</h2>
      </div>

      {/* Progress bar */}
      <Progress value={step * 33.33} className='my-5' />

      {/* Form container */}
      {step==1?<FormContainer 
              onHandleInputChange={onHandleInputChange}
              GoToNext={onGoToNext} />
              :step===2?(
              <QuestionList formData={formData}/>
              ):null}
    </div>
  )
}

export default CreateInterview
