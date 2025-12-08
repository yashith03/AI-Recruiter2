import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InterviewCard from "../app/(main)/dashboard/_components/InterviewCard";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: jest.fn(),
}));

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

let openSpy;

beforeEach(() => {
  openSpy = jest.spyOn(window, "open").mockImplementation(() => {});
  process.env.NEXT_PUBLIC_BASE_URL = "https://test.com";
  jest.clearAllMocks();
});

afterEach(() => {
  openSpy.mockRestore();
});

describe("InterviewCard Component", () => {
  const interviewMock = {
    interview_id: "abc123",
    jobPosition: "Frontend Developer",
    duration: "30 Min",
    created_at: "2025-01-01T12:00:00Z",
    "interview-feedback": [{ id: 1 }, { id: 2 }],
  };

  test("renders interview information correctly", () => {
    render(<InterviewCard interview={interviewMock} />);

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("30 Min")).toBeInTheDocument();
    expect(screen.getByText("2 Candidates")).toBeInTheDocument();
    expect(screen.getByText("01 Jan 2025")).toBeInTheDocument();
  });

  test("copies the interview link to clipboard", () => {
    render(<InterviewCard interview={interviewMock} />);

    fireEvent.click(screen.getByText(/Copy Link/i));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://test.com/abc123"
    );

    expect(toast).toHaveBeenCalledWith("Copied");
  });

  test("redirects to mailto link when clicking Send", () => {
    render(<InterviewCard interview={interviewMock} />);

    fireEvent.click(screen.getByText(/Send/i));

    expect(openSpy).toHaveBeenCalledWith(
      "mailto:accounts@yashithc.dev@gmail.com?subject=AI Recruiter Interview Link&body=Interview Link https://test.com/abc123",
      "_self"
    );
  });

  test("shows View Detail button when viewDetail = true", () => {
    render(<InterviewCard interview={interviewMock} viewDetail />);

    expect(screen.getByText(/View Detail/i)).toBeInTheDocument();

    const detailLink = screen.getByRole("link");
    expect(detailLink).toHaveAttribute(
      "href",
      "/schedule-interview/abc123/details"
    );
  });

  test("hides Copy and Send buttons when viewDetail = true", () => {
    render(<InterviewCard interview={interviewMock} viewDetail />);

    expect(screen.queryByText(/Copy Link/i)).toBeNull();
    expect(screen.queryByText(/Send/i)).toBeNull();
  });
});
