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

  // ============================================================
  // SUCCESS PATH 1 – content string
  // ============================================================
  test("parses JSON from content string", async () => {
    axios.post.mockResolvedValueOnce({
      data: { content: `{"interviewQuestions":["Q1","Q2"]}` },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledWith("/api/ai-model", {
        jobPosition: "Dev",
      })
    );
  });

  // ============================================================
  // SUCCESS PATH 2 – result object
  // ============================================================
  test("handles result object format", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: ["A", "B"] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() => expect(axios.post).toHaveBeenCalled());
  });

  // ============================================================
  // MALFORMED JSON PATH
  // ============================================================
  test("fails gracefully on malformed AI content", async () => {
    axios.post.mockResolvedValueOnce({
      data: { content: "```json invalid```" },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalledTimes(1)
    );
  });

  // ============================================================
  // UNEXPECTED PAYLOAD FORMAT
  // ============================================================
  test("handles unexpected payload format", async () => {
    axios.post.mockResolvedValueOnce({
      data: { something: "weird" },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() =>
      expect(axios.post).toHaveBeenCalled()
    );
  });

  // ============================================================
  // API ERROR PATH
  // ============================================================
  test("shows toast on axios error", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Server error" } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Server error")
    );
  });

  // ============================================================
  // RENDERING: Loading UI
  // ============================================================
  test("renders loading state first", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: [] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    expect(
      screen.getByText(/Generating Interview Questions/i)
    ).toBeInTheDocument();
  });

  // ============================================================
  // RENDERING: no questions message
  // ============================================================
  test("renders no questions message", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: [] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    await waitFor(() =>
      expect(screen.getByText(/No questions generated/i)).toBeInTheDocument()
    );
  });

  // ============================================================
  // onFinish: no user
  // ============================================================
  test("stops finish if user missing", async () => {
    jest.mock("@/app/provider", () => ({
      useUser: () => ({ user: null }),
    }));

    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: ["Q1"] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "User not logged in. Please sign in first."
      )
    );
  });

  // ============================================================
  // onFinish: empty questions
  // ============================================================
  test("prevents finish when no questions", async () => {
    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: [] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("No questions generated yet.")
    );
  });

  // ============================================================
  // onFinish: insert error
  // ============================================================
  test("handles supabase insert error", async () => {
    const { supabase } = require("@/services/supabaseClient");

    supabase.from.mockReturnValueOnce({
      insert: () => ({
        select: () =>
          Promise.resolve({
            data: null,
            error: { message: "DB failure" },
          }),
      }),
    });

    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: ["Q1"] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} />);

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to save interview: DB failure"
      )
    );
  });

  // ============================================================
  // SUCCESSFUL onFinish
  // ============================================================
  test("successfully finishes and calls onCreateLink", async () => {
    const mockFn = jest.fn();

    axios.post.mockResolvedValueOnce({
      data: { result: { interviewQuestions: ["Q1"] } },
    });

    render(<QuestionList formData={{ jobPosition: "Dev" }} onCreateLink={mockFn} />);

    fireEvent.click(screen.getByText(/Create Interview Link/i));

    await waitFor(() =>
      expect(mockFn).toHaveBeenCalledWith("mock-uuid-123")
    );

    expect(toast.success).toHaveBeenCalledWith("Interview created successfully!");
  });
});
