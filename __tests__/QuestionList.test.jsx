import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import QuestionList from "@/app/(main)/dashboard/create-interview/_components/QuestionList";
import axios from "axios";
import { toast } from "sonner";
import React from "react";

// ✅ Mock dependencies
jest.mock("axios");
jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

describe("QuestionList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner initially", () => {
    render(<QuestionList formData={{ jobPosition: "Developer" }} />);

    expect(screen.getByText("Generating Interview Questions")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Our AI is crafting personalized questions bases on your job position"
      )
    ).toBeInTheDocument();
  });

  test("handles successful question generation", async () => {
    axios.post.mockResolvedValueOnce({
      data: { content: "AI Question List" },
    });

    render(<QuestionList formData={{ jobPosition: "Developer" }} />);

    // simulate calling the internal function (not automatically called in code yet)
    const instance = require("@/app/(main)/dashboard/create-interview/_components/QuestionList");
    await instance.default.prototype?.GenerateQuestionList?.();

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

    render(<QuestionList formData={{ jobPosition: "Tester" }} />);

    // Access internal method via manual trigger (since useEffect doesn’t call it yet)
    const instance = require("@/app/(main)/dashboard/create-interview/_components/QuestionList");
    await instance.default.prototype?.GenerateQuestionList?.();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
    });
  });
});
