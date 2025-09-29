"use client"
import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import FormContainer from './_components/FormContainer'

function CreateInterview() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [FormData, setFormData] = useState({})

  const onHandleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    console.log("FormData", FormData)
  }, []) // ✅ useCallback ensures stable identity

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex gap-5 items-center'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
        <h2 className='font-bold text-2xl'>Create New Interview</h2>
      </div>

      <Progress value={step * 33.33} className={'my-5'} />
      <FormContainer onHandleInputChange={onHandleInputChange} />
    </div>
  )
}

export default CreateInterview
