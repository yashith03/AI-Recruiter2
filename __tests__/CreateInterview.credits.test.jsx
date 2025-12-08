// __tests__/CreateInterview.credits.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import CreateInterview from "@/app/(main)/dashboard/create-interview/page";
import Provider from "@/app/provider";
import { toast } from "sonner";

// ----------------------------
// MOCKS
// ----------------------------

// Mock toast.error
jest.mock("sonner", () => ({
  toast: { error: jest.fn(), success: jest.fn() }
}));

// ⭐ Keep Provider real, mock ONLY useUser so credit = 0
jest.mock("@/app/provider", () => {
  const original = jest.requireActual("@/app/provider");
  return {
    __esModule: true,
    ...original,
    useUser: () => ({
      user: { email: "x@test.com", credits: 0 }
    })
  };
});

// Mock Progress
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }) => <div data-testid="progress">{value}</div>
}));

// Mock router
const mockBack = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ back: mockBack })
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

// ----------------------------
// HELPER
// ----------------------------

const renderWithProvider = () =>
  render(
    <Provider>
      <CreateInterview />
    </Provider>
  );

// ----------------------------
// TEST
// ----------------------------

describe("CreateInterview – credit validation", () => {
  beforeEach(() => jest.clearAllMocks());

  test("blocks next step and shows credit error when user has 0 credits", () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId("fill-btn")); // fill all fields
    fireEvent.click(screen.getByTestId("next-btn")); // try to advance

    expect(toast.error).toHaveBeenCalledWith(
      "You have no credits to create an interview. Please top up your credits."
    );
  });
});
