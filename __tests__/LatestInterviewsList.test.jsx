// __tests__/LatestInterviewsList.test.jsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LatestInterviewsList from "@/app/(main)/dashboard/_components/LatestInterviewsList";

// -----------------------------
// useUser mock
// -----------------------------
const mockUseUser = jest.fn();
jest.mock("@/app/provider", () => ({
  useUser: () => mockUseUser(),
}));

// -----------------------------
// Mock InterviewCard
// -----------------------------
jest.mock(
  "@/app/(main)/dashboard/_components/InterviewCard",
  () =>
    ({ interview }) =>
      <div data-testid="interview-card">{interview.jobPosition}</div>
);

// -----------------------------
// Supabase mock
// -----------------------------
const mockLimit = jest.fn();

jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: mockLimit,
          })),
        })),
      })),
    })),
  },
}));

const { supabase } = require("@/services/supabaseClient");

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// -----------------------------
// Tests
// -----------------------------
describe("LatestInterviewsList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test("renders empty state when no interviews are found", async () => {
    mockUseUser.mockReturnValue({ user: { email: "test@mail.com" } });

    mockLimit.mockResolvedValueOnce({ data: [], error: null });

    render(
      <QueryClientProvider client={queryClient}>
        <LatestInterviewsList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("No Interviews Created")).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Create New Interview/i })
    ).toBeInTheDocument();
  });

  test("renders InterviewCard items when data exists", async () => {
    mockUseUser.mockReturnValue({ user: { email: "test@mail.com" } });

    mockLimit.mockResolvedValueOnce({
      data: [
        { interview_id: "1", jobPosition: "Frontend Dev" },
        { interview_id: "2", jobPosition: "Backend Dev" },
      ],
      error: null,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LatestInterviewsList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("interview-card").length).toBe(2);
      expect(screen.getByText("Frontend Dev")).toBeInTheDocument();
      expect(screen.getByText("Backend Dev")).toBeInTheDocument();
    });
  });

  test("logs Supabase error", async () => {
    mockUseUser.mockReturnValue({ user: { email: "test@mail.com" } });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    mockLimit.mockResolvedValueOnce({
      data: null,
      error: { message: "Database failure" },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <LatestInterviewsList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Supabase error:",
        "Database failure"
      );
    });

    consoleSpy.mockRestore();
  });

  test("does not call supabase when user = null", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(
      <QueryClientProvider client={queryClient}>
        <LatestInterviewsList />
      </QueryClientProvider>
    );

    expect(supabase.from).not.toHaveBeenCalled();
  });
});
