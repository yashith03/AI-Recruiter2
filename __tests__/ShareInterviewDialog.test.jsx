import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShareInterviewDialog from "@/app/(main)/_components/ShareInterviewDialog";
import { useUser } from "@/app/provider";
import { toast } from "sonner";
import "@testing-library/jest-dom";

// Mock useUser
jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
  },
}));

// Mock Dialog components (since they use Radix under the hood)
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
}));

describe("ShareInterviewDialog Component", () => {
  const interview = {
    interview_id: "test-id-123",
    jobPosition: "Frontend Developer",
  };

  const mockOpen = true;
  const mockOnClose = jest.fn();

  beforeEach(() => {
    useUser.mockReturnValue({ user: { email: "test@gmail.com" } });
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
    window.open = jest.fn();
    jest.clearAllMocks();
  });

  test("renders correctly when open", () => {
    render(<ShareInterviewDialog open={mockOpen} onClose={mockOnClose} interview={interview} />);
    expect(screen.getByText("Share Interview")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://localhost:3000/interview/test-id-123")).toBeInTheDocument();
  });

  test("copies link to clipboard", async () => {
    const writeText = jest.fn().mockResolvedValue();
    Object.assign(navigator, { clipboard: { writeText } });

    render(<ShareInterviewDialog open={mockOpen} onClose={mockOnClose} interview={interview} />);
    
    const copyBtn = screen.getByRole("button", { name: /copy link/i });
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("http://localhost:3000/interview/test-id-123");
      expect(toast.success).toHaveBeenCalledWith("Interview link copied to clipboard");
    });
  });

  test("opens gmail for gmail users", () => {
    render(<ShareInterviewDialog open={mockOpen} onClose={mockOnClose} interview={interview} />);
    fireEvent.click(screen.getByText(/Email/i));
    
    expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("mail.google.com"), 
        "_blank"
    );
  });

  test("opens whatsapp with correct text", () => {
    render(<ShareInterviewDialog open={mockOpen} onClose={mockOnClose} interview={interview} />);
    fireEvent.click(screen.getByText(/WhatsApp/i));
    
    expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("wa.me"), 
        "_blank"
    );
  });

  test("opens slack with correct text", () => {
    render(<ShareInterviewDialog open={mockOpen} onClose={mockOnClose} interview={interview} />);
    fireEvent.click(screen.getByText(/Slack/i));
    
    expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining("slack.com/share"), 
        "_blank"
    );
  });
});
