// app/(main)/dashboard/page.jsx

import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function Dashboard() {
  return (
    <div>
      
      <h2 className='my-3 font-bold text-2xl'>Dashboard</h2>
      <CreateOptions />

      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard
