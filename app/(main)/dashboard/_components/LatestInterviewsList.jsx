"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Search, Filter, ArrowRight, Video, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from './InterviewCard'
import Link from 'next/link'

function LatestInterviewsList() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const GetInterviewList = useCallback(async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('userEmail', user.email)
      .order('created_at', { ascending: false })
      .limit(3); // Mockup shows 3 items usually for "latest"

    if (error) {
      console.error('Supabase error:', error.message);
    } else {
      setInterviewList(data || []);
    }
    setLoading(false);
  },[user]);

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user, GetInterviewList]);

  return (
    <div className='my-16 space-y-8 animate-in fade-in duration-700 delay-300'> 
      
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

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-slate-50 animate-pulse border border-slate-100" />
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
                  You haven't set up any interview pipelines yet. Start by creating one today.
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
