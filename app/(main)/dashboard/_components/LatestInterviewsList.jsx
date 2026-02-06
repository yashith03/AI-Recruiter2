// app/(main)/dashboard/_components/LatestInterviewsList.jsx

"use client"

import React from 'react'
import { Search, Filter, ArrowRight, Video, ChevronDown, Calendar, Clock, User, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/app/provider'
import { fetchLatestInterviews } from '@/services/queries/interviews'
import InterviewCard from './InterviewCard'
import Link from 'next/link'
import moment from 'moment' // Added as per instruction, though not used in this snippet

function LatestInterviewsList() {
  const { user, isAuthLoading } = useUser();

  const { data: interviewList = [], isLoading } = useQuery({
    queryKey: ['interviews', 'latest', user?.email],
    queryFn: () => fetchLatestInterviews(user.email),
    enabled: !!user?.email && !isAuthLoading,
  });

  return (
    <div className='my-16 space-y-8'> 
      
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className='text-h2 text-slate-900'>
          Previously Created Interviews
        </h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input 
              placeholder="Search interviews..." 
              className="pl-10 h-11 bg-white border-slate-100 rounded-xl focus-visible:ring-primary shadow-sm text-body"
            />
          </div>
          <Button variant="outline" className="h-11 w-11 p-0 border-slate-100 rounded-xl shadow-sm text-slate-600">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {isLoading && interviewList.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-5 w-full">
                <div className="p-4 rounded-2xl bg-slate-50 shrink-0 h-14 w-14 animate-pulse" />
                <div className="space-y-3 w-full max-w-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-48 bg-slate-100 rounded-lg animate-pulse" />
                    <div className="h-6 w-16 bg-slate-50 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-slate-50 rounded animate-pulse" />
                  <div className="flex gap-6 pt-2">
                    <div className="h-4 w-16 bg-slate-50 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                <div className="h-10 w-24 bg-slate-50 rounded-xl animate-pulse" />
                <div className="h-10 w-24 bg-slate-50 rounded-xl animate-pulse" />
                <div className="h-11 w-32 bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {interviewList.length === 0 ? (
            <div className='p-12 flex flex-col gap-4 items-center bg-white rounded-3xl border border-dashed border-slate-200'>
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <Video size={32} />
              </div>
              <div className="text-center">
                <h3 className='text-h3 text-slate-800'>No Interviews Created</h3>
                <p className="text-body text-slate-500 max-w-xs mx-auto mt-1">
                  You haven&apos;t set up any interview pipelines yet. Start by creating one today.
                </p>
              </div>
              <Link href="/dashboard/create-interview">
                <Button className="mt-2 text-body font-bold rounded-xl px-8 h-12 shadow-lg shadow-primary/20">
                  Create New Interview
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {interviewList.map((interview, index) => (
                <InterviewCard interview={interview} key={index} />
              ))}
              
              <div className="flex justify-center pt-6">
                <Link href="/all-interviews">
                  <button className="flex items-center gap-2 text-body font-bold text-slate-500 hover:text-primary transition-colors group">
                    View All Interviews <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default LatestInterviewsList;
