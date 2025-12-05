// __tests__/QuestionList.test.jsx


import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { toast } from "sonner";
import QuestionList from "@/app/(main)/dashboard/create-interview/_components/QuestionList";

// ✅ Mock axios and toast
jest.mock("axios");
jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

describe("QuestionList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles successful question generation", async () => {
    axios.post.mockResolvedValueOnce({
      data: { content: "Q1, Q2" },
    });

    render(<QuestionList formData={{ jobPosition: "Developer" }} />);

    // manually trigger GenerateQuestionList (if not auto-called)
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/ai-model", {
        jobPosition: "Developer",
      });
    });
  });

  test("handles API error and shows toast message", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: "Server error" } },
    });

    render(<QuestionList formData={{ jobPosition: "Developer" }} />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});
