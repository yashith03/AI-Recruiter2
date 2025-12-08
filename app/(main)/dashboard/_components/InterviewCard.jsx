// app/(main)/dashboard/_components/InterviewCard.jsx

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Copy, Send, ArrowRight } from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import React from "react";


function InterviewCard({ interview, viewDetail = false }) {
  const url = process.env.NEXT_PUBLIC_BASE_URL + "/" + interview?.interview_id;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast("Copied");
  };

  const onSend = () => {
    window.location.href =
      "mailto:accounts@yashithc.dev@gmail.com?subject=AI Recruiter Interview Link&body=Interview Link " +
      url;
  };

  return (
    <div className="p-5 bg-white w-full rounded-xl border shadow-sm hover:shadow-md transition min-h-[220px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-[45px] w-[45px] rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>

        <h2 className="text-sm font-medium text-gray-600">
          {moment(interview?.created_at).format("DD MMM YYYY")}
        </h2>
      </div>

      {/* Middle section */}
      <div className="flex-1 mt-3">
        <h2 className="font-semibold text-lg text-gray-800">
          {interview?.jobPosition}
        </h2>

        <h2 className="mt-1 text-sm text-gray-500 flex justify-between">
          {interview?.duration}
          <span className="text-green-800">
            {interview["interview-feedback"]?.length} Candidates
          </span>
        </h2>
      </div>

      {/* Footer buttons */}
      {viewDetail ? (
        <Link href={`/schedule-interview/${interview?.interview_id}/details`}>
          <Button className="mt-5 w-full" variant="outline">
            View Detail <ArrowRight className="ml-2" />
          </Button>
        </Link>
      ) : (
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
            onClick={copyLink}
          >
            <Copy className="h-4 w-4" /> Copy Link
          </Button>

          <Button
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onSend}
          >
            <Send className="h-4 w-4" /> Send
          </Button>
        </div>
      )}
    </div>
  );
}

export default InterviewCard;
