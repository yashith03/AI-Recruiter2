// components/AppSidebar.jsx
'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className= "flex items-center mt-5">
        <Image src="/logo.png" alt="logo" width={200} height={100} 
        className ="w-[150px]"/>

        <Button className={"w-full"}><Plus/> Create New Interview</Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
