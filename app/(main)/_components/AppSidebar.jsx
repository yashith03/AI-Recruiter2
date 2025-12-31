// app/(main)/_components/AppSidebar.jsx

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SideBarOptions } from '@/services/Constants'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation'
import { useUser } from '@/app/provider'

export default function AppSidebar() {
  const { user } = useUser()
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col gap-4 items-start p-6">
        <div className="flex items-center gap-2 text-[#0d141c]">
          <div className="text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>graphic_eq</span>
          </div>
          <h2 className="text-h3 text-slate-800">AI Recruiter</h2>
        </div>

        <Link href={'/dashboard/create-interview'} className="w-full">
          <Button className="w-full text-body font-bold h-11 rounded-xl shadow-lg shadow-primary/20">
            <Plus size={18} /> Create New Interview
          </Button>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-label text-slate-400 mb-4 px-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                <SidebarMenuItem key={index} className="mb-1">
                  <SidebarMenuButton asChild tooltip={item.name} className={`h-11 rounded-xl transition-all duration-300 ${
                    path === item.path 
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/5 shadow-primary/10" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}>
                    <Link href={item.path} className="flex items-center gap-3 px-3">
                      <item.icon size={20} className={`${path === item.path ? "text-primary" : "text-slate-400 group-hover:text-slate-600"} transition-colors`} />
                      <span className={`text-body transition-all ${path === item.path ? "font-bold" : "font-semibold"}`}>
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-50">
        <div className="flex items-center gap-3 p-2 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer group">
          {user?.picture ? (
            <Image 
              src={user?.picture} 
              alt="Profile" 
              width={36} 
              height={36} 
              className="rounded-full ring-2 ring-primary/10 shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-body font-black">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-body font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
              {user?.name || "Recruiter"}
            </span>
            <span className="text-label text-slate-400 truncate">
              {user?.email || "recruiter@ai.com"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
