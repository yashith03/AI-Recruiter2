"use client"
import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  Calendar, 
  Clock, 
  Video, 
  FileText, 
  ThumbsUp, 
  RotateCw, 
  MoreHorizontal, 
  CalendarDays,
  XCircle,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// Mock Data
const interviews = [
  {
    id: 1,
    candidate: {
      name: "Sarah Jenkins",
      role: "Senior Frontend Engineer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop"
    },
    status: "Upcoming",
    time: "2:00 PM - 3:00 PM",
    platform: "Google Meet",
    dateGroup: "Today, Oct 24",
    type: "Screening"
  },
  {
    id: 2,
    candidate: {
      name: "Marcus Chen",
      role: "Product Designer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop"
    },
    status: "Upcoming",
    time: "4:30 PM - 5:15 PM",
    platform: "Zoom Meeting",
    dateGroup: "Today, Oct 24",
    type: "Technical"
  },
  {
    id: 3,
    candidate: {
      name: "Elena Rodriguez",
      role: "Data Scientist",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop"
    },
    status: "Completed",
    time: "10:00 AM - 11:00 AM",
    platform: "AI Summary Ready",
    dateGroup: "Today, Oct 24",
    type: "Technical"
  },
  {
    id: 4,
    candidate: {
      name: "David Kim",
      role: "Backend Developer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop"
    },
    status: "Upcoming",
    time: "11:00 AM - 12:00 PM",
    platform: "Google Meet",
    dateGroup: "Tomorrow, Oct 25",
    type: "Final Round"
  },
  {
    id: 5,
    candidate: {
      name: "Lisa Wong",
      role: "Product Manager",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop"
    },
    status: "Cancelled",
    cancelReason: "Cancelled by Candidate",
    originalTime: "Originally Oct 25, 2:00 PM",
    dateGroup: "Tomorrow, Oct 25",
    type: "Screening"
  }
]

export default function ScheduleInterviewPage() {
  const [filterStatus, setFilterStatus] = useState('all')

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 mt-2">
        <div>
          <h1 className="text-h1 text-slate-900 mb-2">Scheduled Interviews</h1>
          <p className="text-body-lg text-slate-500">Manage your upcoming screenings and technical rounds.</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white text-body font-bold px-6 h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex gap-2">
          <Plus size={18} /> Schedule New
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-10 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search by candidate or role..." 
            className="pl-10 h-11 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-primary text-body"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="date">
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Range</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="interviewer">
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Interviewer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interviewer">Interviewer</SelectItem>
              <SelectItem value="me">Me</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="role">
            <SelectTrigger className="w-[130px] h-11 rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Job Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">Job Role</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grouped Lists */}
      <div className="space-y-10">
        
        {/* Today */}
        <div className="space-y-4">
          <h3 className="text-h3 text-slate-900 border-b border-slate-100 pb-2">Today, Oct 24</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.filter(i => i.dateGroup.includes("Today")).map(interview => (
              <InterviewCard key={interview.id} data={interview} />
            ))}
          </div>
        </div>

        {/* Tomorrow */}
        <div className="space-y-4">
          <h3 className="text-h3 text-slate-900 border-b border-slate-100 pb-2">Tomorrow, Oct 25</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.filter(i => i.dateGroup.includes("Tomorrow")).map(interview => (
              <InterviewCard key={interview.id} data={interview} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function InterviewCard({ data }) {
  const isCancelled = data.status === 'Cancelled'
  const isCompleted = data.status === 'Completed'

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-lg hover:border-slate-200 transition-all duration-300 group">
      
      {/* Header: Avatar, Name, Badge */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm relative">
            <Image 
              src={data.candidate.avatar} 
              alt={data.candidate.name} 
              width={56} 
              height={56} 
              className={`object-cover ${isCancelled ? 'grayscale opacity-70' : ''}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={`text-body-lg font-bold ${isCancelled ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                {data.candidate.name}
              </h4>
            </div>
            <p className="text-body text-slate-500 font-medium">{data.candidate.role}</p>
          </div>
        </div>
        <StatusBadge status={data.status} />
      </div>

      {/* Body: Time, Platform/Status */}
      <div className={`p-4 rounded-2xl mb-6 ${isCancelled ? 'bg-red-50/50' : 'bg-slate-50'}`}>
        {isCancelled ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500 font-bold text-body">
              <XCircle size={16} /> {data.cancelReason}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-body">
              <Calendar size={16} /> {data.originalTime}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
             <div className="flex items-center gap-2.5 text-slate-700 font-bold text-body">
                <Clock size={16} className="text-slate-400" /> {data.time}
             </div>
             
             {isCompleted ? (
                <div className="flex items-center gap-2.5 text-primary font-bold text-body">
                  <Bot size={16} /> {data.platform}
                </div>
             ) : (
                <div className="flex items-center gap-2.5 text-blue-600 font-bold text-body">
                   <Video size={16} /> {data.platform}
                </div>
             )}
          </div>
        )}
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
        {isCancelled ? (
          <>
            <button className="text-body font-bold text-slate-500 hover:text-slate-700 transition-colors">
              View History
            </button>
            <button className="flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-body transition-colors">
              <RotateCw size={16} /> Reschedule
            </button>
          </>
        ) : isCompleted ? (
           <>
            <button className="text-body font-bold text-primary hover:text-primary-dark transition-colors">
              View Summary
            </button>
            <div className="flex gap-2 text-slate-300">
               <button className="hover:text-slate-500 p-1"><ThumbsUp size={18} /></button>
            </div>
          </>
        ) : (
          <>
            <button className="text-body font-bold text-primary hover:text-primary-dark transition-colors">
              View Details
            </button>
            <div className="flex gap-1 text-slate-300">
              <button className="hover:text-slate-500 hover:bg-slate-50 p-2 rounded-lg transition-colors"><CalendarDays size={18} /></button>
              <button className="hover:text-red-500 hover:bg-slate-50 p-2 rounded-lg transition-colors"><XCircle size={18} /></button>
            </div>
          </>
        )}
      </div>

    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Cancelled: "bg-rose-50 text-rose-500 border-rose-100"
  }

  const defaultStyle = "bg-slate-50 text-slate-600 border-slate-200"

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-label font-bold border",
      styles[status] || defaultStyle
    )}>
      {status}
    </span>
  )
}