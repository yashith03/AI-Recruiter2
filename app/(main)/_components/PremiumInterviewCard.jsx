// app/(main)/_components/PremiumInterviewCard.jsx

'use client'

import React, { useState } from 'react'
import { 
  Calendar, 
  Code, 
  PenTool, 
  Megaphone, 
  Package, 
  MoreVertical, 
  Send, 
  Link as LinkIcon, 
  Clock,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import moment from 'moment'
import { toast } from 'sonner'
import Link from 'next/link'
import ShareInterviewDialog from './ShareInterviewDialog'

const PremiumInterviewCard = ({ interview, onRefresh }) => {
  const router = useRouter()
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview?.interview_id}`;
  const candidatesCount = interview["interview-feedback"]?.length || 0;
  
  // Status logic
  const getStatusDetails = () => {
    if (candidatesCount > 0) return {
      label: 'Completed',
      badgeClass: 'bg-emerald-500',
      borderClass: 'border-emerald-100',
      bottomClass: 'border-b-emerald-500',
      statusText: 'text-emerald-600',
      progressClass: 'bg-emerald-50 [&>div]:bg-emerald-500',
      pipelineLabel: 'Finished'
    };
    if (interview?.status === 'cancelled') return {
      label: 'Cancelled',
      badgeClass: 'bg-rose-500',
      borderClass: 'border-rose-100',
      bottomClass: 'border-b-rose-500',
      statusText: 'text-rose-600',
      progressClass: 'bg-rose-50 [&>div]:bg-rose-500',
      pipelineLabel: 'Cancelled'
    };
    if (interview?.status === 'in_progress') return {
      label: 'In Progress',
      badgeClass: 'bg-amber-500',
      borderClass: 'border-amber-100',
      bottomClass: 'border-b-amber-500',
      statusText: 'text-amber-600',
      progressClass: 'bg-amber-50 [&>div]:bg-amber-500',
      pipelineLabel: 'Active'
    };
    return {
      label: 'Upcoming',
      badgeClass: 'bg-blue-500',
      borderClass: 'border-blue-100',
      bottomClass: 'border-b-blue-500',
      statusText: 'text-primary',
      progressClass: 'bg-slate-100',
      pipelineLabel: 'Upcoming'
    };
  };

  const status = getStatusDetails();
  const isCompleted = candidatesCount > 0;
  const isActionDisabled = isCompleted || interview?.status === 'cancelled';
  
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('interview_id', interview.interview_id)

      if (error) throw error

      toast.success("Interview deleted successfully")
      if (onRefresh) onRefresh()
    } catch (error) {
      console.error("Error deleting interview:", error)
      toast.error("Failed to delete interview")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const goToDetails = () => {
    router.push(`/schedule-interview/${interview?.interview_id}/details`)
  }

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
    <div className={`bg-white h-full rounded-2xl border ${status.borderClass} p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-5 border-b-4 ${status.bottomClass} group relative overflow-hidden ${isCompleted ? 'cursor-pointer hover:bg-slate-50/50' : ''}`}>
      <div className={`absolute top-0 right-0 ${status.badgeClass} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl`}>
         {status.label}
      </div>
      
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
        <div className="relative">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-colors"
          >
            <MoreVertical size={20} />
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in duration-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    goToDetails();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-body font-bold text-slate-600 hover:bg-slate-50 transition-colors text-left"
                >
                  <Eye size={18} className="text-slate-400" />
                  View Details
                </button>
                <div className="h-px bg-slate-50 mx-2" />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMenuOpen(false);
                    setShowDeleteDialog(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-body font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left"
                >
                  <Trash2 size={18} />
                  Delete Interview
                </button>
              </div>
            </>
          )}
        </div>
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
          <span className={`text-label font-black uppercase tracking-wider ${status.statusText}`}>
            {candidatesCount > 0 ? 'Finished' : status.pipelineLabel}
          </span>
        </div>
        <Progress 
          value={Math.min(candidatesCount * 10, 100)} 
          className={`h-1.5 ${status.progressClass}`} 
        />
        <div className="flex justify-between text-label font-semibold text-slate-400">
          <span>{candidatesCount} Reviewed</span>
          <span>{candidatesCount} Applicants</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button 
          variant="outline" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            copyLink();
          }}
          disabled={interview?.status === 'cancelled'}
          className="rounded-xl border-slate-100 text-body text-slate-600 font-bold h-10 gap-2 hover:bg-slate-50 disabled:opacity-50"
        >
          <LinkIcon size={14} /> Copy Link
        </Button>
        <Button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsShareOpen(true);
          }}
          className={`rounded-xl text-body font-bold h-10 gap-2 shadow-sm ${
            isActionDisabled 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100' 
            : 'bg-primary hover:bg-primary-dark text-white shadow-primary/10'
          }`}
          disabled={isActionDisabled}
        >
          <Send size={14} /> Share
        </Button>
      </div>

      <ShareInterviewDialog 
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        interview={interview}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-3xl border-slate-100 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-h2 text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertTriangle className="text-rose-500" size={24} />
              </div>
              Delete Interview?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-body text-slate-500 py-2">
              This action cannot be undone. This will permanently delete the 
              <span className="font-bold text-slate-900"> {interview?.jobPosition} </span> 
              interview and all associated candidate feedback.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-slate-100 text-body font-bold h-12 px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-body font-bold h-12 px-6 shadow-lg shadow-rose-200"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Interview'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
