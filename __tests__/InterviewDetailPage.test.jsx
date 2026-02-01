// __tests__/InterviewDetailPage.test.jsx

import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InterviewDetail from "@/app/(main)/schedule-interview/[interview_id]/details/page";
import { useUser } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";

jest.mock("@/app/provider", () => ({
  useUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useParams: () => ({ interview_id: "abc-123" }),
}));

jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: () => ({
        // first eq("userEmail", email)
        eq: () => ({
          // second eq("interview_id", interview_id)
          eq: () =>
            Promise.resolve({
              data: [
                {
                  jobPosition: "Backend Engineer",
                  jobDescription: "APIs",
                  duration: "30 Min",
                  type: ["Technical"],
                  created_at: new Date().toISOString(),
                  questionList: [{ question: "Q1" }],
                  "interview-feedback": [],
                },
              ],
              error: null,
            }),
        }),
      }),
    })),
  },
}));

test("renders interview details and candidate list correctly", async () => {
  const mockDate = new Date().toISOString();
  useUser.mockReturnValue({ user: { email: "test@mail.com" } });
  
  supabase.from.mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [
            {
              jobPosition: "Backend Engineer",
              jobDescription: "Building APIs with Node.js",
              duration: "30 Min",
              type: ["Technical"],
              created_at: mockDate,
              questionList: [{ question: "Q1" }],
              "interview-feedback": [
                { id: 1, userName: "Alice", recommendation: true },
                { id: 2, userName: "Bob", recommendation: false }
              ],
            },
          ],
          error: null,
        }),
      }),
    }),
  });

  render(<InterviewDetail />);

  await waitFor(() => {
    expect(screen.getByText("Interview Details")).toBeInTheDocument();
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Candidates")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/1 Recommended/i)).toBeInTheDocument();
  });
});
