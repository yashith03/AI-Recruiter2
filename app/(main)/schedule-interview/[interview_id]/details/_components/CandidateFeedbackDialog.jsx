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
  const feedback = candidate?.feedback?.feedback;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-5">

              {/* Candidate Info */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5">
                  <h2 className="bg-primary p-3 px-4.5 font-bold text-white rounded-full">
                    {candidate?.userName?.[0]}
                  </h2>

                  <div>
                    <h2 className="font-bold">{candidate?.userName}</h2>
                    <h2 className="text-sm text-gray-500">
                      {candidate?.userEmail}
                    </h2>
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <h2 className="text-primary text-2xl font-bold">
                    {feedback?.overallScore || "0"}/10
                  </h2>
                </div>
              </div>

              {/* Skill Assessment */}
              <div className="mt-5">
                <h2 className="font-bold">Skill Assessment</h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <h2 className="flex justify-between">
                      Technical Skills
                      <span>{feedback?.rating?.technicalSkills}/10</span>
                    </h2>
                    <Progress
                      value={(feedback?.rating?.technicalSkills || 0) * 10}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Communication
                      <span>{feedback?.rating?.communication}/10</span>
                    </h2>
                    <Progress
                      value={(feedback?.rating?.communication || 0) * 10}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Problem Solving
                      <span>{feedback?.rating?.problemSolving}/10</span>
                    </h2>
                    <Progress
                      value={(feedback?.rating?.problemSolving || 0) * 10}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <h2 className="flex justify-between">
                      Experience
                      <span>{feedback?.rating?.experience}/10</span>
                    </h2>
                    <Progress
                      value={(feedback?.rating?.experience || 0) * 10}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-5">
                <h2 className="font-bold">Performance Summary</h2>

                <div className="p-5 bg-secondary my-3 rounded-md space-y-2">
                  {feedback?.summary?.map((summary, index) => (
                    <p key={index}>{summary}</p>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div
                className={`p-5 mt-10 flex items-center justify-between rounded-md ${
                  feedback?.Recommendation === "No"
                    ? "bg-red-100"
                    : "bg-green-100"
                }`}
              >
                <div>
                <h2
                  className={`font-bold ${
                    feedback?.Recommendation === "No"
                      ? "text-red-700"
                      : "text-green-700"
                  }`}
                >
                  Recommendation
                </h2>

                <p
                  className={`mt-1 ${
                    feedback?.Recommendation === "No"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {feedback?.RecommendationMsg}
                </p>
              </div>
                <Button className={`${
                  feedback?.Recommendation === "No"
                    ? "bg-red-700"
                    : "bg-green-700"
                }`}>Send Msg</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;
