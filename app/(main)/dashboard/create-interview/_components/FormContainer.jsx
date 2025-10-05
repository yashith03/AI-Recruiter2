// app/(main)/dashboard/create-interview/_components/FormContainer.jsx
import React, { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InterviewType } from '@/services/Constants'

function FormContainer({ onHandleInputChange, GoToNext }) {
  const [interviewType, setInterviewType] = useState([])

  // Send updated interviewType to parent whenever it changes
  useEffect(() => {
    onHandleInputChange('type', interviewType)
  }, [interviewType, onHandleInputChange]) // ✅ include callback in dependency array

  const AddInterviewType=(type)=>{
    const data=interviewType.includes(type);
    if(!data){
      setInterviewType([...interviewType,type])
    }
    else{
      const result=interviewType.filter((item)=>item!==type)
      setInterviewType(result)
    }

  }

  // Toggle interview type selection
  const toggleInterviewType = (type) => {
    setInterviewType((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    )
  }

  return (
    <div className="rounded-xl bg-white p-5">
      {/* Job Position */}
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input
          placeholder="e.g. Software Engineer"
          className="mt-2"
          onChange={(event) =>
            onHandleInputChange('jobPosition', event.target.value)
          }
        />
      </div>

      {/* Job Description */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter job description details"
          className="mt-2 h-[200px]"
          onChange={(event) =>
            onHandleInputChange('jobDescription', event.target.value)
          }
        />
      </div>

      {/* Interview Duration */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select onValueChange={(value) => onHandleInputChange('duration', value)}>
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5 Min">5 Min</SelectItem>
            <SelectItem value="15 Min">15 Min</SelectItem>
            <SelectItem value="30 Min">30 Min</SelectItem>
            <SelectItem value="45 Min">45 Min</SelectItem>
            <SelectItem value="60 Min">60 Min</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Interview Type */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`flex cursor-pointer gap-2 rounded-2xl border border-gray-300 p-1 px-4 hover:bg-secondary 
                ${interviewType.includes(type.title) ? 'bg-blue-50 text-primary border-primary' : ''}`}
              onClick={() => toggleInterviewType(type.title)}
            >
              <type.icon className="h-4 w-4" />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-7 flex justify-end" >
        <Button onClick={GoToNext}>
          Generate Question <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default FormContainer
