import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PremiumInterviewCard from "@/app/(main)/_components/PremiumInterviewCard";
import { toast } from "sonner";
import "@testing-library/jest-dom";

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

describe("PremiumInterviewCard Component", () => {
  const activeInterview = {
    interview_id: "active-123",
    jobPosition: "Software Engineer",
    jobDescription: "Technical role",
    created_at: new Date().toISOString(),
    "interview-feedback": []
  };

  const completedInterview = {
    interview_id: "completed-456",
    jobPosition: "Product Designer",
    jobDescription: "Creative role",
    created_at: new Date().toISOString(),
    "interview-feedback": [{ id: 1 }]
  };

  test("renders active interview correctly", () => {
    render(<PremiumInterviewCard interview={activeInterview} />);
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText(/0 Active/i)).toBeInTheDocument();
    expect(screen.queryByText("Completed")).not.toBeInTheDocument();
  });

  test("renders completed interview with badge", () => {
    render(<PremiumInterviewCard interview={completedInterview} />);
    expect(screen.getByText("Product Designer")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText(/Finished/i)).toBeInTheDocument();
  });

  test("completed interview card is a link to details", () => {
    render(<PremiumInterviewCard interview={completedInterview} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/schedule-interview/completed-456/details");
  });

  test("invite button is disabled for completed interviews", () => {
    render(<PremiumInterviewCard interview={completedInterview} />);
    const inviteBtn = screen.getByRole("button", { name: /invite/i });
    expect(inviteBtn).toBeDisabled();
  });

  test("copies link to clipboard", () => {
    const writeText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText } });
    
    render(<PremiumInterviewCard interview={activeInterview} />);
    fireEvent.click(screen.getByText(/Copy Link/i));
    
    expect(writeText).toHaveBeenCalled();
    expect(toast).toHaveBeenCalledWith("Link copied to clipboard");
  });
});
