// __tests__/LatestInterviewsList.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
// Mock the provider hook so tests run without the Provider wrapper
jest.mock('@/app/provider', () => ({
  useUser: () => ({ user: null })
}));

import LatestInterviewsList from "@/app/(main)/dashboard/_components/LatestInterviewsList";

// Mock lucide-react Video icon
jest.mock("lucide-react", () => ({
  Video: (props) => <svg data-testid="video-icon" {...props} />,
}));

// Mock Button component (we only need to check text, not styling)
jest.mock("@/components/ui/button", () => ({
  Button: ({ children }) => <button>{children}</button>,
}));

describe("LatestInterviewsList Component", () => {
  test("renders section title", () => {
    render(<LatestInterviewsList />);
    expect(screen.getByText("Previously Created Interviews")).toBeInTheDocument();
  });

  test("renders empty state when no interviews exist", () => {
    render(<LatestInterviewsList />);

    // Empty state UI
    expect(screen.getByTestId("video-icon")).toBeInTheDocument();
    expect(screen.getByText("No Interviews Created")).toBeInTheDocument();
    expect(screen.getByText("Create New Interview")).toBeInTheDocument();
  });

  test("does not crash when interviews array is empty", () => {
    const { container } = render(<LatestInterviewsList />);
    expect(container).toBeTruthy();
  });
});
