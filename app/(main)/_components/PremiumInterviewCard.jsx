// app/(main)/_components/PremiumInterviewCard.jsx

'use client'

import React from 'react'
import { 
  Calendar, 
  Code, 
  PenTool, 
  Megaphone, 
  Package, 
  MoreVertical, 
  Send, 
  Link as LinkIcon, 
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import moment from 'moment'
import { toast } from 'sonner'
import Link from 'next/link'

const PremiumInterviewCard = ({ interview }) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview?.interview_id}`;
  const candidatesCount = interview["interview-feedback"]?.length || 0;
  const isCompleted = candidatesCount > 0;
  
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard");
  };

  const onInvite = () => {
    const mailto = `mailto:?subject=AI Recruiter Interview Invite&body=Please join the interview using this link: ${url}`;
    window.open(mailto, "_blank");
  };

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

  const CardContent = (
    <div className={`bg-white h-full rounded-2xl border ${isCompleted ? 'border-emerald-100' : 'border-slate-100'} p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 border-b-4 ${isCompleted ? 'border-b-emerald-500' : 'border-b-transparent hover:border-b-primary'} group relative overflow-hidden ${isCompleted ? 'cursor-pointer hover:bg-slate-50/50' : ''}`}>
      {isCompleted && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
           Completed
        </div>
      )}
      
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className={`p-3 rounded-xl ${getBgColor()}`}>
            {getIcon()}
          </div>
          <div className="flex flex-col">
            <h3 className={`text-h3 text-slate-900 leading-tight transition-colors ${isCompleted ? '' : 'group-hover:text-primary'}`}>{interview?.jobPosition}</h3>
            <span className="text-label text-slate-400 font-bold uppercase tracking-widest mt-1">
              {interview?.jobDescription?.substring(0, 20)}...
            </span>
          </div>
        </div>
        {!isCompleted && (
          <button className="text-slate-400 p-1 hover:bg-slate-50 rounded-lg">
            <MoreVertical size={18} />
          </button>
        )}
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
          <span className={`text-label font-black uppercase tracking-wider ${isCompleted ? 'text-emerald-600' : 'text-primary'}`}>
            {isCompleted ? 'Finished' : `${candidatesCount} Active`}
          </span>
        </div>
        <Progress 
          value={Math.min(candidatesCount * 10, 100)} 
          className={`h-1.5 ${isCompleted ? 'bg-emerald-50 [&>div]:bg-emerald-500' : 'bg-slate-100'}`} 
        />
        <div className="flex justify-between text-label font-semibold text-slate-400">
          <span>{candidatesCount} Reviewed</span>
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
          className={`rounded-xl text-body font-bold h-10 gap-2 shadow-sm ${
            isCompleted 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100' 
            : 'bg-primary hover:bg-primary-dark text-white shadow-primary/10'
          }`}
          disabled={isCompleted}
        >
          <Send size={14} /> Invite
        </Button>
      </div>
    </div>
  );

  if (isCompleted) {
    return (
      <Link href={`/schedule-interview/${interview?.interview_id}/details`} className="block h-full">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default PremiumInterviewCard;
