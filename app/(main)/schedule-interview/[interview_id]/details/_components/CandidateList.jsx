//app/(main)/schedule-interview/[interview_id]/details/_components/CandidateList.jsx

import React from 'react'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'
import { User, Mail, CheckCircle2, XCircle } from 'lucide-react'

function CandidateList({candidateList}) {
  return (
    <div>
        <div className='flex justify-between items-center mb-10'>
            <h2 className='text-h2 text-slate-900 font-bold'>Candidates ({candidateList?.length || 0})</h2>
            <div className='flex gap-2'>
                <span className='px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm'>
                    {candidateList?.filter(c => c.recommendation === true).length || 0} Recommended
                </span>
            </div>
        </div>

        <div className='space-y-4'>
            {candidateList?.map((candidate, index)=>(
                <div key={index} className='group bg-white p-6 flex flex-col md:flex-row gap-6 items-center justify-between rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-primary/20'>
                    <div className='flex flex-col md:flex-row items-center gap-6 flex-1 w-full'>
                        {/* Profile Icon with First Name */}
                        <div className='relative'>
                            <div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl font-black group-hover:bg-primary group-hover:text-white transition-all'>
                                {candidate?.userName?.[0]}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-white ${candidate?.recommendation ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                {candidate?.recommendation ? <CheckCircle2 size={12} className='text-white' /> : <XCircle size={12} className='text-white' />}
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className='flex-1 text-center md:text-left space-y-1'>
                            <h2 className='text-h3 text-slate-900 font-bold'>{candidate?.userName}</h2>
                            <div className='flex flex-col md:flex-row items-center gap-x-4 gap-y-1 text-slate-500'>
                                <span className='flex items-center gap-1.5 text-body'>
                                    <Mail size={14} className='text-slate-400' />
                                    {candidate?.userEmail}
                                </span>
                                <span className='hidden md:block text-slate-300'>|</span>
                                <span className='text-label font-bold uppercase tracking-wider'>
                                    Completed: {moment(candidate?.created_at).format('MMM DD, YYYY')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Score & Recommendation */}
                    <div className='flex flex-row md:flex-col items-center justify-center gap-6 md:gap-2 min-w-[140px]'>
                        <div className='text-center'>
                            <p className='text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5'>Overall Score</p>
                            <div className='flex items-baseline justify-center gap-0.5'>
                                <span className='text-2xl font-black text-primary'>{candidate?.feedback?.score || candidate?.feedback?.overallScore || '0'}</span>
                                <span className='text-slate-300 font-bold'>/10</span>
                            </div>
                        </div>

                        <div className={`px-4 py-1.5 rounded-xl font-bold text-[10px] uppercase tracking-widest text-center ${candidate?.recommendation ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {candidate?.recommendation ? 'Recommended' : 'Not Recommended'}
                        </div>
                    </div>

                    {/* Feedback Dialog */}
                    <div className='w-full md:w-auto'>
                        <CandidateFeedbackDialog candidate={candidate}/>
                    </div>
                </div>
            ))}

            {candidateList?.length === 0 && (
                <div className='py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200'>
                    <User size={48} className='mx-auto text-slate-300 mb-4' />
                    <h3 className='text-h3 text-slate-800'>No candidates found</h3>
                    <p className='text-body text-slate-500'>Wait for candidates to complete their interviews.</p>
                </div>
            )}
        </div>
    </div>
  )
}

export default CandidateList