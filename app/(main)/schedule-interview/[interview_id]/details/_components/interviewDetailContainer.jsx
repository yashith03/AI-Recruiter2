// app/(main)/schedule-interview/[interview_id]/details/_components/interviewDetailContainer.jsx

import React from "react"
import { Clock, Calendar } from "lucide-react"
import moment from "moment"

function InterviewDetailContainer({ interviewDetail }) {
  if (!interviewDetail) return null

  const types = Array.isArray(interviewDetail.type)
    ? interviewDetail.type
    : typeof interviewDetail.type === "string"
      ? interviewDetail.type.split(",").map(t => t.trim())
      : []

  return (
    <div className="p-5 bg-white rounded-lg mt-5">
      <h2 className="text-xl font-bold">{interviewDetail.jobPosition}</h2>

      <div className="mt-4 flex items-center justify-between lg:pr-52">
        <div>
          <h2 className="text-xs text-gray-500">Duration</h2>
          <h2 className="flex text-md font-bold items-center gap-2">
            <Clock className="h-4 w-4" />
            {interviewDetail.duration}
          </h2>
        </div>

        <div>
          <h2 className="text-xs text-gray-500">Created On</h2>
          <h2 className="flex text-md font-bold items-center gap-2">
            <Calendar className="h-4 w-4" />
            {moment(interviewDetail.created_at).format("DD-MM-YYYY")}
          </h2>
        </div>

        {types.length > 0 && (
          <div>
            <h2 className="text-xs text-gray-500">Type</h2>
            <h2 className="flex text-md font-bold items-center gap-2">
              {types[0]}
            </h2>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h2 className="font-bold">Job Description</h2>
        <p className="text-sm leading-6">{interviewDetail.jobDescription}</p>
      </div>

      <div className="mt-5">
        <h2 className="font-bold">Interview Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {interviewDetail.questionList?.map((item, index) => (
            <h2 key={index} className="text-xs flex">
              {index + 1}. {item?.question}
            </h2>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InterviewDetailContainer
