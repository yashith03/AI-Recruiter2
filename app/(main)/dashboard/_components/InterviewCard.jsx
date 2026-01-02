// app/(main)/dashboard/_components/InterviewCard.jsx

"use client"
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Send, 
  ArrowRight, 
  Clock, 
  Users, 
  Calendar, 
  Code, 
  PenTool, 
  Megaphone, 
  Package,
  Edit3
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";

function InterviewCard({ interview }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview?.interview_id}`;
  const candidatesCount = interview["interview-feedback"]?.length || 0;
  const status = interview?.status || 'ACTIVE';

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const onInvite = () => {
    const mailto = `mailto:?subject=AI Recruiter Interview Invite&body=Please join the interview using this link: ${url}`;
    window.open(mailto, "_blank");
  };

  const getIcon = () => {
    const title = interview?.jobPosition?.toLowerCase() || '';
    if (title.includes('developer') || title.includes('engineer') || title.includes('code')) return <Code size={20} className="text-blue-500" />;
    if (title.includes('designer') || title.includes('ux') || title.includes('product')) return <PenTool size={20} className="text-orange-500" />;
    if (title.includes('marketer') || title.includes('sales')) return <Megaphone size={20} className="text-purple-500" />;
    return <Package size={20} className="text-slate-500" />;
  };

  const getBgColor = () => {
    const title = interview?.jobPosition?.toLowerCase() || '';
    if (title.includes('developer')) return 'bg-blue-50';
    if (title.includes('designer')) return 'bg-orange-50';
    if (title.includes('marketer')) return 'bg-purple-50';
    return 'bg-slate-50';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Role Info */}
        <div className="flex items-start gap-5">
          <div className={`p-4 rounded-2xl ${getBgColor()} flex items-center justify-center shrink-0`}>
            {getIcon()}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-h3 text-slate-900 group-hover:text-primary transition-colors">
                {interview?.jobPosition}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-label ${
                status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-body text-slate-500 line-clamp-1 max-w-lg">
              {interview?.jobDescription || 'No description provided for this role.'}
            </p>
            
            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-helper text-slate-400">
                <Clock size={16} className="text-slate-300" />
                {interview?.duration || '45 mins'}
              </div>
              <div className="flex items-center gap-2 text-helper text-slate-400">
                <Users size={16} className="text-slate-300" />
                {candidatesCount} Candidates
              </div>
              <div className="flex items-center gap-2 text-helper text-slate-400">
                <Calendar size={16} className="text-slate-300" />
                Created {moment(interview?.created_at).format('MMM DD')}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
          <button 
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2.5 text-body font-bold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
          >
            <Copy size={16} /> <span className="hidden sm:inline">Copy Link</span>
          </button>
          
          <button 
            onClick={onInvite}
            className="flex items-center gap-2 px-4 py-2.5 text-body font-bold text-slate-600 hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
          >
            <Send size={16} /> <span className="hidden sm:inline">Invite</span>
          </button>

          <div className="w-[1px] h-8 bg-slate-100 mx-1 hidden sm:block" />

          {status === 'DRAFT' ? (
            <Link href={`/dashboard/create-interview/${interview?.interview_id}`}>
              <Button className="bg-white border text-slate-800 hover:bg-slate-50 text-body font-bold h-11 px-6 rounded-xl gap-2">
                <Edit3 size={16} /> Resume Draft
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/create-interview/${interview?.interview_id}/details`}>
              <Button className="bg-primary hover:bg-primary-dark text-white text-body font-bold h-11 px-6 rounded-xl gap-2 shadow-lg shadow-primary/20">
                View Details <ArrowRight size={16} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewCard;
