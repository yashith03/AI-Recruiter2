import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateInterview from "@/app/(main)/dashboard/create-interview/page";
import { toast } from "sonner";
import React from "react";

// ✅ mock router
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack }),
}));

// ✅ mock child components
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }) => <div data-testid="progress">{value}</div>,
}));

jest.mock(
  "@/app/(main)/dashboard/create-interview/_components/FormContainer",
  () => (props) => (
    <div data-testid="form-container">
      <button
        data-testid="next-btn"
        onClick={() => props.GoToNext()}
      >
        Next
      </button>
      <button
        data-testid="fill-btn"
        onClick={() => {
          props.onHandleInputChange("jobPosition", "Dev");
          props.onHandleInputChange("jobDescription", "Desc");
          props.onHandleInputChange("duration", "30 Min");
          props.onHandleInputChange("type", ["Video Interview"]);
        }}
      >
        Fill Data
      </button>
    </div>
  )
);

jest.mock(
  "@/app/(main)/dashboard/create-interview/_components/QuestionList",
  () => (props) => (
    <div data-testid="question-list">
      Loaded Questions for {props.formData.jobPosition}
    </div>
  )
);

jest.mock("sonner", () => ({
  toast: { error: jest.fn() },
}));

describe("CreateInterview Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders title and progress bar", () => {
    render(<CreateInterview />);
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
    expect(screen.getByTestId("progress")).toHaveTextContent("33.33");
  });

  test("renders FormContainer at step 1", () => {
    render(<CreateInterview />);
    expect(screen.getByTestId("form-container")).toBeInTheDocument();
  });

  test("shows toast when required fields missing", () => {
    render(<CreateInterview />);
    fireEvent.click(screen.getByTestId("next-btn"));
    expect(toast.error).toHaveBeenCalledWith("Please fill all the fields");
  });

  test("moves to QuestionList when all fields filled", () => {
    render(<CreateInterview />);
    fireEvent.click(screen.getByTestId("fill-btn"));
    fireEvent.click(screen.getByTestId("next-btn"));
    expect(screen.getByTestId("question-list")).toBeInTheDocument();
  });

  test("calls router.back() when back arrow clicked", () => {
    render(<CreateInterview />);
    fireEvent.click(screen.getByRole("img", { hidden: true })); // lucide icon is rendered as <svg>
    // safer alternative if lucide icon not accessible by role:
    // fireEvent.click(screen.getByText("Create New Interview").previousSibling)
    expect(mockBack).toHaveBeenCalled();
  });
});
