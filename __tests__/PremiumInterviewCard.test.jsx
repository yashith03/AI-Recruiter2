import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PremiumInterviewCard from "@/app/(main)/_components/PremiumInterviewCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// Mock child components to simplify testing
jest.mock("@/app/(main)/_components/ShareInterviewDialog", () => {
  return ({ open }) => (open ? <div data-testid="share-dialog">Share Dialog</div> : null);
});

// Mock AlertDialog
jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children, open }) => (open ? <div data-testid="alert-dialog">{children}</div> : null),
  AlertDialogContent: ({ children }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }) => <div>{children}</div>,
  AlertDialogAction: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({ children }) => <button>{children}</button>,
}));

describe("PremiumInterviewCard Component", () => {
  const interview = {
    interview_id: "test-id-123",
    jobPosition: "Frontend Engineer",
    created_at: new Date().toISOString(),
    "interview-feedback": [], // No feedback means active
  };

  const mockRouter = { push: jest.fn() };
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  test("renders interview title and copy link button", () => {
    render(<PremiumInterviewCard interview={interview} />);
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Copy Link/i)).toBeInTheDocument();
  });

  test("opens share dialog when share button is clicked", () => {
    render(<PremiumInterviewCard interview={interview} />);
    fireEvent.click(screen.getByText(/Share/i));
    expect(screen.getByTestId("share-dialog")).toBeInTheDocument();
  });

  test("shows actions menu when three-dot icon is clicked", () => {
    render(<PremiumInterviewCard interview={interview} />);
    // The button has the MoreVertical icon. We can find it by its accessibility or index.
    // It's a button inside the relative container.
    const menuBtn = screen.getByRole("button", { name: "" }); // Find the icon button
    fireEvent.click(menuBtn);
    
    expect(screen.getByText(/View Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Interview/i)).toBeInTheDocument();
  });

  test("navigates to details when 'View Details' is clicked in menu", () => {
    render(<PremiumInterviewCard interview={interview} />);
    // Open menu
    fireEvent.click(screen.getAllByRole("button")[0]); 
    // Click View Details
    fireEvent.click(screen.getByText(/View Details/i));
    
    expect(mockRouter.push).toHaveBeenCalledWith(
        expect.stringContaining("/details")
    );
  });

  test("opens delete confirmation dialog", () => {
    render(<PremiumInterviewCard interview={interview} />);
    // Open menu
    fireEvent.click(screen.getAllByRole("button")[0]); 
    // Click Delete
    fireEvent.click(screen.getByText(/Delete Interview/i));
    
    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByText(/Delete Interview\?/i)).toBeInTheDocument();
  });

  test("calls handleDelete and onRefresh when confirmed", async () => {
    render(<PremiumInterviewCard interview={interview} onRefresh={mockOnRefresh} />);
    // Open menu and delete dialog
    fireEvent.click(screen.getAllByRole("button")[0]); 
    fireEvent.click(screen.getByText(/Delete Interview/i));
    
    // Click confirm delete in dialog
    fireEvent.click(screen.getByText("Delete Interview"));
    
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith("interviews");
      expect(toast.success).toHaveBeenCalledWith("Interview deleted successfully");
      expect(mockOnRefresh).toHaveBeenCalled();
    });
  });
});
