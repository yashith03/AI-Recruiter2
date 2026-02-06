// app/(main)/all-interviews/page.jsx

'use client'

import React, { useState } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  Briefcase, 
  Code, 
  PenTool, 
  Megaphone, 
  Package, 
  MoreVertical, 
  X, 
  Send, 
  Link as LinkIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Video,
  Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/app/provider'
import { fetchAllInterviews } from '@/services/queries/interviews'
import moment from 'moment'
import { toast } from 'sonner'
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

export default function AllInterviews() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { user, isAuthLoading } = useUser();

  const { data: interviewList = [], isLoading, refetch } = useQuery({
    queryKey: ['interviews', 'all', user?.email],
    queryFn: () => fetchAllInterviews(user.email),
    enabled: !!user?.email && !isAuthLoading,
  });

  // Pagination Logic
  const totalPages = Math.ceil(interviewList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = interviewList.slice(startIndex, endIndex);

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <PageHeader
        title="All Interviews"
        subtitle="Manage your active interview pipelines and candidates."
        actions={
          <>
            <CreditBadge />
            <Link href="/dashboard/create-interview">
              <Button className="bg-primary hover:bg-primary-dark text-white text-body font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-3">
                <Plus size={20} /> Create New Interview
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
            placeholder="Search by job title, candidate..." 
            className="pl-11 rounded-xl border-slate-100 bg-slate-50/50 focus-visible:ring-primary h-11 text-body font-medium"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-[120px] rounded-xl border-slate-100 bg-white h-11 text-body font-bold text-slate-600">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="active" className="text-body font-medium">Active</SelectItem>
              <SelectItem value="closed" className="text-body font-medium">Closed</SelectItem>
              <SelectItem value="draft" className="text-body font-medium">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="rounded-xl border-slate-100 h-11 px-4 text-body font-bold text-slate-600 gap-2 hover:bg-slate-50">
            <Calendar size={16} className="text-slate-400" /> Date Range
          </Button>

          <Button variant="outline" className="rounded-xl border-slate-100 h-11 px-4 text-body font-bold text-slate-600 gap-2 hover:bg-slate-50">
            <Briefcase size={16} className="text-slate-400" /> Job Type
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
            {currentData.map((interview, index) => (
              <PremiumInterviewCard 
                interview={interview} 
                key={index} 
                onRefresh={refetch}
              />
            ))}
            
            {/* Create New Card - Only show on the last page or if list is empty */}
            {(currentPage === totalPages || interviewList.length === 0) && (
              <Link href="/dashboard/create-interview">
                <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-8 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all mb-5">
                    <Plus size={36} />
                  </div>
                  <h4 className="text-h3 text-slate-800 mb-2">Create New Interview</h4>
                  <p className="text-body text-slate-400 text-center">Start hiring for a new role in minutes.</p>
                </div>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && interviewList.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100">
          <p className="text-label text-slate-400 font-bold uppercase tracking-wider">
            Showing <span className="text-slate-900">{Math.min(startIndex + 1, interviewList.length)}-{Math.min(endIndex, interviewList.length)}</span> of <span className="text-slate-900">{interviewList.length}</span> interviews
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-xl h-9 w-9 border-slate-200 text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft size={18} />
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map(page => (
              <Button 
                key={page}
                onClick={() => setCurrentPage(page)}
                variant={currentPage === page ? "default" : "ghost"}
                className={`rounded-xl h-9 w-9 text-body font-bold ${
                  currentPage === page 
                    ? "bg-primary text-white" 
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {page}
              </Button>
            ))}
            
            {totalPages > 5 && <span className="text-slate-300 px-1">...</span>}

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-xl h-9 w-9 border-slate-200 text-slate-600 disabled:opacity-50"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
