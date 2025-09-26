// app/(main)/dashboard/_components/LatestInterviewsList.jsx

"use client"
import React, { useState } from 'react'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'

function LatestInterviewsList() {
    const [interviews, setInterviews] = useState([]);

    return (
        <div className='my-5'>
            <h2 className='font-bold text-2xl'>Previously Created Interviews</h2>

            {interviews?.length === 0 &&
            <div className='p-5 flex flex-col gap-3 items-center bg-white'>
                <Video className='h-10 w-10 text-primary'/>
                <h2 className='font-bold text-lg'>No Interviews Created</h2>
                <Button>Create New Interview</Button>
            </div>
            }
        </div>
    )
}

export default LatestInterviewsList
