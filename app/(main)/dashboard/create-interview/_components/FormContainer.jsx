// app/(main)/dashboard/create-interview/_components/FormContainer.jsx

import React from 'react'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrrowRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { InterviewType } from '@/services/Constants'

function FormContainer({onHandleInputChange}) {
  return (
    <div className="p-5 bg-white rounded-xl">
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input placeholder="e.g. Software Engineer" className="mt-2" 
        onChange={(event) => onHandleInputChange('jobPosition', event.target.value)}
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea
          placeholder="Enter details job description"
          className="h-[200px] mt-2"
        />
      </div>

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select>
          <SelectTrigger className="w-full mt-2">
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

      <div className="mt-5">
        <h2 className="text-sm font-medium">Interview Type</h2>
        <div className="mt-2 flex flex-wrap gap-3">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className="flex cursor-pointer gap-2 rounded-2xl border border-gray-300 p-1 px-2"
            >
              <type.icon className="h-4 w-4" />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-7 flex justify-end'>
      <Button>Geenrate Question <ArrrowRight/></Button>
      </div>
    </div>
  )
}

export default FormContainer
