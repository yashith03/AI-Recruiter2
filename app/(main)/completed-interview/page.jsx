// app/(main)/completed-interview/page.jsx

'use client'

import React from 'react'
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Loader2,
  X,
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/app/provider'
import { fetchCompletedInterviews } from '@/services/queries/interviews'
import moment from 'moment'
import Link from 'next/link'
import PremiumInterviewCard from '../_components/PremiumInterviewCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PageHeader from '../_components/PageHeader'
import CreditBadge from '../_components/CreditBadge'

export default function CompletedInterviews() {
  const { user, isAuthLoading } = useUser();

  const { data: interviewList = [], isLoading, refetch } = useQuery({
    queryKey: ['interviews', 'completed', user?.email],
    queryFn: () => fetchCompletedInterviews(user.email),
    enabled: !!user?.email && !isAuthLoading,
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <PageHeader
        title="Completed Interviews"
        subtitle="Review feedback for your successfully completed hiring cycles."
        actions={
          <>
            <CreditBadge />
            <Link href="/all-interviews">
              <Button variant="outline" className="rounded-xl border-slate-200 text-body font-bold h-12 px-6 gap-2 hover:bg-slate-50">
                View All Pipelines
              </Button>
            </Link>
          </>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search completed interviews..." 
            className="pl-11 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary h-11 text-body font-medium"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-[120px] rounded-xl border-slate-100 bg-white h-11 text-body font-bold text-slate-600">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="high" className="text-body font-medium">High Score</SelectItem>
              <SelectItem value="low" className="text-body font-medium">Low Score</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="rounded-xl border-slate-100 h-11 px-4 text-body font-bold text-slate-600 gap-2 hover:bg-slate-50">
            <Calendar size={16} className="text-slate-400" /> Completion Date
          </Button>

          <Button variant="ghost" className="text-label text-slate-400 hover:text-red-500 font-black h-11 px-4 uppercase tracking-widest gap-2">
            <X size={14} /> Clear
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col gap-5 border-b-4 border-b-slate-100 h-[380px]">
              {/* Badge Skeleton */}
              <div className="flex justify-end -mt-2 -mr-2">
                 <div className="h-6 w-20 bg-slate-100 rounded-bl-xl animate-pulse" />
              </div>
              
              {/* Header Skeleton */}
              <div className="flex justify-between items-start">
                <div className="flex gap-4 w-full">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 animate-pulse shrink-0" />
                  <div className="space-y-2 w-full">
                    <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-slate-50 rounded animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Date/Time Skeleton */}
              <div className="flex gap-4">
                <div className="h-4 w-24 bg-slate-50 rounded animate-pulse" />
                <div className="h-4 w-20 bg-slate-50 rounded animate-pulse" />
              </div>

              {/* Progress Skeleton */}
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-slate-50 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-slate-50 rounded animate-pulse" />
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded animate-pulse" />
                <div className="flex justify-between">
                   <div className="h-3 w-16 bg-slate-50 rounded animate-pulse" />
                   <div className="h-3 w-16 bg-slate-50 rounded animate-pulse" />
                </div>
              </div>

              {/* Buttons Skeleton */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="h-10 w-full bg-slate-50 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-slate-100 rounded-xl animate-pulse" />
              </div>
            </div>
          ))
        ) : (
          <>
            {interviewList.length === 0 ? (
              <div className="col-span-full py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                   <Video size={40} />
                </div>
                <h3 className="text-h3 text-slate-800 mb-2">No Completed Interviews Yet</h3>
                <p className="text-body text-slate-500 max-w-sm">
                  Interviews will appear here once candidates have finished their sessions and AI feedback is ready.
                </p>
              
              </div>
            ) : (
              interviewList.map((interview, index) => (
                <PremiumInterviewCard 
                interview={interview} 
                key={index} 
                onRefresh={refetch}
              />
              ))
            )}
          </>
        )}
      </div>

      {/* Pagination Footer */}
      {interviewList.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100">
            <p className="text-label text-slate-400 font-bold uppercase tracking-wider">
            Showing <span className="text-slate-900">1-{interviewList.length}</span> of <span className="text-slate-900">{interviewList.length}</span> results
            </p>
            <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-slate-200 text-slate-400" disabled>
                <ChevronLeft size={18} />
            </Button>
            <Button className="rounded-xl h-9 w-9 bg-primary text-white text-body font-black">1</Button>
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-slate-200 text-slate-600">
                <ChevronRight size={18} />
            </Button>
            </div>
        </div>
      )}
    </div>
  )
}
