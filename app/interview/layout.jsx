//app/interview/layout.jsx

'use client'
import InterviewHeader from './_components/InterviewHeader'
import { useState } from 'react'
import { InterviewDataContext } from '@/context/interviewDataContext'
import React from 'react'

function InterviewLayout({children}) {

    const [interviewInfo, setInterviewInfo] = useState();

  return (
    <InterviewDataContext.Provider value={{interviewInfo, setInterviewInfo}}>
    <div className='bg-secondary'>
        <InterviewHeader/>
        {children}
    </div>
    </InterviewDataContext.Provider>
  )
}

export default InterviewLayout