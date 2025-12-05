// __tests__/Dashboard.test.jsx

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "@/app/(main)/dashboard/page";

// ✅ Mock all child components
jest.mock("@/app/(main)/dashboard/_components/WelcomeContainer", () => () => (
  <div data-testid="welcome-container">WelcomeContainer</div>
));

jest.mock("@/app/(main)/dashboard/_components/CreateOptions", () => () => (
  <div data-testid="create-options">CreateOptions</div>
));

jest.mock("@/app/(main)/dashboard/_components/LatestInterviewsList", () => () => (
  <div data-testid="latest-interviews">LatestInterviewsList</div>
));

describe("Dashboard Page", () => {
  test("renders title and all main sections", () => {
    render(<Dashboard />);

    // ✅ Main heading
    expect(screen.getByText("Dashboard")).toBeInTheDocument();

    // ✅ Child sections
    expect(screen.getByTestId("create-options")).toBeInTheDocument();
    expect(screen.getByTestId("latest-interviews")).toBeInTheDocument();
  });

  test("renders in correct structure order", () => {
    render(<Dashboard />);
    const heading = screen.getByText("Dashboard");
    const createOptions = screen.getByTestId("create-options");
    const latest = screen.getByTestId("latest-interviews");

    // ✅ Ensure correct order (heading → CreateOptions → LatestInterviewsList)
    expect(heading.compareDocumentPosition(createOptions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(createOptions.compareDocumentPosition(latest) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
