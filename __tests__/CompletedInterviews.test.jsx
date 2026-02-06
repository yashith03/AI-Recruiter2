import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CompletedInterviews from "@/app/(main)/completed-interview/page";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import "@testing-library/jest-dom";

jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

jest.mock("@/services/supabaseClient", () => {
  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockOrder = jest.fn();

  return {
    supabase: {
      from: jest.fn(() => ({
        select: mockSelect,
      })),
    },
    _mockSelect: mockSelect,
    _mockEq: mockEq,
    _mockOrder: mockOrder
  };
});

// Import the internal mock parts to verify calls if needed
const { _mockSelect } = require("@/services/supabaseClient");

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("CompletedInterviews Page", () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: { email: "test@example.com" } });
    jest.clearAllMocks();
    queryClient.clear();
  });

  test("renders empty state when no completed interviews found", async () => {
    _mockSelect.mockReturnValue({
      eq: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CompletedInterviews />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No Completed Interviews Yet/i)).toBeInTheDocument();
    });
  });

  test("renders list of completed interviews", async () => {
    const mockData = [
      { 
        interview_id: "int-1", 
        jobPosition: "Manager", 
        created_at: new Date().toISOString(),
        "interview-feedback": [{ id: 1 }] 
      }
    ];

    _mockSelect.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({ data: mockData, error: null })
        })
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CompletedInterviews />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Manager")).toBeInTheDocument();
    });
  });
});
