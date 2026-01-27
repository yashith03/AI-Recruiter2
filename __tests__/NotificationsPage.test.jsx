import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NotificationsPage from "@/app/(main)/notifications/page";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import "@testing-library/jest-dom";

// Mock next/image
jest.mock("next/image", () => (props) => <img {...props} />);

jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: [
              {
                id: 1,
                userName: "John Doe",
                interview_id: "int-123",
                created_at: new Date().toISOString(),
                interviews: { jobPosition: "Software Engineer" }
              }
            ],
            error: null,
          }),
        }),
      }),
    })),
  },
}));

describe("NotificationsPage", () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { email: "test@mail.com" } });
    jest.clearAllMocks();
  });

  test("renders notifications title and dynamically fetched items", async () => {
    render(<NotificationsPage />);
    
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText(/Interview Completed: John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe has finished the interview/i)).toBeInTheDocument();
    });
  });

  test("renders action buttons from real data", async () => {
    render(<NotificationsPage />);
    
    await waitFor(() => {
        expect(screen.getByText("Show feedback")).toBeInTheDocument();
    });
  });

  test("filters unread notifications correctly", async () => {
    render(<NotificationsPage />);
    
    await waitFor(() => {
      expect(screen.getByText("Unread")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Unread"));

    await waitFor(() => {
        expect(screen.getByText(/Interview Completed: John Doe/i)).toBeInTheDocument();
    });
  });
});
