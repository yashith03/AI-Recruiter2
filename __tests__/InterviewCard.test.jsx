import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InterviewCard from "../app/(main)/dashboard/_components/InterviewCard";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
    expect(screen.getByText(/Jan 01/i)).toBeInTheDocument();
  });

  test("copies the interview link to clipboard", () => {
    render(<InterviewCard interview={interviewMock} />);

    fireEvent.click(screen.getByText(/Copy Link/i));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://test.com/interview/abc123"
    );

    expect(toast.success).toHaveBeenCalledWith("Link copied to clipboard");
  });

  test("opens invite link when clicking Invite", () => {
    render(<InterviewCard interview={interviewMock} />);

    fireEvent.click(screen.getByText(/Invite/i));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("mailto:?subject=AI Recruiter Interview Invite"),
      "_blank"
    );
  });

  test("shows View Details button and correct link", () => {
    render(<InterviewCard interview={interviewMock} />);

    expect(screen.getByText(/View Details/i)).toBeInTheDocument();

    const detailLink = screen.getByRole("link");
    expect(detailLink).toHaveAttribute(
      "href",
      "/dashboard/create-interview/abc123/details"
    );
  });

  test("shows Resume Draft button when status is DRAFT", () => {
    const draftMock = { ...interviewMock, status: 'DRAFT' };
    render(<InterviewCard interview={draftMock} />);

    expect(screen.getByText(/Resume Draft/i)).toBeInTheDocument();
    
    const draftLink = screen.getByRole("link");
    expect(draftLink).toHaveAttribute(
      "href",
      "/dashboard/create-interview/abc123"
    );
  });
});
