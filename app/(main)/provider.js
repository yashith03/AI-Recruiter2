// app/(main)/provider.js

import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from './_components/AppSidebar'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='w-full bg-background min-h-screen'>
        <div className="p-4 md:p-10">
          <div className="flex items-center mb-8 md:hidden">
            <SidebarTrigger className="text-slate-500" />
            <span className="ml-4 text-h2 text-slate-900">AI Recruiter</span>
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}

export default DashboardProvider
