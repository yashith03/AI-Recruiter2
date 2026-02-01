// app/(main)/completed-interview/page.jsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  Calendar, 
  Briefcase, 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Video,
  Brain
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import Link from 'next/link'
import PremiumInterviewCard from '../_components/PremiumInterviewCard'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CompletedInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const GetInterviewList = useCallback(async () => {
    if (!user?.email) return;
    
    setLoading(true);
    // Fetch interviews that have at least one record in interview-feedback using !inner join
    let { data, error } = await supabase
      .from('interviews')
      .select('*, interview-feedback!interview_feedback_interview_id_fk!inner(*)')
      .eq('userEmail', user.email)
      .order('created_at', { ascending: false })

    if (error) {
        // If no records found, Supabase might return an error or empty array depending on the join
        // We'll treat errors as empty list for now if it's just a 'not found' type error
        console.error('Supabase error:', error.message);
        setInterviewList([]);
    } else {
      setInterviewList(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    GetInterviewList();
  }, [GetInterviewList]);

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-h1 text-slate-900 mb-2">Completed Interviews</h1>
          <p className="text-body text-slate-500 font-medium">Review feedback for your successfully completed hiring cycles.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-4 h-12 rounded-xl border border-slate-100">
            <Brain className="text-primary" size={18} />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Available Credits</span>
              <span className="text-body font-black text-slate-900 font-mono leading-none">{user?.credits || 0}</span>
            </div>
          </div>
          <Link href="/all-interviews">
            <Button variant="outline" className="rounded-xl border-slate-200 text-body font-bold h-12 px-6 gap-2 hover:bg-slate-50">
              View All Pipelines
            </Button>
          </Link>
        </div>
      </div>

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
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />
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
                <PremiumInterviewCard interview={interview} key={index} />
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
