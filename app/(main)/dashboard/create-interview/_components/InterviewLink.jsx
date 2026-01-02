//app(main)/dashboard/create-interview/_components/InterviewLink.jsx

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Clock, List, Mail, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

function InterviewLink({ interview_id, formData }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview_id}`;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied");
  };

  return (
    <div className="w-full flex flex-col items-center text-center">

      {/* Success Icon */}
      <Image
        src="/check.png"
        alt="Success"
        width={120}
        height={120}
        className="mt-6"
      />

      {/* Heading */}
      {/* Heading */}
      <h2 className="text-h2 text-slate-900 mt-6">Your AI Interview is Ready!</h2>
      <p className="text-body-lg text-slate-500 mt-2">
        Share this link with your candidates to start the assessment process.
      </p>

      {/* Box: Interview Link */}
      <div className="w-full bg-white p-8 rounded-3xl mt-8 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-h3 text-slate-900">Interview Link</h2>
          <span className="text-label text-blue-600 bg-blue-50 p-1 px-4 rounded-full font-bold">
            Valid for 30 days
          </span>
        </div>

        {/* Link input + Copy Button */}
        <div className="flex gap-3 items-center">
          <Input 
            value={url} 
            readOnly 
            className="h-11 rounded-xl border-slate-100 bg-slate-50/50 text-body font-medium" 
          />
          <Button 
            onClick={onCopyLink} 
            className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-body font-bold shadow-lg shadow-primary/20 flex gap-2 items-center"
          >
            <Copy size={18} /> Copy Link
          </Button>
        </div>

        <div className="h-px bg-slate-50 w-full my-6" />

        {/* Info Row */}
        <div className="flex gap-8 text-label text-slate-400 font-bold uppercase tracking-wider">
          <p className="flex items-center gap-2">
            <Clock size={16} className="text-slate-300" /> {formData?.duration || '15 Min'}
          </p>
          <p className="flex items-center gap-2">
            <List size={16} className="text-slate-300" /> 10 Questions
          </p>
        </div>
      </div>

      {/* Share via */}
      <div className="w-full bg-white p-8 rounded-3xl mt-6 shadow-sm border border-slate-100 text-left">
        <h2 className="text-h3 text-slate-900 mb-6">Share via</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3">
            <Mail size={18} className="text-slate-400" /> Email
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3">
            <MessageSquare size={18} className="text-slate-400" /> Slack
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3">
            <MessageSquare size={18} className="text-slate-400" /> WhatsApp
          </Button>
        </div>
      </div>

      {/* Back + Create New */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 mt-10 pb-10">
        <Link href="/dashboard" className="w-full sm:w-auto">
          <Button variant="ghost" className="h-11 px-8 rounded-xl text-body text-slate-500 font-bold hover:bg-slate-50 flex gap-2 w-full">
            <ArrowLeft size={18} /> Back to Dashboard
          </Button>
        </Link>

        <Link href="/dashboard/create-interview" className="w-full sm:w-auto">
          <Button className="h-11 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-body font-bold shadow-lg flex gap-2 w-full">
            <Plus size={18} /> Create Another
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
