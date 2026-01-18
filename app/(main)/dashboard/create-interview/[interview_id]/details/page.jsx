// app/(main)/dashboard/create-interview/[interview_id]/details/page.jsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  FileText, 
  Clock, 
  HelpCircle,
  Plus,
  GripVertical,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function InterviewDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const interviewId = params.interview_id;

  // Mock State for Form Fields
  const [formData, setFormData] = useState({
    interviewName: "Senior Frontend Developer - Q3",
    jobRole: "Senior Frontend Engineer",
    jobDescription: "We are looking for an experienced Frontend Developer to join our team. The ideal candidate will have strong experience with React, TypeScript, and modern CSS frameworks. You will be responsible for building performant and accessible user interfaces.",
    interviewType: "Technical",
    duration: "30m",
    language: "English (US)",
  });

  const questions = [
    {
      id: 1,
      title: "Introduction",
      text: "Hi, I'm Sarah. Thanks for joining me today. Could you briefly introduce yourself and tell me about your background in frontend development?",
    },
    {
      id: 2,
      title: "React Experience",
      text: "Tell me about a challenging UI problem you solved using React hooks. How did you approach the solution?",
    },
    {
      id: 3,
      title: "State Management",
      text: "What state management libraries have you used, and when would you choose Redux over React Context?",
    }
  ];

  // State for success modal
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSuccessOpen(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 font-body">
      {/* Top Navigation / Breadcrumbs */}
      <div className="px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/interviews" className="hover:text-primary transition-colors">Interviews</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Senior Frontend Dev</span>
          <span>/</span>
          <span className="text-slate-900 font-medium">Edit</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Edit Interview</h1>
            <p className="text-slate-500">Modify the settings and questions for the Senior Frontend Developer interview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200">
              Discard
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20">
              Save Changes
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. General Information */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">General Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Interview Name</label>
                <Input 
                  value={formData.interviewName} 
                  onChange={(e) => setFormData({...formData, interviewName: e.target.value})}
                  className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Interview Type</label>
                <Select defaultValue={formData.interviewType}>
                  <SelectTrigger className="bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Screening">Phone Screening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-sm font-semibold text-slate-700">Job Role</label>
              <Input 
                value={formData.jobRole} 
                onChange={(e) => setFormData({...formData, jobRole: e.target.value})}
                className="bg-slate-50/50 border-slate-200 focus:bg-white transition-all" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Job Description</label>
              <Textarea 
                value={formData.jobDescription} 
                onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:bg-white transition-all resize-y" 
              />
            </div>
          </section>

          {/* 2. Call Settings */}
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Call Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Call Duration</label>
                <div className="grid grid-cols-4 gap-2 bg-slate-100/50 p-1 rounded-xl border border-slate-200 max-w-md">
                  {["15m", "30m", "45m", "60m"].map((dur) => (
                    <button
                      key={dur}
                      onClick={() => setFormData({...formData, duration: dur})}
                      className={`text-sm font-medium py-2 rounded-lg transition-all ${
                        formData.duration === dur 
                          ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <label className="text-sm font-semibold text-slate-700">Language</label>
                <Select defaultValue={formData.language}>
                  <SelectTrigger className="bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="English (UK)">English (UK)</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

           {/* 5. Interview Questions */}
           <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Interview Questions</h2>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wide">
                {questions.length} Questions
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="group relative flex gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                  <div className="mt-1 text-slate-300 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       {/* <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Q{idx + 1}</span> */}
                       <h3 className="font-bold text-slate-900 text-sm">{q.title}</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{q.text}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4 flex gap-2">
                     {/* Edit/Delete Actions could go here */}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full border-dashed border-2 border-slate-200 bg-slate-50/50 text-primary hover:bg-blue-50 hover:border-blue-200 h-12 rounded-xl font-medium">
              <Plus className="mr-2 w-4 h-4" /> Add Custom Question
            </Button>
          </section>

        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md p-8 flex flex-col items-center text-center gap-6 rounded-2xl">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-2">
            <Check className="w-8 h-8 text-green-500" strokeWidth={3} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Changes saved successfully!</h2>
            <p className="text-slate-500 text-sm">Your interview settings have been updated.</p>
          </div>
          <div className="w-full">
            <Button 
              onClick={() => setIsSuccessOpen(false)} 
              className="w-full bg-primary hover:bg-blue-600 font-semibold h-11 text-base rounded-lg"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
