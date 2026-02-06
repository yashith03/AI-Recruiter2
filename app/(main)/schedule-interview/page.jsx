// app/(main)/schedule-interview/page.jsx

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
  Bot,
  User,
  Layout,
  Briefcase,
  Trash2,
  History,
  Brain
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
import PageHeader from '../_components/PageHeader'
import CreditBadge from '../_components/CreditBadge'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import { fetchScheduledInterviews } from '@/services/queries/interviews'
import moment from 'moment'
import { toast } from 'sonner'

export default function ScheduleInterviewPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { user, isAuthLoading } = useUser()
  const queryClient = useQueryClient()

  const { data: interviewList = [], isLoading, refetch } = useQuery({
    queryKey: ['interviews', 'scheduled', user?.email],
    queryFn: () => fetchScheduledInterviews(user.email),
    enabled: !!user?.email && !isAuthLoading,
  });

  const handleCancelInterview = async (interviewId) => {
    try {
      const { error } = await supabase
        .from('interviews')
        .update({ status: 'cancelled' })
        .eq('interview_id', interviewId);

      if (error) throw error;

      toast.success('Interview cancelled successfully');
      // Invalidate all interview queries to refetch
      queryClient.invalidateQueries(['interviews']);
    } catch (error) {
      console.error('Error cancelling interview:', error);
      toast.error('Failed to cancel interview');
    }
  };

  const handleReschedule = async (interviewId) => {
    try {
      const newDate = prompt('Enter new date (YYYY-MM-DD):');
      if (!newDate) return;

      const { error } = await supabase
        .from('interviews')
        .update({ scheduled_date: newDate })
        .eq('interview_id', interviewId);

      if (error) throw error;

      toast.success('Interview rescheduled successfully');
      // Invalidate queries to trigger refetch
      queryClient.invalidateQueries(['interviews']);
    } catch (error) {
      console.error('Error rescheduling interview:', error);
      toast.error('Failed to reschedule interview');
    }
  };

  const filteredData = interviewList.filter(item => {
    const matchesSearch = item.jobPosition?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-in fade-in duration-700">
      
      {/* Header */}
      <PageHeader
        title="Scheduled Interviews"
        subtitle="Manage your upcoming screenings and active interview links."
        className="mb-8 mt-2"
        actions={
          <>
            <CreditBadge className="h-11" />
            <Link href="/dashboard/create-interview">
              <Button className="bg-primary hover:bg-primary-dark text-white text-body font-bold px-6 h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex gap-2">
                <Plus size={18} /> Create New Interview
              </Button>
            </Link>
          </>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-10 flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search by role..." 
            className="pl-10 h-11 bg-slate-50 border-slate-100 rounded-xl focus-visible:ring-primary text-body"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-white border-slate-200">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between h-[300px]">
                {/* Header Skeleton */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 w-full">
                    <div className="h-14 w-14 rounded-full bg-slate-50 animate-pulse shrink-0" />
                    <div className="space-y-2 w-full">
                       <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
                       <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-20 bg-slate-50 rounded-full animate-pulse" />
                </div>
                
                {/* Body/Time Skeleton */}
                <div className="p-4 rounded-2xl bg-slate-50 mb-6 space-y-3">
                   <div className="h-4 w-24 bg-white rounded animate-pulse" />
                   <div className="h-4 w-32 bg-white rounded animate-pulse" />
                   <div className="h-3 w-40 bg-white/50 rounded animate-pulse" />
                </div>

                {/* Footer Actions Skeleton */}
                <div className="flex gap-3 border-t border-slate-50 pt-4 mt-auto">
                   <div className="h-11 flex-1 bg-slate-100 rounded-xl animate-pulse" />
                   <div className="h-11 w-24 bg-slate-50 rounded-xl animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm">
              <Calendar size={40} />
            </div>
            <h3 className="text-h1 text-slate-800 mb-2">No Active Interviews</h3>
            <p className="text-body-lg text-slate-500 max-w-sm">
              You don&apos;t have any interviews scheduled or in progress at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <h3 className="text-h3 text-slate-900 border-b border-slate-100 pb-2">Active Roles & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map(interview => (
                <InterviewCard 
                  key={interview.id} 
                  data={interview} 
                  onCancel={() => handleCancelInterview(interview.interview_id)}
                  onReschedule={() => handleReschedule(interview.interview_id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InterviewCard({ data, onCancel, onReschedule }) {
  const feedbacks = data['interview-feedback'] || [];
  const activeFeedback = feedbacks.find(fb => fb.summary_status === 'processing');
  
  const isCancelled = data.status === 'cancelled';
  const isProcessing = activeFeedback || data.status === 'in_progress';
  
  // Format types (handle string or array)
  const interviewTypes = Array.isArray(data.type) ? data.type.join(', ') : data.type;

  return (
    <div className={cn(
      "bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-slate-200 transition-all duration-300 group relative",
      isCancelled && "opacity-90"
    )}>
      
      {/* Header: Icon, Role, Types, Badge */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-sm relative overflow-hidden",
            isCancelled ? "bg-slate-100 text-slate-400" : "bg-primary/5 text-primary"
          )}>
             <Briefcase size={28} className={isCancelled ? "grayscale" : ""} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className={cn(
                "text-body-lg font-bold line-clamp-1",
                isCancelled ? "text-slate-500" : "text-slate-900"
              )}>
                {data.jobPosition}
              </h4>
            </div>
            <p className="text-body text-slate-500 font-medium line-clamp-1">{interviewTypes || 'General Interview'}</p>
          </div>
        </div>
        <StatusBadge status={isCancelled ? "Cancelled" : (isProcessing ? "In Progress" : "Upcoming")} />
      </div>

      {/* Body: Time, Platform/Status */}
      <div className={cn(
         "p-4 rounded-2xl mb-6",
         isCancelled ? "bg-rose-50/50" : "bg-slate-50"
      )}>
        <div className="space-y-3">
           {isCancelled ? (
             <>
               <div className="flex items-center gap-2.5 text-rose-500 font-bold text-body">
                  <XCircle size={16} /> Cancelled by Recruiter
               </div>
               <div className="flex items-center gap-2.5 text-slate-400 text-body font-medium">
                  <Calendar size={16} /> Originally {moment(data.created_at).format('MMM DD, h:mm A')}
               </div>
             </>
           ) : (
             <>
               <div className="flex items-center gap-2.5 text-slate-700 font-bold text-body">
                  <Clock size={16} className="text-slate-400" /> {data.duration || '45 mins'}
               </div>
               
               {isProcessing ? (
                  <div className="flex items-center gap-2.5 text-amber-600 font-bold text-body">
                     <Bot size={16} /> Currently Participating
                  </div>
               ) : (
                  <div className="flex items-center gap-2.5 text-blue-600 font-bold text-body">
                     <Layout size={16} /> Link Ready
                  </div>
               )}
               
               <div className="flex items-center gap-2.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <Calendar size={14} /> Created {moment(data.created_at).format('MMM DD, YYYY')}
               </div>
             </>
           )}
        </div>
      </div>

      {/* Footer: Actions */}
      <div className="flex items-center gap-3 border-t border-slate-50 pt-4 mt-auto">
        {isCancelled ? (
          <>
            <button className="text-body font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2">
               View History
            </button>
            <button 
               onClick={onReschedule}
               className="flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-body transition-colors ml-auto"
            >
               <RotateCw size={16} /> Reschedule
            </button>
          </>
        ) : (
          <>
            <Link href={`/dashboard/create-interview/${data.interview_id}/details`} className="flex-1">
              <Button variant="outline" className="w-full text-body font-bold text-primary border-primary/20 hover:bg-primary/5 hover:text-primary-dark transition-colors flex items-center justify-center gap-2 h-11 rounded-xl">
                View Details
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={onCancel}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors h-11 px-3 rounded-xl flex items-center gap-2 font-bold text-body"
            >
              <XCircle size={18} /> Cancel
            </Button>
          </>
        )}
      </div>

    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "In Progress": "bg-amber-50 text-amber-600 border-amber-100",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
    Cancelled: "bg-rose-50 text-rose-500 border-rose-100"
  }

  const defaultStyle = "bg-slate-50 text-slate-600 border-slate-200"

  return (
    <span className={cn(
      "px-2.5 py-1 rounded-full text-label font-bold border whitespace-nowrap",
      styles[status] || defaultStyle
    )}>
      {status}
    </span>
  )
}