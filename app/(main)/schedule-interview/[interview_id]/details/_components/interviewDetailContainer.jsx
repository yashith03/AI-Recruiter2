// app/(main)/schedule-interview/[interview_id]/details/_components/interviewDetailContainer.jsx

import React from "react"
import { Clock, Calendar, Code, Edit2, Trash2, Cpu } from "lucide-react"
import moment from "moment"
import { cn } from "@/lib/utils"

function InterviewDetailContainer({ interviewDetail }) {
  if (!interviewDetail) return null

  const types = Array.isArray(interviewDetail.type)
    ? interviewDetail.type
    : typeof interviewDetail.type === "string"
      ? interviewDetail.type.split(",").map(t => t.trim())
      : []

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-12 shadow-sm relative overflow-hidden">
      {/* Header Actions */}
      <div className="absolute top-8 right-8 flex items-center gap-3">
        <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all hover:bg-primary/5">
          <Edit2 size={18} />
        </button>
        <button className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 transition-all hover:bg-red-50">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="max-w-4xl">
        {/* Title */}
        <h2 className="text-3xl font-black text-slate-900 mb-8">{interviewDetail.jobPosition}</h2>

        {/* Info Stats Row */}
        <div className="flex flex-wrap items-center gap-8 mb-12">
          {/* Duration */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Duration</p>
              <p className="text-body font-bold text-slate-900">{interviewDetail.duration || '30 Min'}</p>
            </div>
          </div>

          {/* Created On */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Created On</p>
              <p className="text-body font-bold text-slate-900">{moment(interviewDetail.created_at).format("DD-MM-YYYY")}</p>
            </div>
          </div>

          {/* Type */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500">
              <Code size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Type</p>
              <p className="text-body font-bold text-slate-900 capitalize">{types[0] || 'Technical'}</p>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-12">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-4">Job Description</h3>
          <p className="text-body-lg text-slate-600 leading-relaxed max-w-3xl">
            {interviewDetail.jobDescription}
          </p>
        </div>

        {/* Questions List */}
        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6">AI-Generated Interview Questions</h3>
          <div className="space-y-4 overflow-visible">
            {interviewDetail.questionList?.map((item, index) => (
              <div key={index} className="bg-slate-50/50 border border-slate-100/50 p-6 rounded-[24px] hover:border-primary/20 transition-all flex items-start gap-6 group">
                <div className="text-primary font-black text-2xl flex-shrink-0 pt-1 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                   <p className="text-[15px] font-semibold text-slate-700 leading-relaxed">
                    {item?.question || item?.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterviewDetailContainer
