// app/(main)/dashboard/_components/InterviewCard.jsx

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Copy, Send } from 'lucide-react'
import moment from 'moment'
import { toast } from 'sonner'
import React from 'react'

function InterviewCard({ interview }) {

  const copyLink = () => {
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/" + interview?.interview_id;
    navigator.clipboard.writeText(url);
    toast('Copied');
  };

  return (
    <div 
      className='p-5 bg-white w-full rounded-xl border shadow-sm hover:shadow-md transition min-h-[220px] flex flex-col'>

      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='h-[45px] w-[45px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600'></div>

        <h2 className='text-sm font-medium text-gray-600'>
          {moment(interview?.created_at).format('DD MMM YYYY')}
        </h2>
      </div>

      {/* Middle section */}
      <div className='flex-1 mt-3'>
        <h2 className='font-semibold text-lg text-gray-800'>
          {interview?.jobPosition}
        </h2>
        <h2 className='mt-1 text-sm text-gray-500'>
          {interview?.duration}
        </h2>
      </div>

      {/* Buttons pinned at bottom */}
      {/* CHANGE 1: Removed nested flex and made both buttons equal width */}
      <div className='flex gap-3 mt-4'>
        
        {/* CHANGE 2: Added className='flex-1' so both expand equally */}
        <Button 
          variant="outline" 
          className='flex-1 flex items-center justify-center gap-2'
          onClick={copyLink}
        >
          <Copy className='h-4 w-4' /> Copy Link
        </Button>

        <Button 
          className='flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white'
        >
          <Send className='h-4 w-4' /> Send
        </Button>

      </div>
    </div>
  )
}

export default InterviewCard;
