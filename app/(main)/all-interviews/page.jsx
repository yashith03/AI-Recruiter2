// app/(main)/all-interviews/page.jsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Video
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import moment from 'moment'
import { toast } from 'sonner'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const PremiumInterviewCard = ({ interview }) => {
  const url = process.env.NEXT_PUBLIC_BASE_URL + "/" + interview?.interview_id;
  const candidatesCount = interview["interview-feedback"]?.length || 0;
  
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard");
  };

  const onInvite = () => {
    const mailto = `mailto:?subject=AI Recruiter Interview Invite&body=Please join the interview using this link: ${url}`;
    window.open(mailto, "_blank");
  };

  // Icon mapping based on job position or type
  const getIcon = () => {
    const title = interview?.jobPosition?.toLowerCase() || '';
    if (title.includes('developer') || title.includes('engineer') || title.includes('code')) return <Code className="h-5 w-5 text-blue-500" />;
    if (title.includes('designer') || title.includes('ux') || title.includes('product')) return <PenTool className="h-5 w-5 text-purple-500" />;
    if (title.includes('marketer') || title.includes('sales')) return <Megaphone className="h-5 w-5 text-green-500" />;
    return <Package className="h-5 w-5 text-orange-500" />;
  };

  const getBgColor = () => {
    const title = interview?.jobPosition?.toLowerCase() || '';
    if (title.includes('developer')) return 'bg-blue-50';
    if (title.includes('designer')) return 'bg-purple-50';
    if (title.includes('marketer')) return 'bg-green-50';
    return 'bg-orange-50';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 border-b-4 border-b-transparent hover:border-b-primary group">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`p-3 rounded-xl ${getBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className="text-h3 text-slate-900 leading-tight group-hover:text-primary transition-colors">{interview?.jobPosition}</h3>
            <span className="text-label text-slate-400 font-bold uppercase tracking-widest mt-1">
              {interview?.jobDesc?.substring(0, 20)}...
            </span>
          </div>
        </div>
        <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="flex items-center gap-4 text-label text-slate-500 font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5 ">
          <Calendar size={14} className="text-slate-300" />
          {moment(interview?.created_at).format('MMM DD, YYYY')}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-300" />
          {interview?.duration || '60 min'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-label text-slate-400 font-bold uppercase tracking-wider">Pipeline Status</span>
          <span className="text-label text-primary font-black uppercase tracking-wider">{candidatesCount} Active</span>
        </div>
        <Progress value={Math.min(candidatesCount * 10, 100)} className="h-1.5 bg-slate-100" />
        <div className="flex justify-between text-label font-semibold text-slate-400">
          <span>{Math.floor(candidatesCount/2)} Reviewed</span>
          <span>{candidatesCount} Applicants</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button 
          variant="outline" 
          onClick={copyLink}
          className="rounded-xl border-slate-100 text-body text-slate-600 font-bold h-10 gap-2 hover:bg-slate-50"
        >
          <LinkIcon size={14} /> Copy Link
        </Button>
        <Button 
          onClick={onInvite}
          className="rounded-xl bg-primary hover:bg-primary-dark text-body font-bold h-10 gap-2 text-white shadow-sm shadow-primary/10"
        >
          <Send size={14} /> Invite
        </Button>
      </div>
    </div>
  );
};

export default function AllInterviews() {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const GetInterviewList = useCallback(async () => {
    if (!user?.email) return;
    
    setLoading(true);
    let { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('userEmail', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error.message);
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
          <h1 className="text-h1 text-slate-900 mb-2">All Interviews</h1>
          <p className="text-body text-slate-500 font-medium">Manage your active interview pipelines and candidates.</p>
        </div>
        <Link href="/dashboard/create-interview">
          <Button className="bg-primary hover:bg-primary-dark text-white text-body font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 gap-3">
            <Plus size={20} /> Create New Interview
          </Button>
        </Link>
      </div>

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
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-50 animate-pulse border border-slate-100" />
          ))
        ) : (
          <>
            {interviewList.map((interview, index) => (
              <PremiumInterviewCard interview={interview} key={index} />
            ))}
            
            {/* Create New Card */}
            <Link href="/dashboard/create-interview">
              <div className="h-full min-h-[280px] rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center p-8 cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-slate-50 group-hover:bg-primary/10 flex items-center justify-center text-slate-300 group-hover:text-primary transition-all mb-5">
                  <Plus size={36} />
                </div>
                <h4 className="text-h3 text-slate-800 mb-2">Create New Interview</h4>
                <p className="text-body text-slate-400 text-center">Start hiring for a new role in minutes.</p>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-100">
        <p className="text-label text-slate-400 font-bold uppercase tracking-wider">
          Showing <span className="text-slate-900">1-{interviewList.length}</span> of <span className="text-slate-900">{interviewList.length}</span> interviews
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-slate-200 text-slate-400" disabled>
            <ChevronLeft size={18} />
          </Button>
          <Button className="rounded-xl h-9 w-9 bg-primary text-white text-body font-black">1</Button>
          <Button variant="ghost" className="rounded-xl h-9 w-9 text-slate-500 text-body font-bold">2</Button>
          <Button variant="ghost" className="rounded-xl h-9 w-9 text-slate-500 text-body font-bold">3</Button>
          <span className="text-slate-300 px-1">...</span>
          <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 border-slate-200 text-slate-600">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}