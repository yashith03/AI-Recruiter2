// app/(main)/schedule-interview/[interview_id]/details/_components/CandidateFeedbackDialog.jsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Candidate Feedback Report</DialogTitle>
          <DialogDescription>
            Detailed performance analysis and feedback for {candidate?.userName}.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Candidate Info */}
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="bg-primary w-12 h-12 flex items-center justify-center font-bold text-white rounded-full text-lg">
                {candidate?.userName?.[0]}
              </div>

              <div>
                <h2 className="font-bold text-slate-900">{candidate?.userName}</h2>
                <h2 className="text-sm text-slate-500">
                  {candidate?.userEmail}
                </h2>
              </div>
            </div>

            <div className="text-center">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Overall Score</span>
              <h2 className="text-primary text-3xl font-black">
                {feedback?.score || feedback?.overallScore || "0"}<span className="text-lg text-slate-300">/10</span>
              </h2>
            </div>
          </div>

          {/* Skill Assessment */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               Skill Assessment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h2 className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                  Technical Skills
                  <span className="font-bold text-slate-900">{feedback?.rating?.technicalSkills}/10</span>
                </h2>
                <Progress
                  value={(feedback?.rating?.technicalSkills || 0) * 10}
                  className="h-2"
                />
              </div>

              <div>
                <h2 className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                  Communication
                  <span className="font-bold text-slate-900">{feedback?.rating?.communication}/10</span>
                </h2>
                <Progress
                  value={(feedback?.rating?.communication || 0) * 10}
                  className="h-2"
                />
              </div>

              <div>
                <h2 className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                  Problem Solving
                  <span className="font-bold text-slate-900">{feedback?.rating?.problemSolving}/10</span>
                </h2>
                <Progress
                  value={(feedback?.rating?.problemSolving || 0) * 10}
                  className="h-2"
                />
              </div>

              <div>
                <h2 className="flex justify-between text-sm font-medium text-slate-600 mb-1">
                  Experience
                  <span className="font-bold text-slate-900">{feedback?.rating?.experience}/10</span>
                </h2>
                <Progress
                  value={(feedback?.rating?.experience || 0) * 10}
                  className="h-2"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-3">Performance Summary</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {feedback?.summary}
            </p>
          </div>

          {/* Recommendation */}
          <div
            className={`p-5 flex items-center justify-between rounded-xl border ${
              (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "not recommended" || (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "no"
                ? "bg-rose-50 border-rose-100"
                : "bg-emerald-50 border-emerald-100"
            }`}
          >
            <div className="flex-1">
              <h3
                className={`font-bold flex items-center gap-2 ${
                  (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "not recommended" || (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "no"
                    ? "text-rose-700"
                    : "text-emerald-700"
                }`}
              >
                Recommendation: {feedback?.recommendation || feedback?.Recommendation}
              </h3>

              <p
                className={`text-sm mt-1 font-medium ${
                  (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "not recommended" || (feedback?.recommendation || feedback?.Recommendation)?.toLowerCase() === "no"
                    ? "text-rose-600/80"
                    : "text-emerald-600/80"
                }`}
              >
                {feedback?.recommendationMsg || feedback?.RecommendationMsg}
              </p>
            </div>
            <Button className={`${
              feedback?.Recommendation?.toLowerCase() === "no"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            } text-white font-bold px-6 h-10 rounded-lg ml-4`}>
              Send Notification
            </Button>
          </div>

          {/* Interview Q&A */}
          <div className="space-y-4 pt-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
               Interview Q&A
            </h3>
            
            <div className="space-y-4">
              {(feedback?.questions || candidate?.asked_questions)?.map((item, index) => (
                <div key={index} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                  {/* Question Header */}
                  <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {item.question || (typeof item === 'string' ? item : '')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-100 shadow-sm whitespace-nowrap">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rating</span>
                      <span className="text-sm font-black text-primary">{item.rating || 'N/A'}/10</span>
                    </div>
                  </div>

                  {/* Answer & Feedback */}
                  {(item.userAnswer || item.feedback) && (
                    <div className="p-4 space-y-4">
                      {item.userAnswer && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Candidate Answer</p>
                          <p className="text-sm text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-50 italic">
                            &quot;{item.userAnswer}&quot;
                          </p>
                        </div>
                      )}
                      
                      {item.feedback && (
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">AI Feedback</p>
                          <div className="text-sm text-slate-700 leading-relaxed font-medium">
                            {item.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {(!(feedback?.questions || candidate?.asked_questions) || (feedback?.questions || candidate?.asked_questions).length === 0) && (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-500">No question data available for this session.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
