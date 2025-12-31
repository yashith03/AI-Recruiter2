// __tests__/CreateInterview.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import CreateInterview from "@/app/(main)/dashboard/create-interview/page";
import Provider from "@/app/provider";
import { toast } from "sonner";

// -------------------------
// MOCKS
// -------------------------

jest.mock("sonner", () => ({ toast: { error: jest.fn(), success: jest.fn() } }));

// ✅ Keep Provider real, mock ONLY useUser()
jest.mock("@/app/provider", () => {
  const original = jest.requireActual("@/app/provider");
  return {
    __esModule: true,
    ...original,
    useUser: () => ({ user: { email: "test@mail.com", credits: 1 } })
  };
});

// Mock router
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack })
}));

// Mock Progress
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }) => <div data-testid="progress">{value}</div>
}));

// Mock FormContainer (step 1)
jest.mock(
  "@/app/(main)/dashboard/create-interview/_components/FormContainer",
  () => (props) => (
    <div data-testid="form-container">
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
      <button data-testid="next-btn" onClick={() => props.GoToNext()}>
        Next
      </button>
    </div>
  )
);

// Mock QuestionList (step 2)
jest.mock(
  "@/app/(main)/dashboard/create-interview/_components/QuestionList",
  () => (props) => (
    <div data-testid="question-list">
      Loaded Questions for {props.formData.jobPosition}
      <button
        data-testid="create-link-btn"
        onClick={() => props.onCreateLink("link-xyz")}
      >
        Create
      </button>
    </div>
  )
);

// Mock InterviewLink (step 3)
jest.mock(
  "@/app/(main)/dashboard/create-interview/_components/InterviewLink",
  () => (props) => (
    <div data-testid="interview-link">
      Interview Link: {props.interview_id}
    </div>
  )
);

// Helper renderer
const renderWithProvider = () =>
  render(
    <Provider>
      <CreateInterview />
    </Provider>
  );

// -------------------------
// TESTS
// -------------------------

describe("CreateInterview Page", () => {
  beforeEach(() => jest.clearAllMocks());

  test("renders title and progress bar", () => {
    renderWithProvider();
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
    expect(screen.getByTestId("progress")).toHaveTextContent("33.33");
  });

  test("renders FormContainer at step 1", () => {
    renderWithProvider();
    expect(screen.getByTestId("form-container")).toBeInTheDocument();
  });

  test("shows toast when required fields missing", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("next-btn")); // no fields
    expect(toast.error).toHaveBeenCalledWith("Please fill all the fields");
  });

  test("moves to QuestionList when filled", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ result: { interviewQuestions: [{ question: "Q1", answer: "A1" }] } })
    });

    renderWithProvider();
    fireEvent.click(screen.getByTestId("fill-btn"));
    fireEvent.click(screen.getByTestId("next-btn"));

    expect(await screen.findByTestId("question-list")).toBeInTheDocument();
  });

  test("moves to InterviewLink on Create Link", async () => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ result: { interviewQuestions: [{ question: "Q1", answer: "A1" }] } })
    });

    renderWithProvider();
    fireEvent.click(screen.getByTestId("fill-btn"));
    fireEvent.click(screen.getByTestId("next-btn"));
    
    const createBtn = await screen.findByTestId("create-link-btn");
    fireEvent.click(createBtn);

    expect(await screen.findByTestId("interview-link")).toBeInTheDocument();
  });

  test("calls router.back on back arrow", () => {
    renderWithProvider();
    fireEvent.click(screen.getByTestId("back-arrow"));
    expect(mockBack).toHaveBeenCalled();
  });
});
