
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
    <div className="max-w-7xl mx-auto">
      <WelcomeContainer />
      <CreateOptions />
      <LatestInterviewsList />
    </div>
  )
}

export default Dashboard
