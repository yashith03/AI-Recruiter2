//app(main)/dashboard/create-interview/_components/InterviewLink.jsx

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Clock, List, Mail, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@/app/provider";

function InterviewLink({ interview_id, formData, onReset }) {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interview_id}`;

  const { user } = useUser();

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link Copied");
  };

  const shareEmail = () => {
    const subject = `Interview Invite: ${formData?.jobPosition || 'AI Interview'}`;
    const body = `Hi there,\n\nYou have been invited to an interview for the position of ${formData?.jobPosition || 'Candidate'}.\n\nPlease join using this link: ${url}\n\nGood luck!`;
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const userEmail = user?.email?.toLowerCase() || '';

    let emailUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

    // Intelligent provider detection
    if (userEmail.includes('@gmail.com') || userEmail.includes('@googlemail.com')) {
      emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${encodedSubject}&body=${encodedBody}`;
    } else if (
      userEmail.includes('@outlook.com') || 
      userEmail.includes('@hotmail.com') || 
      userEmail.includes('@live.com') || 
      userEmail.includes('@msn.com')
    ) {
      emailUrl = `https://outlook.office.com/mail/deeplink/compose?subject=${encodedSubject}&body=${encodedBody}`;
    } else if (userEmail.includes('@yahoo.com')) {
      emailUrl = `https://compose.mail.yahoo.com/?to=&subj=${encodedSubject}&body=${encodedBody}`;
    }

    window.open(emailUrl, '_blank');
  };

  const shareWhatsApp = () => {
    const text = `Hi, please join the interview for ${formData?.jobPosition || 'the position'} using this link: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareSlack = () => {
    // Slack doesn't have a direct "share to channel" URL like WhatsApp/Email without an app, 
    // but we can open the Slack workspace or just copy for manual pasting which is more common.
    // However, to satisfy "opening the app/site", we'll use a deep link/web intent.
    const text = `Interview Link for ${formData?.jobPosition || 'Candidate'}: ${url}`;
    window.open(`https://slack.com/share?text=${encodeURIComponent(text)}`, '_blank');
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
          <Button 
            variant="outline" 
            onClick={shareEmail}
            className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3"
          >
            <Mail size={18} className="text-slate-400" /> Email
          </Button>
          <Button 
            variant="outline" 
            onClick={shareSlack}
            className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3"
          >
            <MessageSquare size={18} className="text-slate-400" /> Slack
          </Button>
          <Button 
            variant="outline" 
            onClick={shareWhatsApp}
            className="h-11 rounded-xl border-slate-100 hover:bg-slate-50 text-body font-bold flex gap-3"
          >
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


        <Button 
          onClick={onReset || (() => window.location.href='/dashboard/create-interview')}
          className="h-11 px-8 rounded-xl bg-primary hover:bg-primary-dark text-body font-bold shadow-lg shadow-primary/20 flex gap-2 w-full sm:w-auto"
        >
          <Plus size={18} /> Create Another
        </Button>
      </div>
    </div>
  );
}

export default InterviewLink;
