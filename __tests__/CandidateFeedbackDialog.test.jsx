// __tests__/CandidateFeedbackDialog.test.jsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CandidateFeedbackDialog from "@/app/(main)/schedule-interview/[interview_id]/details/_components/CandidateFeedbackDialog";

// Mock shadcn components
jest.mock("@/components/ui/dialog", () => {
  return {
    Dialog: ({ children }) => <div data-testid="dialog">{children}</div>,
    DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
    DialogHeader: ({ children }) => <div data-testid="dialog-header">{children}</div>,
    DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
    DialogDescription: ({ children }) => <div data-testid="dialog-description">{children}</div>,
    DialogTrigger: ({ children }) => <div data-testid="dialog-trigger">{children}</div>,
  };
});

jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }) => <div data-testid="progress-bar" data-value={value} />,
}));

describe("CandidateFeedbackDialog Component", () => {
  const candidateMock = {
    userName: "John Doe",
    userEmail: "john@example.com",
    feedback: {
      score: 8,
      rating: {
        technicalSkills: 9,
        communication: 7,
        problemSolving: 8,
        experience: 8,
      },
      summary: "Strong candidate with good communication skills.",
      recommendation: "Recommended",
      recommendationMsg: "Highly recommended for the role.",
      questions: [
        {
          question: "Tell me about yourself.",
          userAnswer: "I am a developer.",
          feedback: "Good concise answer.",
          rating: 8
        }
      ]
    },
    asked_questions: [] // Fallback test
  };

  test("renders trigger button", () => {
    render(<CandidateFeedbackDialog candidate={candidateMock} />);
    expect(screen.getByText("View Report")).toBeInTheDocument();
  });

  test("renders feedback details correctly", () => {
    render(<CandidateFeedbackDialog candidate={candidateMock} />);
    
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Technical Skills")).toBeInTheDocument();
    expect(screen.getByText("9/10")).toBeInTheDocument();
    expect(screen.getAllByText("8/10")).toHaveLength(3); // Overall (8), Problem Solving (8), Experience (8)
    expect(screen.getByText("Strong candidate with good communication skills.")).toBeInTheDocument();
    expect(screen.getByText(/Recommendation: Recommended/i)).toBeInTheDocument();
    expect(screen.getByText("Highly recommended for the role.")).toBeInTheDocument();
  });

  test("renders Q&A section correctly", () => {
    render(<CandidateFeedbackDialog candidate={candidateMock} />);
    
    expect(screen.getByText("Interview Q&A")).toBeInTheDocument();
    expect(screen.getByText("Tell me about yourself.")).toBeInTheDocument();
    expect(screen.getByText(/"I am a developer."/i)).toBeInTheDocument();
    expect(screen.getByText("Good concise answer.")).toBeInTheDocument();
  });

  test("renders 'Not Recommended' styling", () => {
    const rejectedCandidate = {
      ...candidateMock,
      feedback: {
        ...candidateMock.feedback,
        recommendation: "Not Recommended",
        recommendationMsg: "Not a good fit.",
      }
    };
    render(<CandidateFeedbackDialog candidate={rejectedCandidate} />);
    expect(screen.getByText("Not a good fit.")).toBeInTheDocument();
    expect(screen.getByText(/Recommendation: Not Recommended/i)).toBeInTheDocument();
  });
});
