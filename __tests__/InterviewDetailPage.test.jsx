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

test("renders interview details correctly", async () => {
  useUser.mockReturnValue({ user: { email: "test@mail.com" } });

  render(<InterviewDetail />);

  await waitFor(() => {
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
  });
});
