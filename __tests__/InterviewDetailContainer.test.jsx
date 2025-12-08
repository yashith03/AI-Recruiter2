// __tests__/InterviewDetailContainer.test.jsx

import { render, screen } from "@testing-library/react";
import InterviewDetailContainer from "@/app/(main)/schedule-interview/[interview_id]/details/_components/interviewDetailContainer";

test("renders job details and type array", () => {
  const detail = {
    jobPosition: "Frontend Engineer",
    jobDescription: "Build UI",
    duration: "30 Min",
    created_at: new Date().toISOString(),
    type: ["Video Interview"],
    questionList: [{ question: "Q1" }, { question: "Q2" }],
  };

  render(<InterviewDetailContainer interviewDetail={detail} />);

  expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  expect(screen.getByText("Video Interview")).toBeInTheDocument();
});
