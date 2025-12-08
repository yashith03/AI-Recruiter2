// app/(main)/all-interviews/page.jsx
'use client'
import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from '../dashboard/_components/InterviewCard'

function AllInterview() {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

  const GetInterviewList = useCallback(async () => {
    let { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('userEmail', user.email)
      .order('created_at', { ascending: false })

      

    if (error) {
      console.error('Supabase error:', error.message);
      return;
    }

    setInterviewList(data || []);
  },[user]);
    useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user, GetInterviewList]);

  return (
    <div className='my-8'> 
      {/* CHANGED: Added mb-3 for spacing and improved margin */}
      <h2 className='font-bold text-2xl mb-3'>
        All Previously Created Interviews
      </h2>

      {/* CHANGED: Added rounded-xl and shadow */}
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
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}


export default AllInterview