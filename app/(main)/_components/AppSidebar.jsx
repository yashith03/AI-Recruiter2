// app/(main)/_components/AppSidebar.jsx

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus, Home, Settings } from 'lucide-react'
import { SideBarOptions } from '@/services/Constants'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'



export default function AppSidebar() {
  
const path= usePathname();
console.log("path",path);
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-2 items-start mt-2">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={100}
          priority
          className="w-[150px]"
        />

        <Button className="w-full">
          <Plus /> Create New Interview
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
              <SidebarMenuItem key={index} className='p-1'>
                <SidebarMenuButton asChild className={`p-5 ${path==option.path && 'bg-blue-50'}`} >
                  <Link href={option.path}>
                    <option.icon  className={` ${path == option.path && 'text-primary'}`}/>
<span
  className={`text-[16px] font-medium ${
    path === option.path ? "font-bold text-primary" : ""
  }`}
>
  {option.name}
</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
