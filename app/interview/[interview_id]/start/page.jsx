//app/interview/[interview_id]/start/page.jsx

'use client'

import React from 'react'
import { useContext } from 'react'
import { InterviewDataContext } from '@/context/interviewDataContext'
import { Timer } from 'lucide-react';

function StartInterview() {

    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
  return (
    <div className='p-20 lg:px-48 xl:px-56'>
        <h2 className= 'font-bold text-xl justify-center'>AI Interview Session
        <span className='flex gap-2 items-center'>
            <Timer/>
            00:00:00
        </span>
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-7'> 
            <div>

            </div>
            <div>
                
            </div>

        </div>
    </div>
  )
}

export default StartInterview