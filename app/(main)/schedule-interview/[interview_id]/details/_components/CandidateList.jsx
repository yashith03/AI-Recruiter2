//app/(main)/schedule-interview/[interview_id]/details/_components/CandidateList.jsx

import React from 'react'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'
import { User, Mail, CheckCircle2, XCircle, MoreVertical, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function CandidateList({candidateList}) {
  return (
    <div>
        {/* Section Header */}
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
            <div className='flex items-center gap-3'>
                <h2 className='text-2xl font-black text-slate-900'>Candidates</h2>
                <span className='px-3 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-full'>
                    {candidateList?.length || 0}
                </span>
            </div>
            
            <div className='flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest rounded-full border border-emerald-100/50 shadow-sm'>
                <Share2 size={14} />
                {candidateList?.filter(c => c.recommendation === true).length || 0} Recommended
            </div>
        </div>

        {/* List of Candidates */}
        <div className='bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden'>
            <div className='divide-y divide-slate-50'>
                {candidateList?.map((candidate, index)=>(
                    <div key={index} className='p-8 flex flex-col lg:flex-row items-center gap-8 hover:bg-slate-50/50 transition-all group'>
                        {/* Profile Info */}
                        <div className='flex items-center gap-5 flex-1 min-w-0 w-full'>
                            <div className='relative flex-shrink-0'>
                                <div className='w-16 h-16 bg-slate-200 rounded-3xl overflow-hidden flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform'>
                                    <User size={32} />
                                </div>
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-4 border-white",
                                    candidate?.recommendation ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                )}>
                                    {candidate?.recommendation ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                </div>
                            </div>
                            
                            <div className='min-w-0'>
                                <h3 className='text-h3 text-slate-900 font-bold mb-1 truncate'>{candidate?.userName}</h3>
                                <div className='flex flex-col gap-1'>
                                    <span className='flex items-center gap-2 text-body text-slate-500 truncate'>
                                        <Mail size={14} className='text-slate-300' />
                                        {candidate?.userEmail}
                                    </span>
                                    <span className='text-[10px] font-black uppercase tracking-wider text-slate-300'>
                                        COMPLETED: {moment(candidate?.created_at).format('MMM DD, YYYY')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Score Section */}
                        <div className='flex items-center gap-10'>
                            <div className='flex flex-col items-center gap-2'>
                                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>Overall Score</p>
                                <div className='relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-slate-100 group-hover:border-primary/10 transition-colors'>
                                    <span className='text-xl font-black text-slate-900'>
                                        {candidate?.feedback?.score || candidate?.feedback?.overallScore || '0'}
                                    </span>
                                    {/* Small circle progress effect could go here */}
                                    <div className={cn(
                                        "absolute inset-[-4px] rounded-full border-4 border-transparent border-t-emerald-500 rotate-[45deg]",
                                        candidate?.recommendation ? "border-t-emerald-500" : "border-t-rose-500"
                                    )}></div>
                                </div>
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    candidate?.recommendation ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {candidate?.recommendation ? 'RECOMMENDED' : 'NOT RECOMMENDED'}
                                </p>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='w-full'>
                                    <CandidateFeedbackDialog 
                                        candidate={candidate}
                                        trigger={
                                            <Button className="bg-primary hover:bg-primary-dark text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                                                View Report <Share2 size={16} className='rotate-90' />
                                            </Button>
                                        }
                                    />
                                </div>
                                <button className='w-11 h-11 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all'>
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {candidateList?.length === 0 && (
                <div className='p-20 flex flex-col items-center justify-center text-center'>
                    <div className='w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6'>
                        <User size={40} />
                    </div>
                    <h3 className='text-h3 text-slate-800 mb-2'>Waiting for more candidates...</h3>
                    <p className='text-body text-slate-500 max-w-xs mx-auto'>
                        Share the interview link to start receiving responses.
                    </p>
                </div>
            )}
        </div>
    </div>
  )
}

export default CandidateList
