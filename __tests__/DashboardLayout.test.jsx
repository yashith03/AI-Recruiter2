import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardLayout from "@/app/(main)/layout";

// ✅ Mock DashboardProvider
jest.mock("@/app/(main)/provider", () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="dashboard-provider">{children}</div>
  ),
}));

// ✅ Mock WelcomeContainer
jest.mock("@/app/(main)/dashboard/_components/WelcomeContainer", () => () => (
  <div data-testid="welcome-container">WelcomeContainer</div>
));

describe("DashboardLayout", () => {
  test("renders DashboardProvider, WelcomeContainer, and children", () => {
    render(
      <DashboardLayout>
        <div data-testid="child-content">Child Content</div>
      </DashboardLayout>
    );

    // ✅ Ensure layout renders wrapper provider
    expect(screen.getByTestId("dashboard-provider")).toBeInTheDocument();

    // ✅ Ensure WelcomeContainer is displayed
    expect(screen.getByTestId("welcome-container")).toBeInTheDocument();

    // ✅ Ensure children are rendered
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  test("children appear inside DashboardProvider", () => {
    render(
      <DashboardLayout>
        <p data-testid="nested-child">Nested Child</p>
      </DashboardLayout>
    );

    const provider = screen.getByTestId("dashboard-provider");
    const child = screen.getByTestId("nested-child");

    // ✅ Ensure child is nested within provider
    expect(provider).toContainElement(child);
  });
});
