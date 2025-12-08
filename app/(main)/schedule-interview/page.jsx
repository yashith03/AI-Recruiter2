//app/(main)/schedule-interview/page.jsx

"use client"
import React, { useEffect } from 'react'
import { supabase } from '@/services/supabaseClient';
import { useContext } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import InterviewCard from '../dashboard/_components/InterviewCard';
import { useUser } from '@/app/provider';

function ScheduledInterview() {

    const {user} = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        user && GetInterviewList();
    }, [user]);

    const GetInterviewList= async () =>{
        const result = await supabase.from('interviews')
            .select('jobPosition, duration, interview_id, interview-feedback(*)')
             .eq('userEmail', user?.email)
             .order('id', { ascending: false });

        console.log(result);
        setInterviewList(result.data);
    }
  return (
    <div className='my-5'>
        <h2 className='font-bold text-2xl'>Interviw List with Candidate Feedback</h2>

        {interviewList.length === 0 && (
        <div className='p-6 flex flex-col gap-3 items-center bg-white rounded-xl shadow'>
          <Video className='h-10 w-10 text-primary' />
          <h2 className='font-bold text-lg'>No Interviews Created</h2>
          <Button>Create New Interview</Button>
        </div>
      )}

      {/* CHANGED: Updated grid layout + spacing to match screenshot */}
      {interviewList.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-4 min-w-0'>
          {interviewList?.map((interview, index) => (
            <InterviewCard interview={interview} key={index}
            viewDetail= {true} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ScheduledInterview