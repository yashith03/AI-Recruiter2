// app/(main)/layout.js

import React from 'react'
import DashboardProvider from './provider'
import WelcomeContainer from './dashboard/_components/WelcomeContainer'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from './_components/AppSidebar'

function DashboardLayout({children}) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

export default DashboardLayout
