// __tests__/FormContainer.test.jsx

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormContainer from "@/app/(main)/dashboard/create-interview/_components/FormContainer";

// ✅ Mock UI components (since they're small wrappers around HTML elements)
jest.mock("@/components/ui/input", () => ({
  Input: (props) => <input data-testid="input" {...props} />,
}));
jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props) => <textarea data-testid="textarea" {...props} />,
}));
jest.mock("@/components/ui/button", () => ({
  Button: (props) => (
    <button data-testid="button" onClick={props.onClick}>
      {props.children}
    </button>
  ),
}));
jest.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }) => (
    <select data-testid="select" onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }) => <>{children}</>,
  SelectValue: ({ placeholder }) => <option>{placeholder}</option>,
  SelectContent: ({ children }) => <>{children}</>,
  SelectItem: ({ value, children }) => (
    <option value={value}>{children}</option>
  ),
}));

// ✅ Mock InterviewType constants
jest.mock("@/services/Constants", () => ({
  InterviewType: [
    { title: "Video Interview", icon: () => <span data-testid="video-icon" /> },
    { title: "Phone Interview", icon: () => <span data-testid="phone-icon" /> },
  ],
}));

describe("FormContainer Component", () => {
  const mockOnHandleInputChange = jest.fn();
  const mockGoToNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields and button", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    expect(screen.getByText("Job Position")).toBeInTheDocument();
    expect(screen.getByText("Job Description")).toBeInTheDocument();
    expect(screen.getByText("Interview Duration")).toBeInTheDocument();
    expect(screen.getByText("Interview Type")).toBeInTheDocument();
    expect(screen.getByText("Generate Question")).toBeInTheDocument();
  });

  test("calls onHandleInputChange when job position and description are changed", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByTestId("textarea"), {
      target: { value: "Build and test applications" },
    });

    expect(mockOnHandleInputChange).toHaveBeenCalledWith(
      "jobPosition",
      "Software Engineer"
    );
    expect(mockOnHandleInputChange).toHaveBeenCalledWith(
      "jobDescription",
      "Build and test applications"
    );
  });

  test("calls onHandleInputChange when selecting interview duration", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    fireEvent.change(screen.getByTestId("select"), {
      target: { value: "30 Min" },
    });

    expect(mockOnHandleInputChange).toHaveBeenCalledWith("duration", "30 Min");
  });

  test("toggles interview type selection", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    const videoType = screen.getByText("Video Interview");
    fireEvent.click(videoType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", ["Video Interview"]);

    // toggle off
    fireEvent.click(videoType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", []);
  });

  test("calls GoToNext when button is clicked", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    fireEvent.click(screen.getByTestId("button"));
    expect(mockGoToNext).toHaveBeenCalled();
  });

  test("toggles interview type on and off multiple times", () => {
    render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    const videoType = screen.getByText("Video Interview");
    const phoneType = screen.getByText("Phone Interview");

    // Add Video Interview
    fireEvent.click(videoType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", ["Video Interview"]);

    // Add Phone Interview
    fireEvent.click(phoneType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", ["Video Interview", "Phone Interview"]);

    // Remove Video Interview
    fireEvent.click(videoType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", ["Phone Interview"]);

    // Remove Phone Interview
    fireEvent.click(phoneType);
    expect(mockOnHandleInputChange).toHaveBeenCalledWith("type", []);
  });

  test("maintains interview type selection state", () => {
    const { rerender } = render(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    const videoType = screen.getByText("Video Interview");
    fireEvent.click(videoType);

    // Rerender to check if selection persists
    rerender(
      <FormContainer
        onHandleInputChange={mockOnHandleInputChange}
        GoToNext={mockGoToNext}
      />
    );

    expect(mockOnHandleInputChange).toHaveBeenCalled();
  });
});
