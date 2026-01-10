import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "sonner";
import QuestionList from "@/app/(main)/dashboard/create-interview/_components/QuestionList";

// --------------------------------------------------
// MOCKS
// --------------------------------------------------
jest.mock("axios");
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock("@/app/provider", () => ({
  useUser: () => ({
    user: { email: "test@mail.com", credits: 3 },
  }),
}));

// supabase mock with dynamic overrides
jest.mock("@/services/supabaseClient", () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({
          data: [{ interview_id: "123" }],
          error: null,
        }),
      })),
      update: jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ error: null }),
      })),
    })),
  },
}));

jest.mock("uuid", () => ({
  v4: () => "mock-uuid-123",
}));

// --------------------------------------------------
// TEST SUITE
// --------------------------------------------------
describe("QuestionList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state when initialQuestionList is empty", () => {
    render(<QuestionList formData={{ jobPosition: "Dev" }} initialQuestionList={[]} />);
    expect(screen.getByText(/Finalizing Questions/i)).toBeInTheDocument();
  });

  test("renders question list when initialQuestionList is provided", async () => {
    const questions = [{ question: "Q1", answer: "A1" }];
    render(<QuestionList formData={{ jobPosition: "Dev" }} initialQuestionList={questions} />);
    
    expect(screen.queryByText(/Finalizing Questions/i)).not.toBeInTheDocument();
  });

  test("prevents finish when loading/no questions (button disabled)", async () => {
    render(<QuestionList formData={{ jobPosition: "Dev" }} initialQuestionList={[]} />);
    
    const finishBtn = screen.getByText(/Create Interview Link/i);
    expect(finishBtn).toBeDisabled();
  });

  test("successfully finishes and calls onCreateLink", async () => {
    const mockFn = jest.fn();
    const questions = [{ question: "Q1", answer: "A1" }];

    render(
      <QuestionList 
        formData={{ jobPosition: "Dev", duration: "30 Min", type: "Video" }} 
        initialQuestionList={questions} 
        onCreateLink={mockFn} 
      />
    );

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(mockFn).toHaveBeenCalledWith("mock-uuid-123")
    );

    expect(toast.success).toHaveBeenCalledWith("Interview created successfully!");
  });

  test("handles supabase insert error", async () => {
    const { supabase } = require("@/services/supabaseClient");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    supabase.from.mockImplementationOnce(() => ({
      insert: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({
          data: null,
          error: { message: "DB failure" },
        }),
      })),
    }));

    const questions = [{ question: "Q1", answer: "A1" }];
    render(<QuestionList formData={{ jobPosition: "Dev" }} initialQuestionList={questions} onCreateLink={jest.fn()} />);

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Failed to save interview: DB failure")
    );

    consoleSpy.mockRestore();
  });
});
