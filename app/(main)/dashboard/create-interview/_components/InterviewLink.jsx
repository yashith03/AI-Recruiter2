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
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/${interview_id}`;

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
      <h2 className="font-bold text-2xl mt-3">Your AI Interview is Ready!</h2>
      <p className="text-gray-600 mt-1">
        Share this link with your candidates to start the interview process
      </p>

      {/* Box: Interview Link */}
      <div className="w-full bg-white p-6 rounded-xl mt-6 shadow-sm border">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Interview Link</h2>
          <span className="text-blue-600 bg-blue-50 p-1 px-3 rounded-full text-sm">
            Valid for 30 days
          </span>
        </div>

        {/* Link input + Copy Button */}
        <div className="mt-3 flex gap-3 items-center">
          <Input value={url} disabled />
          <Button onClick={onCopyLink} className="flex gap-2 items-center">
            <Copy className="w-4 h-4" /> Copy Link
          </Button>
        </div>

        <hr className="my-5" />

        {/* Info Row */}
        <div className="flex gap-6 text-gray-500 text-sm">
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {formData?.duration}
          </p>
          <p className="flex items-center gap-2">
            <List className="w-4 h-4" /> 10 Questions
          </p>
        </div>
      </div>

      {/* Share via */}
      <div className="w-full bg-white p-6 rounded-xl mt-6 shadow-sm border">
        <h2 className="font-bold text-lg">Share via</h2>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Button variant="outline" className="w-full flex gap-2">
            <Mail size={16} /> Email
          </Button>
          <Button variant="outline" className="w-full flex gap-2">
            <MessageSquare size={16} /> Slack
          </Button>
          <Button variant="outline" className="w-full flex gap-2">
            <MessageSquare size={16} /> WhatsApp
          </Button>
        </div>
      </div>

      {/* Back + Create New */}
      <div className="flex w-full justify-between mt-8">
        <Link href="/dashboard">
          <Button variant="outline" className="flex gap-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>

        <Link href="/dashboard/create-interview">
          <Button className="flex gap-2">
            <Plus size={16} /> Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default InterviewLink;
